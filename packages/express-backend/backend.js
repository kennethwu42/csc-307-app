import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      },
    ]
  };

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

// Update the existing /users route to allow searching by both name and job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name !== undefined && job !== undefined) {
    // If both name and job are provided, search for users that match both
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name !== undefined) {
    // If only name is provided, search by name only
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

//get specific user by id
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// Function to delete a user by id
const deleteUserById = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index !== -1) {
    users["users_list"].splice(index, 1); // Remove the user at the found index
    return true; // Return true if a user was deleted
  } else {
    return false; // Return false if no user was found with the given id
  }
};

// DELETE route to remove a user by id
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const success = deleteUserById(id);
  if (success) {
    res.status(200).send(`User with id ${id} deleted.`);
  } else {
    res.status(404).send("Resource not found.");
  }
});

// Function to generate a random ID with 3 characters and 3 numbers
function generateRandomId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';

    let randomId = '';

    // Generate 3 random characters
    for (let i = 0; i < 3; i++) {
        randomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Generate 3 random numbers
    for (let i = 0; i < 3; i++) {
        randomId += nums.charAt(Math.floor(Math.random() * nums.length));
    }

    return randomId;
}

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.get("/users", (req, res) => {
    res.send(users);
});

//add user
app.post("/users", (req, res) => {
    const userToAdd = req.body;
    // Generate a random ID for the user
    const randomId = generateRandomId();

    // Assign the generated ID to the user object
    userToAdd.id = randomId;
    addUser(userToAdd);
    res.status(201).json(userToAdd);
});