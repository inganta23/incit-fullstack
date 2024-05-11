const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const bcrypt = require('bcrypt');
const config = require("../config");
const { registerUser, createUserSession, updateUserLoggedInStatus } = require("../services/authServices");
const { sendVerificationEmail } = require('../helper/verification');
const { PrismaClient } = require('@prisma/client')
const jwt = require("jsonwebtoken");
const { findUserByEmail } = require('../services/userServices');

const prisma = new PrismaClient()

const oAuth2Client = new OAuth2Client(
    config.clientId,
    config.clientSecret,
    'postmessage',
);

const getGoogleUserInfo = async (accessToken) => {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
};

const getGoogleAccessToken = async (code) => {
    const { tokens } = await oAuth2Client.getToken(code);
    return tokens;
};

const handleUserRegistrationOrLogin = async (userInfo, type) => {
    const isUserExist = await findUserByEmail(userInfo.email);

    if (type === 'register') {
        if (isUserExist) {
            throw new Error('User is already registered');
        }

        const userData = {
            email: userInfo.email,
            username: userInfo.name,
            isgoogleauth: true,
        };

        const registeredUser = await registerUser(userData);

        return registeredUser;
    } else {
        if (!isUserExist) {
            throw new Error('User is not registered');
        }

        return isUserExist;
    }
};

const googleAuth = async (req, res) => {
    try {
        const { code } = req.body;
        const { type } = req.query;

        const tokens = await getGoogleAccessToken(code);
        const userInfo = await getGoogleUserInfo(tokens.access_token);

        if (!userInfo) {
            return res.status(404).json({ message: "There is no user info" });
        }

        const user = await handleUserRegistrationOrLogin(userInfo, type);

        await prisma.$transaction(async (prisma) => {
            await createUserSession(prisma, user.id);
            await updateUserLoggedInStatus(prisma, user.email);
        });

        return res.json({
            ...userInfo,
            message: type === 'register' ? 'User registered successfully' : 'User login successfully',
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            isGoogleAuth: true,
        });
    } catch (error) {
        console.error('Error in /auth/google:', error);
        return res.status(500).json({ error: error });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const lowerCaseRegex = /[a-z]/;
        const upperCaseRegex = /[A-Z]/;
        const digitRegex = /[0-9]/;
        const specialCharRegex = /[$&+,:;=?@#|'<>.^*()%!-]/;
        const minLength = 8;

        if (
            !lowerCaseRegex.test(password) ||
            !upperCaseRegex.test(password) ||
            !digitRegex.test(password) ||
            !specialCharRegex.test(password) ||
            password.length < minLength
        ) {
            return res.status(400).json({
                error: 'Password must contain at least one lower case character, one upper case character, one digit, one special character, and be at least 8 characters long.'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            username: name,
            email,
            password: hashedPassword,
            emailverified: false,
        }
        await prisma.$transaction(async (prisma) => {
            const user = await prisma.users.create({
                data: userData,
            });
            sendVerificationEmail({ email: user.email, name: user.username });
        });
        res.json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: error?.message });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, config.secret);
        const user = await findUserByEmail(decoded.email);
        if (!user) return res.status(401).json({ message: "This user is not registered" })
        if (user.emailverified) return res.status(400).json({ message: "This user is verified" })
        await prisma.users.update({
            where: { email: decoded.email },
            data: { emailverified: true },
        });
        await prisma.$transaction(async (prisma) => {
            await prisma.user_sessions.create({
                data: {
                    user_id: user.id,
                    event_type: 'login',
                    timestamp: new Date(),
                },
            });

            await prisma.users.update({
                where: { email: user.email },
                data: { isloggedin: true },
            });
        });
        res.cookie("access_token", token)
        return res.redirect(config.clientUrl);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.emailverified) {
            return res.status(404).json({ error: 'User is not verified' });
        }

        if (user.isloggedin) {
            return res.status(400).json({ error: 'User is already logged in' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        await prisma.$transaction(async (prisma) => {
            await prisma.user_sessions.create({
                data: {
                    user_id: user.id,
                    event_type: 'login',
                    timestamp: new Date(),
                },
            });

            await prisma.users.update({
                where: { email: user.email },
                data: { isloggedin: true },
            });
        });
        const token = jwt.sign({ email: user.email, name: user.username }, config.secret, { expiresIn: '1d' });
        res.json({ message: 'Login successful', access_token: token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logout = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.isloggedin) {
            return res.status(400).json({ error: 'User is not logged in' });
        }

        await prisma.$transaction(async (prisma) => {
            await prisma.user_sessions.create({
                data: {
                    user_id: user.id,
                    event_type: 'logout',
                    timestamp: new Date(),
                },
            });

            await prisma.users.update({
                where: { email: user.email },
                data: { isloggedin: false },
            });
        });
        return res.json({ message: 'Logout successful' });

    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { googleAuth, register, verifyEmail, login, logout }