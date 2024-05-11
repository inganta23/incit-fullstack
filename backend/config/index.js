const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    port: process.env.PORT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    secret: process.env.SECRET,
    clientUrl: process.env.CLIENT_URL
};
