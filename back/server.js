import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import connectDB from "./config/connectDb.js";
import { saveRepositories } from "./controllers/repositoriesController.js";
import Repository from "./model/Repository.js";
import corsOptions from "./config/corsOptions.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

//connect to mongodb
connectDB();

//cross origin resource sharing
app.use(cors(corsOptions));

//built in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set timer on 30 minutes
const checkTime = 30 * 60 * 1000;

setImmediate(saveRepositories);

let intervalId = setInterval(saveRepositories, checkTime);

app.get("/api/repos", async (req, res) => {
  const allRepos = await Repository.find({});
  res.json(allRepos);
});

app.get("/api/reset", async (req, res) => {
  //reset internal timer
  clearInterval(intervalId);
  console.log("Internal timer have been reseted");
  intervalId = setInterval(saveRepositories, checkTime);
});

app.get("/api/:name_or_id", async (req, res) => {
  try {
    const name = String(req.params.name_or_id);
    const id = Number(req.params.name_or_id);

    let foundRepo = null;

    if (isNaN(id)) {
      foundRepo = await Repository.findOne({ name });
    } else {
      foundRepo = await Repository.findOne({ id });
    }

    res.json(foundRepo);
  } catch (error) {
    console.log(error);
  }
});

mongoose.connection.once("open", () => {
  console.log(`Connected to MongoDB`);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
