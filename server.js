require("dotenv").config();

const express = require("express");
const dbConnect = require("./config/mongodbConnection");
const userRoute = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoute");
const aiRoutes = require("./routes/aiRoute");
const chatRoutes = require("./routes/chatRoute");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { app, server } = require("./socket/socket");

const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "https://smart-x-front-end.vercel.app",
      "https://smart-x-front-end-git-main-zoya-shaikhs-projects.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  }),
);

// mount Route
app.use("/api/v1", userRoute);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", aiRoutes);
app.use("/api/v1", chatRoutes);

dbConnect();

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
