import express from "express";
const router = express.Router();

// import UserPost from "../controllers/user_post_controller";

router.get("/", (req, res) => {
  res.send("Test get all user post!");
});
router.get("/:id", (req, res) => {
  res.send("Test get all user post!");
});

router.post("/", (req, res) => {
  res.send("Test get all user post!");
});

router.put("/:id", (req, res) => {
  res.send("Test get all user post!");
});

router.delete("/:id", (req, res) => {
  res.send("Test get all user post!");
});

export = router;
