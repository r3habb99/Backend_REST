const express = require("express");
const feedController = require("../controllers/feed");

//validation concept
const { body } = require("express-validator");

//importing is-auth function to verify token
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//for get all posts
router.get("/posts", isAuth, feedController.getPosts);
//for get single post
router.get("/post/:postId", isAuth, feedController.getPost);
//for updating post
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
