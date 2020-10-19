const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const withAuth = require("./middleware");
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");

const app = express();

const secret = "mysecretsshhh";

// credentials for https
let privateKey = fs.readFileSync("./certs/server-key.pem");
let certificate = fs.readFileSync("./certs/server-cert.pem");
let credentials = {
  key: privateKey,
  cert: certificate,
};

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
  {
    id: 0,
    title: "title 0",
    cover: "https://picsum.photos/seed/34228/300/200",
  },
  {
    id: 1,
    title: "title 1",
    cover: "https://picsum.photos/seed/82036/300/200",
  },
  {
    id: 2,
    title: "title 2",
    cover: "https://picsum.photos/seed/87534/300/200",
  },
  {
    id: 3,
    title: "title 3",
    cover: "https://picsum.photos/seed/55409/300/200",
  },
  {
    id: 4,
    title: "title 4",
    cover: "https://picsum.photos/seed/12211/300/200",
  },
  {
    id: 5,
    title: "title 5",
    cover: "https://picsum.photos/seed/65200/300/200",
  },
  {
    id: 6,
    title: "title 6",
    cover: "https://picsum.photos/seed/42174/300/200",
  },
  {
    id: 7,
    title: "title 7",
    cover: "https://picsum.photos/seed/99432/300/200",
  },
  {
    id: 8,
    title: "title 8",
    cover: "https://picsum.photos/seed/72588/300/200",
  },
  {
    id: 9,
    title: "title 9",
    cover: "https://picsum.photos/seed/76313/300/200",
  },
  {
    id: 10,
    title: "title 10",
    cover: "https://picsum.photos/seed/23122/300/200",
  },
  {
    id: 11,
    title: "title 11",
    cover: "https://picsum.photos/seed/89337/300/200",
  },
  {
    id: 12,
    title: "title 12",
    cover: "https://picsum.photos/seed/11866/300/200",
  },
  {
    id: 13,
    title: "title 13",
    cover: "https://picsum.photos/seed/37187/300/200",
  },
  {
    id: 14,
    title: "title 14",
    cover: "https://picsum.photos/seed/11633/300/200",
  },
  {
    id: 15,
    title: "title 15",
    cover: "https://picsum.photos/seed/63380/300/200",
  },
  {
    id: 16,
    title: "title 16",
    cover: "https://picsum.photos/seed/78379/300/200",
  },
  {
    id: 17,
    title: "title 17",
    cover: "https://picsum.photos/seed/60565/300/200",
  },
  {
    id: 18,
    title: "title 18",
    cover: "https://picsum.photos/seed/43651/300/200",
  },
  {
    id: 19,
    title: "title 19",
    cover: "https://picsum.photos/seed/91049/300/200",
  },
  {
    id: 20,
    title: "title 20",
    cover: "https://picsum.photos/seed/46647/300/200",
  },
  {
    id: 21,
    title: "title 21",
    cover: "https://picsum.photos/seed/25240/300/200",
  },
  {
    id: 22,
    title: "title 22",
    cover: "https://picsum.photos/seed/20609/300/200",
  },
  {
    id: 23,
    title: "title 23",
    cover: "https://picsum.photos/seed/99972/300/200",
  },
  {
    id: 24,
    title: "title 24",
    cover: "https://picsum.photos/seed/50499/300/200",
  },
  {
    id: 25,
    title: "title 25",
    cover: "https://picsum.photos/seed/51755/300/200",
  },
  {
    id: 26,
    title: "title 26",
    cover: "https://picsum.photos/seed/47009/300/200",
  },
  {
    id: 27,
    title: "title 27",
    cover: "https://picsum.photos/seed/25817/300/200",
  },
  {
    id: 28,
    title: "title 28",
    cover: "https://picsum.photos/seed/20917/300/200",
  },
  {
    id: 29,
    title: "title 29",
    cover: "https://picsum.photos/seed/75644/300/200",
  },
  {
    id: 30,
    title: "title 30",
    cover: "https://picsum.photos/seed/46735/300/200",
  },
  {
    id: 31,
    title: "title 31",
    cover: "https://picsum.photos/seed/25760/300/200",
  },
  {
    id: 32,
    title: "title 32",
    cover: "https://picsum.photos/seed/83877/300/200",
  },
  {
    id: 33,
    title: "title 33",
    cover: "https://picsum.photos/seed/98647/300/200",
  },
  {
    id: 34,
    title: "title 34",
    cover: "https://picsum.photos/seed/62714/300/200",
  },
  {
    id: 35,
    title: "title 35",
    cover: "https://picsum.photos/seed/59269/300/200",
  },
  {
    id: 36,
    title: "title 36",
    cover: "https://picsum.photos/seed/78156/300/200",
  },
  {
    id: 37,
    title: "title 37",
    cover: "https://picsum.photos/seed/81951/300/200",
  },
  {
    id: 38,
    title: "title 38",
    cover: "https://picsum.photos/seed/83828/300/200",
  },
  {
    id: 39,
    title: "title 39",
    cover: "https://picsum.photos/seed/31492/300/200",
  },
  {
    id: 40,
    title: "title 40",
    cover: "https://picsum.photos/seed/78511/300/200",
  },
  {
    id: 41,
    title: "title 41",
    cover: "https://picsum.photos/seed/23987/300/200",
  },
  {
    id: 42,
    title: "title 42",
    cover: "https://picsum.photos/seed/40983/300/200",
  },
  {
    id: 43,
    title: "title 43",
    cover: "https://picsum.photos/seed/93350/300/200",
  },
  {
    id: 44,
    title: "title 44",
    cover: "https://picsum.photos/seed/93784/300/200",
  },
  {
    id: 45,
    title: "title 45",
    cover: "https://picsum.photos/seed/57602/300/200",
  },
  {
    id: 46,
    title: "title 46",
    cover: "https://picsum.photos/seed/46792/300/200",
  },
  {
    id: 47,
    title: "title 47",
    cover: "https://picsum.photos/seed/62928/300/200",
  },
  {
    id: 48,
    title: "title 48",
    cover: "https://picsum.photos/seed/68163/300/200",
  },
  {
    id: 49,
    title: "title 49",
    cover: "https://picsum.photos/seed/47196/300/200",
  },
  {
    id: 50,
    title: "title 50",
    cover: "https://picsum.photos/seed/25341/300/200",
  },
  {
    id: 51,
    title: "title 51",
    cover: "https://picsum.photos/seed/41437/300/200",
  },
  {
    id: 52,
    title: "title 52",
    cover: "https://picsum.photos/seed/79299/300/200",
  },
  {
    id: 53,
    title: "title 53",
    cover: "https://picsum.photos/seed/83043/300/200",
  },
  {
    id: 54,
    title: "title 54",
    cover: "https://picsum.photos/seed/46292/300/200",
  },
  {
    id: 55,
    title: "title 55",
    cover: "https://picsum.photos/seed/52208/300/200",
  },
  {
    id: 56,
    title: "title 56",
    cover: "https://picsum.photos/seed/42250/300/200",
  },
  {
    id: 57,
    title: "title 57",
    cover: "https://picsum.photos/seed/82571/300/200",
  },
  {
    id: 58,
    title: "title 58",
    cover: "https://picsum.photos/seed/24075/300/200",
  },
  {
    id: 59,
    title: "title 59",
    cover: "https://picsum.photos/seed/28780/300/200",
  },
  {
    id: 60,
    title: "title 60",
    cover: "https://picsum.photos/seed/97921/300/200",
  },
  {
    id: 61,
    title: "title 61",
    cover: "https://picsum.photos/seed/46283/300/200",
  },
  {
    id: 62,
    title: "title 62",
    cover: "https://picsum.photos/seed/57302/300/200",
  },
  {
    id: 63,
    title: "title 63",
    cover: "https://picsum.photos/seed/73680/300/200",
  },
  {
    id: 64,
    title: "title 64",
    cover: "https://picsum.photos/seed/21936/300/200",
  },
  {
    id: 65,
    title: "title 65",
    cover: "https://picsum.photos/seed/26895/300/200",
  },
  {
    id: 66,
    title: "title 66",
    cover: "https://picsum.photos/seed/55165/300/200",
  },
  {
    id: 67,
    title: "title 67",
    cover: "https://picsum.photos/seed/68605/300/200",
  },
  {
    id: 68,
    title: "title 68",
    cover: "https://picsum.photos/seed/50872/300/200",
  },
  {
    id: 69,
    title: "title 69",
    cover: "https://picsum.photos/seed/59713/300/200",
  },
  {
    id: 70,
    title: "title 70",
    cover: "https://picsum.photos/seed/89686/300/200",
  },
  {
    id: 71,
    title: "title 71",
    cover: "https://picsum.photos/seed/69774/300/200",
  },
  {
    id: 72,
    title: "title 72",
    cover: "https://picsum.photos/seed/52099/300/200",
  },
  {
    id: 73,
    title: "title 73",
    cover: "https://picsum.photos/seed/12138/300/200",
  },
  {
    id: 74,
    title: "title 74",
    cover: "https://picsum.photos/seed/60370/300/200",
  },
  {
    id: 75,
    title: "title 75",
    cover: "https://picsum.photos/seed/58236/300/200",
  },
  {
    id: 76,
    title: "title 76",
    cover: "https://picsum.photos/seed/23122/300/200",
  },
  {
    id: 77,
    title: "title 77",
    cover: "https://picsum.photos/seed/53036/300/200",
  },
  {
    id: 78,
    title: "title 78",
    cover: "https://picsum.photos/seed/62789/300/200",
  },
  {
    id: 79,
    title: "title 79",
    cover: "https://picsum.photos/seed/74057/300/200",
  },
  {
    id: 80,
    title: "title 80",
    cover: "https://picsum.photos/seed/83158/300/200",
  },
  {
    id: 81,
    title: "title 81",
    cover: "https://picsum.photos/seed/63797/300/200",
  },
  {
    id: 82,
    title: "title 82",
    cover: "https://picsum.photos/seed/81223/300/200",
  },
  {
    id: 83,
    title: "title 83",
    cover: "https://picsum.photos/seed/10188/300/200",
  },
  {
    id: 84,
    title: "title 84",
    cover: "https://picsum.photos/seed/43735/300/200",
  },
  {
    id: 85,
    title: "title 85",
    cover: "https://picsum.photos/seed/53539/300/200",
  },
  {
    id: 86,
    title: "title 86",
    cover: "https://picsum.photos/seed/98488/300/200",
  },
  {
    id: 87,
    title: "title 87",
    cover: "https://picsum.photos/seed/96133/300/200",
  },
  {
    id: 88,
    title: "title 88",
    cover: "https://picsum.photos/seed/76536/300/200",
  },
  {
    id: 89,
    title: "title 89",
    cover: "https://picsum.photos/seed/26300/300/200",
  },
  {
    id: 90,
    title: "title 90",
    cover: "https://picsum.photos/seed/26250/300/200",
  },
  {
    id: 91,
    title: "title 91",
    cover: "https://picsum.photos/seed/67274/300/200",
  },
  {
    id: 92,
    title: "title 92",
    cover: "https://picsum.photos/seed/18263/300/200",
  },
  {
    id: 93,
    title: "title 93",
    cover: "https://picsum.photos/seed/74614/300/200",
  },
  {
    id: 94,
    title: "title 94",
    cover: "https://picsum.photos/seed/97291/300/200",
  },
  {
    id: 95,
    title: "title 95",
    cover: "https://picsum.photos/seed/98454/300/200",
  },
  {
    id: 96,
    title: "title 96",
    cover: "https://picsum.photos/seed/14750/300/200",
  },
  {
    id: 97,
    title: "title 97",
    cover: "https://picsum.photos/seed/54989/300/200",
  },
  {
    id: 98,
    title: "title 98",
    cover: "https://picsum.photos/seed/65183/300/200",
  },
  {
    id: 99,
    title: "title 99",
    cover: "https://picsum.photos/seed/18798/300/200",
  },
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

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
