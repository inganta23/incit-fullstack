const { userInfo, editUserName, getUsers, getTotalUsers, getUsersWithActiveSessionsToday, getAverageActiveUsersLast7Days } = require("../controllers/userControllers");
const { authMiddleware } = require("../middleware/checkToken");

const router = require("express").Router();

router.get('/user-info', authMiddleware, userInfo)
router.put('/', authMiddleware, editUserName)
router.get('/', authMiddleware, getUsers)

router.get('/total-users', authMiddleware, getTotalUsers)
router.get('/active-users-today', authMiddleware, getUsersWithActiveSessionsToday)
router.get('/average-active-users-last-7days', authMiddleware, getAverageActiveUsersLast7Days)


module.exports = router;
