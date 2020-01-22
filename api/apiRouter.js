const express = require("express");
const router = express.Router();
const Data = require("../data/db.js");

// POST ("/api/posts")
router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Data.insert(req.body)
      .then((data) => {
        Data.findById(data.id)
          .then((post) => res.status(201).json(post))
          .catch(() =>
            res
              .status(500)
              .json({ error: "The post information could not be retrieved." })
          );
      })
      .catch(() =>
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        })
      );
  }
});

// POST ("/api/posts/:id/comments")
router.post("/:id/comments", (req, res) => {
  Data.findById(req.params.id)
    .then(() => {
      if (!req.body.text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide a comment body." });
      } else {
        Data.insertComment(req.body)
          .then((object) => {
            Data.findCommentById(`${object.id}`)
              .then(({comment}) => res.status(201).json({comment}))
              .catch(() =>
                res.status(500).json({
                  error: "The comment data could not be retrieved."
                })
              );
          })
          .catch(() =>
            res.status(500).json({
              error:
                "There was an error while saving the comment. Please try again."
            })
          );
        }
    })
            .catch(() =>
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist." })
            );
});

// GET ("/api/posts")
router.get("/", (req, res) => {
  Data.find()
    .then((data) => res.status(200).json(data))
    .catch(() =>
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." })
    );
});

// GET ("/api/posts/:id")
router.get("/:id", (req, res) => {
  Data.findById(req.params.id)
    .then((post) => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() =>
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." })
    );
});

// GET ("/api/posts/:id/comments")
router.get("/:id/comments", (req, res) => {
  Data.findById(req.params.id)
    .then((post) => {
      console.log(post);
      Data.findPostComments(post[0].id)
        .then((comments) => {
          if (comments.length > 0) {
            res.status(200).json(comments);
          } else {
            res
              .status(200)
              .json({ message: "There are no comments for this post." });
          }
        })
        .catch(() =>
          res
            .status(500)
            .json({ error: "The comments information could not be retrieved." })
        );
    })
    .catch(() =>
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." })
    );
});

// DELETE ("/api/posts/:id")
router.delete("/:id", (req, res) => {
  Data.findById(req.params.id)
    .then((post) => {
      Data.remove(req.params.id)
        .then(() => res.status(200).json(post))
        .catch(() =>
          res.status(500).json({ error: "The post could not be removed." })
        );
    })
    .catch(() =>
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." })
    );
});

// PUT ("/api/posts/:id")
router.put("/:id", (req, res) => {
  Data.findById(req.params.id)
    .then((post) => {
      if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else {
        if (post.length <= 0) {
          res
            .status(404)
            .json({
              message: "The post with the specified ID does not exist."
            });
        } else {
          Data.update(req.params.id, req.body)
            .then(() => {
              Data.findById(req.params.id)
                .then((post) => res.status(200).json(post))
                .catch(() =>
                  res.status(404).json({
                    message:
                      "The updated post with the specified ID could not be retrieved."
                  })
                );
            })
            .catch(() =>
              res
                .status(500)
                .json({ error: "The post information could not be modified." })
            );
        }
      }
    })
    .catch(() =>
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." })
    );
});

module.exports = router;