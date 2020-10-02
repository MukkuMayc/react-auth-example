const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const withAuth = require("./middleware");
const cors = require("cors");

const app = express();

const secret = "mysecretsshhh";

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

const mongo_uri = "mongodb://localhost/react-auth";
mongoose.connect(mongo_uri, { useNewUrlParser: true }, function (err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

// app.use(express.static(path.join(__dirname, "public")));

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.get("/api/home", function (req, res) {
  res.send("Welcome!");
});

app.get("/hello", function (req, res) {
  res.send("Hello!");
});

app.get("/api/secret", withAuth, function (req, res) {
  res.send("The password is potato");
});

app.post("/api/register", function (req, res) {
  const { email, password } = req.body.credentials;
  const user = new User({ email, password });
  user.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club, buddy!");
    }
  });
});

app.post("/login", function (req, res) {
  console.log(req.body.credentials);
  const { email, password } = req.body.credentials;
  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again",
      });
    } else if (!user) {
      res.status(401).json({
        error: "Incorrect email or password",
      });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500).json({
            error: "Internal error please try again",
          });
        } else if (!same) {
          res.status(401).json({
            error: "Incorrect email or password",
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: "10h",
          });
          console.log(token);
          res.cookie("token", token).sendStatus(200);
        }
      });
    }
  });
});

app.get("/checkToken", withAuth, function (req, res) {
  res.sendStatus(200);
});

