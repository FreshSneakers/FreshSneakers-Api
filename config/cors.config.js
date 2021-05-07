const cors = require("cors");

const corsMiddleware = cors({
    origin: 'https://fresh-sneakers-wb.herokuapp.com' || "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
});

module.exports = corsMiddleware;