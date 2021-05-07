const cors = require("cors");

const corsMiddleware = cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001/api",
    allowedHeaders: ["Content-Type", "Authorization"],
});

module.exports = corsMiddleware;