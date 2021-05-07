const cors = require("cors");

const corsMiddleware = cors({
    origin: 'https://fresh-sneakers-wb.herokuapp.com',
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
});

module.exports = corsMiddleware;