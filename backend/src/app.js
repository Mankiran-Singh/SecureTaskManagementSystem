const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middlewares/error.middleware");
const cookieParser = require('cookie-parser');


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use('/api/users', require('./routes/user.routes'));

app.use(errorHandler);

module.exports = app;
