const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const registerUser = async (userData) => {
    const users = prisma.users.create({ data: userData })
    return users
}

const createUserSession = async (prisma, userId, eventType = 'login') => {
    const session = await prisma.user_sessions.create({
        data: {
            user_id: userId,
            event_type: eventType,
            timestamp: new Date(),
        },
    });

    return session;
};


const updateUserLoggedInStatus = async (prisma, email, isLoggedIn = true) => {
    await prisma.users.update({
        where: { email },
        data: { isloggedin: isLoggedIn },
    });
};

module.exports = { registerUser, createUserSession, updateUserLoggedInStatus }