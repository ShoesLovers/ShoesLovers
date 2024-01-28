import express from "express";
import UserPostController from "../controllers/user_post_controller";
const router = express.Router();

// import UserPost from "../controllers/user_post_controller";

router.get("/", UserPostController.getAll.bind(UserPostController));
router.get("/:id", UserPostController.getById.bind(UserPostController));

router.post("/", UserPostController.post.bind(UserPostController));

router.put("/:id", UserPostController.update.bind(UserPostController));

router.delete("/:id", UserPostController.delete.bind(UserPostController));

export = router;
