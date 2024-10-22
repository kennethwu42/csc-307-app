import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "../express-backend/services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userService.findUserById(id)
        .then((result) => {
            if(result){
                res.status(200).send(result);
            }
            else{
                res.status(404).send(error);
            }
        })
        .catch((error) =>{
            res.status(500).send(error.name);
        })
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    // Generate a random ID for the user
    userService.addUser(userToAdd)
                .then((result) => res.status(201).send(result))
                .catch((error) =>{
                    console.log(error);
                });
});

// Existing route to get all users or filter by name
app.get("/users", (req, res) => {
    const name = req.query["name"];
    const job = req.query["job"];
    userService.getUsers(name, job)
    .then((result) => {
        res.status(200).send({users_list: result});
    })
    .catch((error) =>{
        res.status(500).send(error.name);
    })
});



// Delete user by ID
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService.deleteUser(id)
    .then(user => {
      if (!user) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      res.status(500).send("Error deleting user.");
    });
});


app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});