require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let urls = [];
app.post("/api/shorturl", function (req, res) {
  const url = new URL(req.body.url);
  dns.lookup(url.hostname, (err, address, family) => {
    if (err) res.json({ error: "invalid url" });
  });
  const data = {
    original_url: url,
    short_url: Math.floor(Math.random() * 100),
  };
  urls.push(data);
  res.json(data);
});

app.get("/api/shorturl/:id", function (req, res) {
  const id = req.params.id;
  const url = urls.find(e => e.short_url == id);
  if (!url) {
    res.json({ error: "No short URL found for the given input" });
    return;
  }
  res.redirect(url.original_url);
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
