let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let cors = require("cors");
let session = require("express-session");
let db = require("./config/config");

// console.log(db);

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static("./public"));

db.dbConnect((error) => {
  if (error) {
    console.log("db connection failed" + error);
  } else {
    console.log("db connection success");
  }
});
const port = process.env.PORT || 3001;
// let adminLoginRouter = require("./routes/adminLogin");
// let adminRouter = require("./routes/admin");
// let indexRouter = require("./routes/index");
// let loginRouter = require("./routes/login");
let customerRouter = require("./routes/customer/customer");
let dealerRouter = require("./routes/dealer/dealer");
let adminRouter = require("./routes/admin/admin");

const { token } = require("morgan");

// app.set("trust proxy", 1);
// app.use(
//   session({
//     name: "sid1",
//     secret: "+~5#O&jCQ>[,OjQ",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {},
//   })
// );
// app.use(
//   "/home",
//   session({
//     name: "sid2",
//     secret: "+~5#O&jCQ>[,OjQ",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       path: "/home",
//       secure: false,
//       httpOnly: true,
//     },
//   })
// );
// app.use("/admin", adminLoginRouter);
// app.use("/admin/dashboard", adminRouter);
// app.use("/home", indexRouter);
app.use("/", customerRouter);
app.use("/dealer", dealerRouter);
app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log(`Server listen at port ${port}`);
});

module.exports = app;
