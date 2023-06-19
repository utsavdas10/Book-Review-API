const express = require('express');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  existing_user = users.find(user => user.username === username);
  if(!!existing_user){
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{
  let user
  try {
    user = users.find(user => user.username === username);
  }
  catch(err){
    return false;
  }
  if(!!user && user.password === password){
    return true;
  }
  return false;
}



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.body.username;
  const review = req.body.review;
  const isbn = req.params.isbn;
  
  let existing_book
  try {
    existing_book = books[isbn];
  }
  catch(err){
    return res.status(500).json({message: "Error finding book"});
  }

  if(!existing_book){
    return res.status(400).json({message: "Book not found"});
  }
  
  try {
    books[isbn].reviews = {username, thoughts:review.thoughts, rating: review.rating};
  }
  catch(err){
    return res.status(500).json({message: "Error adding review"});
  }
  console.log(books[isbn]);
  return res.status(200).json({message: "Review added", review: books[isbn].reviews});
});


// Deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  let existing_book
  try {
    existing_book = books[isbn];
  }
  catch(err){
    return res.status(500).json({message: "Error finding book"});
  }

  if(!existing_book){
    return res.status(400).json({message: "Book not found"});
  }
  
  try {
    books[isbn].reviews = {};
  }
  catch(err){
    return res.status(500).json({message: "Error deleting review"});
  }

  return res.status(200).json({message: "Review Deleted", review: books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
module.exports.users = users;

