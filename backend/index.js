const express = require('express');
const cors = require('cors')
const config = require("./config");
const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter)
app.use('/user', userRouter)

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
