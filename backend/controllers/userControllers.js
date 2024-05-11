const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const jwt = require('jsonwebtoken')
const config = require('../config');
const { updateUsername, findAllUsers, findAllUserSession, grouppedUserSession, findUserByEmail } = require('../services/userServices');
const prisma = new PrismaClient()

const userInfo = async (req, res) => {
    try {
        const { accessToken } = req;
        const { google } = req.query
        let userInfo = {};
        if (google === 'true') {
            userInfo = await axios
                .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            const userDb = await findUserByEmail(userInfo.data?.email);
            userInfo.data.name = userDb.username
        } else {
            const decoded = jwt.verify(accessToken, config.secret);
            userInfo.data = decoded;
        }
        return res.json({ user: userInfo.data, message: 'Successfully retrieve user information' })
    } catch (error) {
        console.error('Error get user info:', error);
        res.status(500).json({ error: error.message });
    }
}

const editUserName = async (req, res) => {
    try {
        const { email, newUsername } = req.body;
        const user = await updateUsername(email, { username: newUsername })
        return res.json({ message: 'User updated successfully', user })
    } catch (error) {
        console.error('Error edit username:', error);
        res.status(500).json({ error: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await findAllUsers({
            include: {
                user_sessions: {
                    select: {
                        event_type: true,
                        timestamp: true
                    }
                }
            }
        })

        const userData = users.map(user => ({
            id: user.id,
            email: user.email,
            createdAt: user.createdat,
            logins: user.user_sessions.filter(session => session.event_type === 'login').length,
            lastLogout: user.user_sessions
                .filter(session => session.event_type === 'logout')
                .reduce((latestTimestamp, session) => {
                    if (!latestTimestamp || session.timestamp > latestTimestamp) {
                        return session.timestamp;
                    }
                    return latestTimestamp;
                }, null)
        }));

        return res.json({ users: userData });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

const getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await prisma.users.count();
        return res.json({ totalUsers });
    } catch (error) {
        console.error('Error fetching total users:', error);
        res.status(500).json({ error: 'Error fetching total users' });
    }
};

const getUsersWithActiveSessionsToday = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activeUsersToday = await findAllUserSession({
            where: {
                timestamp: {
                    gte: today
                }
            },
            distinct: ['user_id']
        });
        const countActiveUsersToday = activeUsersToday.length;
        return res.json({ activeUsersToday: countActiveUsersToday });
    } catch (error) {
        console.error('Error fetching active users today:', error);
        res.status(500).json({ error: 'Error fetching active users today' });
    }
};

const getAverageActiveUsersLast7Days = async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const activeUsersLast7Days = await grouppedUserSession({
            by: ['user_id'],
            where: {
                timestamp: {
                    gte: last7Days
                }
            }
        });
        const averageActiveUsers = activeUsersLast7Days.length / 7;
        return res.json({ averageActiveUsers });
    } catch (error) {
        console.error('Error fetching average active users last 7 days:', error);
        res.status(500).json({ error: 'Error fetching average active users last 7 days' });
    }
};


module.exports = { userInfo, editUserName, getUsers, getTotalUsers, getUsersWithActiveSessionsToday, getAverageActiveUsersLast7Days }