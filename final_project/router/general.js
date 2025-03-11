const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send("Please fill both username and password");
    }
    const usernameExisted = users.find(user => user.name);
    if (usernameExisted) {
        return res.status(400).send("Username has already been used");
    }
    users.push({ name: username, password });
    res.status(201).send(`User ${username} has registered successfully!`);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const result = books[isbn];
    res.status(200).send(result)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const keys = Object.keys(books);
    const author = req.params.author;
    let result = {};
    for (const key of keys) {
        if (books[key]["author"] === author) {
            result = books[key];
        }
    }
    res.status(200).send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const keys = Object.keys(books);
    const { title } = req.params;
    let result = {};
    for (const key of keys) {
        if (books[key]["title"] === title) {
            result = books[key];
        }
    }
    res.status(200).send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    res.status(200).send(book["reviews"]);
});

module.exports.general = public_users;
