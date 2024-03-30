const express = require("express");
const app = express();
const port = 3000;
const postsJSON = require("./assets/data/posts.json");
const bodyParser = require("body-parser");
const fs = require("fs/promises");

app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/styles.css", (_, res) => {
  res.sendFile(__dirname + "/views/styles.css");
});

app.get("/index.js", (_, res) => {
  res.sendFile(__dirname + "/views/index.js");
});

app.get("/api/posts", (req, res) => {
  const { id } = req.query;
  if (id) {
    const post = postsJSON.find((post) => post.id == id);
    if (!post) {
      res.status(404).json({
        statusMessage: `Post with id:${id} not found!`,
      });
      return;
    }
    res.status(200).json(post);
  }
  res.status(200).json(postsJSON);
});

app.post("/api/post", (req, res) => {
  const { user, text } = req.body;
  const newId = postsJSON.length + 1;
  const newPost = { id: newId, user, text, timestamp: new Date() };
  postsJSON.push(newPost);

  //* Writing to Posts JSON file
  fs.writeFile("./assets/data/posts.json", JSON.stringify(postsJSON), (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        statusMessage:
          "Oops!, something went wrong please retry after some time.",
      });
    }
    console.log("The file has been saved!");
  });
  res.status(200).json(newPost);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
