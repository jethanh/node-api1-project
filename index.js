const express = require('express');
const shortid = require('shortid');
const server = express();

// ```js
// {
//     id: "a_unique_id", // hint: use the shortid npm package to generate it
//     name: "Jane Doe", // String, required
//     bio: "Not Tarzan's Wife, another Jane",  // String, required
//   }

let users = [
    {
        name: "Jane Doe",
        bio: "Not Tarzan's Wife, another Jane",
        id: 0
    },
    {
        name: "Bob",
        bio: "Test 1",
        id: 1
    },
    {
        name: "Sally",
        bio: "Test 2",
        id: 2
    }
]

server.use(express.json());

// When the client makes a `GET` request to `/api/users`:

// - If there's an error in retrieving the _users_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The users information could not be retrieved." }`.

server.get('/api/users', (req, res) => {
    if(req.body){
        res.status(200).json(users)
    } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved."})
    }
    
})

// POST REQUEST

server.post('/api/users', (req, res) => {

    const userInfo = req.body

    if (!req.body.name || !req.body.bio){
        res.status(400).json({ errorMessage: "Please enter name and bio" })
    } else if (req.body.name && req.body.bio){    
    userInfo.id = shortid.generate();
    users.push(userInfo);

    res.status(201).json(userInfo);
    } else {
        res.status(500).json({ errorMessage: "There was an error saving to database"})

}
})

// When the client makes a `GET` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If there's an error in retrieving the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user information could not be retrieved." }`.

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    let userById = users.find(user => user.id == id);
    if(userById) {
        res.status(200).json(userById)
    } else if (!userById) {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
    } else {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    }
})

// When the client makes a `DELETE` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If there's an error in removing the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user could not be removed" }`.


server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
  
    let userById = users.find(user => user.id == id);
  
    if (userById) {
        users = users.filter(user => user.id != id);
        res.status(200).json({users});
    } else if (!userById) {
      res
        .status(404)
        .json({ errorMessage: "The user with the specified ID does not exist." });
    } else {
        res.status(500).json({ errorMessage: "The user could not be removed" })
    }
  });

//   When the client makes a `PUT` request to `/api/users/:id`: <--- patch?

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ errorMessage: "Please provide name and bio for the user." }`.

// - If there's an error when updating the _user_:

//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user information could not be modified." }`.

// - If the user is found and the new information is valid:

//   - update the user document in the database using the new information sent in the `request body`.
//   - respond with HTTP status code `200` (OK).
//   - return the newly updated _user document_.

server.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userInfo = req.body

    if (!userInfo.name || !userInfo.bio){
        res.status(400).json({
            errorMessage: "Provide a name and bio."
        });
    } else {
        const user = users.find(user => user.id === id)

        if (user) {
            users = users.map(user => {
                return user.id === id ? {id, ...userInfo} : user;
            })
            const updatedUser = users.find(user => {
                return user.id === id;
            });
            updatedUser
                ? res.status(200).json(updatedUser)
                : res.status(500).json({
                    errorMessage: "cannot modify"
                });
        } else {
            res.status(404).json({
                errorMessage: "cannot find by ID"
            });
        }
    }
});

const PORT = 5000;
server.listen(PORT, () => console.log(`\n API ON http://localhost:${PORT}\n`))