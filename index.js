const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const ws = require("ws");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/connectDB");
const examRoutes = require("./routes/examRoutes");
const sheetRoutes = require("./routes/sheetRoutes");
const boardRoutes = require("./routes/boardRoutes");
const videoRoutes = require("./routes/videoRoutes");
const audioRoutes = require("./routes/audioRoutes");
const bookRoutes = require("./routes/bookRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const vistorRoutes = require("./routes/vistorRoutes");
const degreeRoutes = require("./routes/degreeRoutes");
const parentsRoutes = require("./routes/parentsRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resultRoutes = require("./routes/resultRoutes");
const commentRoutes = require("./routes/commentRouets");
const whatsappRoutes = require("./routes/whatsappRoutes");
const adminRoutes = require("./routes/adminRoutes");
const createAdminAccount = require("./utils/createAdminAccount");
// const getRefreshToken = require("./utils/getRefreshToken");
const { cloudinaryUploadImage } = require("./utils/cloudinary");
const { notFound, errorHandler } = require("./middlewares/error");
const Message = require("./models/Message");
const Vistor = require("./models/Vistor");
const port = process.env.PORT || 3001;

dotenv.config();
createAdminAccount();
app.use(bodyParser.json({ limit: "100mb" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      const allowedOrigins = [process.env.CLIENT_URL, process.env.GOOGLE_URL];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

console.log(process.env.CLIENT_URL);

require("events").EventEmitter.defaultMaxListeners = 15;

app.get("/", (req, res) => {
  res.send("nodejs");
});

app.use("/api/exams", examRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/audios", audioRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/vistors", vistorRoutes);
app.use("/api/degrees", degreeRoutes);
app.use("/api/parents", parentsRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use(notFound);
app.use(errorHandler);

async function getVistorDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      { sameSite: "none", secure: true },
      (err, userData) => {
        if (err) {
          reject({ status: 403, message: "Invalid token" });
        } else {
          resolve(userData);
        }
      }
    );
  });
}

app.get("/api/messages/:vistorId", async (req, res) => {
  const { vistorId } = req.params;
  try {
    const vistorData = await getVistorDataFromRequest(req);
    const ourVistorId = vistorData.vistorId;
    const messages = await Message.find({
      sender: { $in: [vistorId, ourVistorId] },
      recipient: { $in: [vistorId, ourVistorId] },
    });
    res.json(messages);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});

app.get("/api/people", async (req, res) => {
  const users = await Vistor.find({}, { _id: 1, username: 1 });
  res.json(users);
});

const server = app.listen(port, () => {
  console.log(`App running on port => ${port}`);
});

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    const onlineClients = [...wss.clients]
      .filter((client) => client.vistorId) // Ensure vistorId exists
      .map((client) => ({
        vistorId: client.vistorId,
        username: client.username,
      }));

    const uniqueOnlineClients = Array.from(
      new Map(onlineClients.map((item) => [item.vistorId, item])).values()
    );

    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: uniqueOnlineClients,
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      connection.terminate();
      notifyAboutOnlinePeople();
    }, 1000);
  }, 2000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, vistorData) => {
          if (err) throw err;
          const { vistorId, username } = vistorData;
          connection.vistorId = vistorId;
          connection.username = username;
          notifyAboutOnlinePeople(); // Notify after setting vistor data
        });
      }
    }
  }

  connection.on("message", async (message) => {
    try {
      const messageData = JSON.parse(message.toString());
      const { recipient, text, file } = messageData;
      let filename = null;
      let fileUrl = null;
      if (file) {
        const parts = file.name.split(".");
        const ext = parts[parts.length - 1];
        filename = `${Date.now()}.${ext}`;
        const filepath = `${__dirname}/uploads/${filename}`;

        let base64String = file.data;
        let base64File = base64String.split(";base64,").pop();

        fs.writeFileSync(filepath, base64File, { encoding: "base64" });

        const cloudinaryResult = await cloudinaryUploadImage(filepath);
        fileUrl = cloudinaryResult.secure_url;
        console.log(cloudinaryResult.secure_url);

        fs.unlinkSync(filepath); // Delete the file after upload
      }

      if (recipient && (text || fileUrl)) {
        const messageDoc = await Message.create({
          sender: connection.vistorId,
          recipient,
          text,
          file: fileUrl,
        });
        [...wss.clients]
          .filter((c) => c.vistorId === recipient)
          .forEach((c) =>
            c.send(
              JSON.stringify({
                text,
                sender: connection.vistorId,
                recipient,
                file: fileUrl,
                id: messageDoc._id,
              })
            )
          );
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Notify about online people
  notifyAboutOnlinePeople();
});
