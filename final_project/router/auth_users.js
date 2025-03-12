const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    const userExisted = users.find(user => user.name === username);
    return userExisted && userExisted.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ name: username }, "access", { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username 
        }
        return res.status(200).send("User successfully logged in");
    } return res.status(400).send("Invalid Login. Check username and password");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { review } = req.query;
    const username = req.session.authorization['username'];
    const { isbn } = req.params;
    
    const reviewExisted = books[isbn].reviews[username];
    if (reviewExisted) {
        reviewExisted = review;
        return res.status(200).send("Review has been updated");
    } else {
        books[isbn].reviews[username] = review;
        return res.status(200).send("Review has been added");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization['username'];
    const { isbn } = req.params;
    
    delete books[isbn].reviews[username];
    return res.status(200).send("Delete review successfully");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
