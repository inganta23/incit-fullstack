const router = require("express").Router();
const { googleAuth, register,verifyEmail, login, logout, resetPassword } = require("../controllers/authControllers");
const { authMiddleware } = require("../middleware/checkToken");

router.post('/google', googleAuth);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware ,logout);
router.get('/verify-email/:token', verifyEmail);
router.put('/reset-pass', authMiddleware, resetPassword);

module.exports = router;
