import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB();
  connectCloudinary();
});
