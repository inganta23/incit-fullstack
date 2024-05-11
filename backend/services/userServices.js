const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


const findUserByEmail = async (email) => {
    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    })

    return user
}

const findAllUsers = async (data) => {
    const users = await prisma.users.findMany(data);
    return users
}

const findAllUserSession = async (data) => {
    const user_sessions = await prisma.user_sessions.findMany(data);
    return user_sessions
}

const grouppedUserSession = async (data) => {
    const user_sessions = await prisma.user_sessions.groupBy(data);
    return user_sessions
}

const updateUsername = async (email, userData) => {
    const updatedUser = await prisma.users.update({
        where: { email },
        data: userData
    });

    return updatedUser
}

module.exports = { findUserByEmail, updateUsername, findAllUsers, findAllUserSession, grouppedUserSession }