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

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

app.get("/grade", withAuth, (req, res) => {
  const credential = req.query.email || req.query.username;
  switch (credential) {
    case "ordinary": {
      res.status(200).json({
        courses: [
          {
            course_id: "course-v1:spbu+OLYMP+fall_2019",
            grades: [{ grade_name: "Аудирование", grade: "0.334" }],
          },
          {
            course_id: "course-v1:spbu+OLYMP_retake+fall_2019",
            grades: [
              { grade_name: "Чтение", grade: "0.5" },
              { grade_name: "Лексика.Грамматика", grade: "0.8" },
            ],
          },
        ],
      });
      break;
    }
    case "a@a.a": {
      res.status(200).json({
        courses: [
          {
            course_id: "course-v1:spbu+OLYMP+fall_2019",
            grades: [{ grade_name: "Аудирование", grade: "0.334" }],
          },
          {
            course_id: "course-v1:spbu+OLYMP_retake+fall_2019",
            grades: [
              { grade_name: "Чтение", grade: "0.5" },
              { grade_name: "Лексика.Грамматика", grade: "0.8" },
            ],
          },
        ],
      });
      break;
    }
    case "nogrades": {
      res.status(200).json({
        courses: [
          {
            course_id: "course-v1:spbu+OLYMP+fall_2019",
          },
          {
            course_id: "course-v1:spbu+OLYMP_retake+fall_2019",
          },
        ],
      });
      break;
    }
    case "nocourses": {
      res.status(200).json({
        courses: [],
      });
      break;
    }

    default: {
      res.status(404).send("There is no such user");
    }
  }
});

app.get("/proctoring", withAuth, (req, res) => {
  const credential = req.query.email || req.query.username; //req.body.email || req.body.username ||
  switch (credential) {
    case "ordinary": {
      res.status(200).json({
        courses: [
          {
            course_id: "course-v1:spbu+OLYMP+fall_2019",
            links: [{ test_name: "Аудирование", url: "https://test.com/1" }],
          },
          {
            course_id: "course-v1:spbu+OLYMP_retake+fall_2019",
            links: [
              { test_name: "Чтение", url: "https://test.com/2" },
              { test_name: "Лексика.Грамматика", url: "https://test.com/3" },
            ],
          },
        ],
      });
      break;
    }
    case "a@a.a": {
      res.status(200).json({
        courses: [
          {
            course_id: "course-v1:spbu+OLYMP+fall_2019",
            links: [{ test_name: "Аудирование", url: "https://test.com/1" }],
          },
          {
            course_id: "course-v1:spbu+OLYMP_retake+fall_2019",
            links: [
              { test_name: "Чтение", url: "https://test.com/2" },
              { test_name: "Лексика.Грамматика", url: "https://test.com/3" },
            ],
          },
        ],
      });
      break;
    }
    case "nogrades": {
      res.status(200).json({
        courses: [
          {
            course_id: "course-v1:spbu+OLYMP+fall_2019",
          },
          {
            course_id: "course-v1:spbu+OLYMP_retake+fall_2019",
          },
        ],
      });
      break;
    }
    case "nocourses": {
      res.status(200).json({
        courses: [],
      });
      break;
    }

    case "longlinks": {
      res.status(200).json({
        courses: [
          {
            course_id: "course-v1:spbu+OLYMP_retake+fall_2019",
            links: [
              {
                test_name: "Чтение",
                url:
                  "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.ytimg.com%2Fvi%2FWl959QnD3lM%2Fmaxresdefault.jpg&imgrefurl=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DWl959QnD3lM&tbnid=YsuHKK6-7EWmGM&vet=12ahUKEwiY3LHoyofrAhVXxioKHTE7BQwQMygAegUIARClAQ..i&docid=ntkyOwngEaK1oM&w=1280&h=720&client=firefox-b-d&ved=2ahUKEwiY3LHoyofrAhVXxioKHTE7BQwQMygAegUIARClAQ",
              },
              {
                test_name: "Лексика.Грамматика",
                url:
                  "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.ytimg.com%2Fvi%2FlaaUFxhzqIs%2Fmaxresdefault.jpg&imgrefurl=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DlaaUFxhzqIs&tbnid=T7a1m6XxAUxfkM&vet=12ahUKEwiY3LHoyofrAhVXxioKHTE7BQwQMyg9egQIARA7..i&docid=3cht7D2YcQ_9sM&w=1280&h=720&client=firefox-b-d&ved=2ahUKEwiY3LHoyofrAhVXxioKHTE7BQwQMyg9egQIARA7",
              },
            ],
          },
        ],
      });
      break;
    }

    default: {
      res.status(404).send("There is no such user");
    }
  }
});

app.listen(process.env.PORT || 8080);