const courses = [
  { id: 0, name: "name0", picture_url: "https://picsum.photos/300/200" },
  { id: 1, name: "name1", picture_url: "https://picsum.photos/300/200" },
  { id: 2, name: "name2", picture_url: "https://picsum.photos/300/200" },
  { id: 3, name: "name3", picture_url: "https://picsum.photos/300/200" },
  { id: 4, name: "name4", picture_url: "https://picsum.photos/300/200" },
  { id: 5, name: "name5", picture_url: "https://picsum.photos/300/200" },
  { id: 6, name: "name6", picture_url: "https://picsum.photos/300/200" },
  { id: 7, name: "name7", picture_url: "https://picsum.photos/300/200" },
  { id: 8, name: "name8", picture_url: "https://picsum.photos/300/200" },
  { id: 9, name: "name9", picture_url: "https://picsum.photos/300/200" },
  { id: 10, name: "name10", picture_url: "https://picsum.photos/300/200" },
  { id: 11, name: "name11", picture_url: "https://picsum.photos/300/200" },
  { id: 12, name: "name12", picture_url: "https://picsum.photos/300/200" },
  { id: 13, name: "name13", picture_url: "https://picsum.photos/300/200" },
  { id: 14, name: "name14", picture_url: "https://picsum.photos/300/200" },
  { id: 15, name: "name15", picture_url: "https://picsum.photos/300/200" },
  { id: 16, name: "name16", picture_url: "https://picsum.photos/300/200" },
  { id: 17, name: "name17", picture_url: "https://picsum.photos/300/200" },
  { id: 18, name: "name18", picture_url: "https://picsum.photos/300/200" },
  { id: 19, name: "name19", picture_url: "https://picsum.photos/300/200" },
  { id: 20, name: "name20", picture_url: "https://picsum.photos/300/200" },
  { id: 21, name: "name21", picture_url: "https://picsum.photos/300/200" },
  { id: 22, name: "name22", picture_url: "https://picsum.photos/300/200" },
  { id: 23, name: "name23", picture_url: "https://picsum.photos/300/200" },
  { id: 24, name: "name24", picture_url: "https://picsum.photos/300/200" },
  { id: 25, name: "name25", picture_url: "https://picsum.photos/300/200" },
  { id: 26, name: "name26", picture_url: "https://picsum.photos/300/200" },
  { id: 27, name: "name27", picture_url: "https://picsum.photos/300/200" },
  { id: 28, name: "name28", picture_url: "https://picsum.photos/300/200" },
  { id: 29, name: "name29", picture_url: "https://picsum.photos/300/200" },
  { id: 30, name: "name30", picture_url: "https://picsum.photos/300/200" },
  { id: 31, name: "name31", picture_url: "https://picsum.photos/300/200" },
  { id: 32, name: "name32", picture_url: "https://picsum.photos/300/200" },
  { id: 33, name: "name33", picture_url: "https://picsum.photos/300/200" },
  { id: 34, name: "name34", picture_url: "https://picsum.photos/300/200" },
  { id: 35, name: "name35", picture_url: "https://picsum.photos/300/200" },
  { id: 36, name: "name36", picture_url: "https://picsum.photos/300/200" },
  { id: 37, name: "name37", picture_url: "https://picsum.photos/300/200" },
  { id: 38, name: "name38", picture_url: "https://picsum.photos/300/200" },
  { id: 39, name: "name39", picture_url: "https://picsum.photos/300/200" },
  { id: 40, name: "name40", picture_url: "https://picsum.photos/300/200" },
  { id: 41, name: "name41", picture_url: "https://picsum.photos/300/200" },
  { id: 42, name: "name42", picture_url: "https://picsum.photos/300/200" },
  { id: 43, name: "name43", picture_url: "https://picsum.photos/300/200" },
  { id: 44, name: "name44", picture_url: "https://picsum.photos/300/200" },
  { id: 45, name: "name45", picture_url: "https://picsum.photos/300/200" },
  { id: 46, name: "name46", picture_url: "https://picsum.photos/300/200" },
  { id: 47, name: "name47", picture_url: "https://picsum.photos/300/200" },
  { id: 48, name: "name48", picture_url: "https://picsum.photos/300/200" },
  { id: 49, name: "name49", picture_url: "https://picsum.photos/300/200" },
  { id: 50, name: "name50", picture_url: "https://picsum.photos/300/200" },
  { id: 51, name: "name51", picture_url: "https://picsum.photos/300/200" },
  { id: 52, name: "name52", picture_url: "https://picsum.photos/300/200" },
  { id: 53, name: "name53", picture_url: "https://picsum.photos/300/200" },
  { id: 54, name: "name54", picture_url: "https://picsum.photos/300/200" },
  { id: 55, name: "name55", picture_url: "https://picsum.photos/300/200" },
  { id: 56, name: "name56", picture_url: "https://picsum.photos/300/200" },
  { id: 57, name: "name57", picture_url: "https://picsum.photos/300/200" },
  { id: 58, name: "name58", picture_url: "https://picsum.photos/300/200" },
  { id: 59, name: "name59", picture_url: "https://picsum.photos/300/200" },
  { id: 60, name: "name60", picture_url: "https://picsum.photos/300/200" },
  { id: 61, name: "name61", picture_url: "https://picsum.photos/300/200" },
  { id: 62, name: "name62", picture_url: "https://picsum.photos/300/200" },
  { id: 63, name: "name63", picture_url: "https://picsum.photos/300/200" },
  { id: 64, name: "name64", picture_url: "https://picsum.photos/300/200" },
  { id: 65, name: "name65", picture_url: "https://picsum.photos/300/200" },
  { id: 66, name: "name66", picture_url: "https://picsum.photos/300/200" },
  { id: 67, name: "name67", picture_url: "https://picsum.photos/300/200" },
  { id: 68, name: "name68", picture_url: "https://picsum.photos/300/200" },
  { id: 69, name: "name69", picture_url: "https://picsum.photos/300/200" },
  { id: 70, name: "name70", picture_url: "https://picsum.photos/300/200" },
  { id: 71, name: "name71", picture_url: "https://picsum.photos/300/200" },
  { id: 72, name: "name72", picture_url: "https://picsum.photos/300/200" },
  { id: 73, name: "name73", picture_url: "https://picsum.photos/300/200" },
  { id: 74, name: "name74", picture_url: "https://picsum.photos/300/200" },
  { id: 75, name: "name75", picture_url: "https://picsum.photos/300/200" },
  { id: 76, name: "name76", picture_url: "https://picsum.photos/300/200" },
  { id: 77, name: "name77", picture_url: "https://picsum.photos/300/200" },
  { id: 78, name: "name78", picture_url: "https://picsum.photos/300/200" },
  { id: 79, name: "name79", picture_url: "https://picsum.photos/300/200" },
  { id: 80, name: "name80", picture_url: "https://picsum.photos/300/200" },
  { id: 81, name: "name81", picture_url: "https://picsum.photos/300/200" },
  { id: 82, name: "name82", picture_url: "https://picsum.photos/300/200" },
  { id: 83, name: "name83", picture_url: "https://picsum.photos/300/200" },
  { id: 84, name: "name84", picture_url: "https://picsum.photos/300/200" },
  { id: 85, name: "name85", picture_url: "https://picsum.photos/300/200" },
  { id: 86, name: "name86", picture_url: "https://picsum.photos/300/200" },
  { id: 87, name: "name87", picture_url: "https://picsum.photos/300/200" },
  { id: 88, name: "name88", picture_url: "https://picsum.photos/300/200" },
  { id: 89, name: "name89", picture_url: "https://picsum.photos/300/200" },
  { id: 90, name: "name90", picture_url: "https://picsum.photos/300/200" },
  { id: 91, name: "name91", picture_url: "https://picsum.photos/300/200" },
  { id: 92, name: "name92", picture_url: "https://picsum.photos/300/200" },
  { id: 93, name: "name93", picture_url: "https://picsum.photos/300/200" },
  { id: 94, name: "name94", picture_url: "https://picsum.photos/300/200" },
  { id: 95, name: "name95", picture_url: "https://picsum.photos/300/200" },
  { id: 96, name: "name96", picture_url: "https://picsum.photos/300/200" },
  { id: 97, name: "name97", picture_url: "https://picsum.photos/300/200" },
  { id: 98, name: "name98", picture_url: "https://picsum.photos/300/200" },
  { id: 99, name: "name99", picture_url: "https://picsum.photos/300/200" },
];

app.get("/courses", function (req, res) {
  res.status(200).json({
    courses: courses,
  });
});

app.get("/course/:id", function (req, res) {
  let id = req.params.id;
  console.log(id);
  console.log(courses[id]);
  res.status(200).json({
    ...courses[id],
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.  Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut laboreet dolore magna aliquyam erat. Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ",
    platforms: [
      { name: "openedu", price: 4.99 },
      { name: "coursera", price: 3.99 },
      { name: "stepik", price: 2 },
    ],
  });
});

app.listen(process.env.PORT || 8080);
