const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const registerUser = async (userData) => {
    const users = prisma.users.create({ data: userData })
    return users
}

const createUserSession = async (prisma, userId) => {
    const session = await prisma.user_sessions.create({
        data: {
            user_id: userId,
            event_type: 'login',
            timestamp: new Date(),
        },
    });

    return session;
};

const updateUserLoggedInStatus = async (prisma, email) => {
    await prisma.users.update({
        where: { email },
        data: { isloggedin: true },
    });
};

module.exports = { registerUser, createUserSession, updateUserLoggedInStatus }