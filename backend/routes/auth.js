const router = require("express").Router();
const { googleAuth, register,verifyEmail, login, logout } = require("../controllers/authControllers");
const { authMiddleware } = require("../middleware/checkToken");

router.post('/google', googleAuth);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware ,logout);
router.get('/verify-email/:token', verifyEmail)

module.exports = router;
