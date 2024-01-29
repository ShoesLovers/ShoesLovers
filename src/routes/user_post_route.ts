import express from "express";
const router = express.Router();
import UserPostController from "../controllers/user_post_controller";
import authMiddleware from "../controllers/auth_middleware";

// import UserPost from "../controllers/user_post_controller";

router.get("/", UserPostController.getAll.bind(UserPostController));
router.get("/:id", UserPostController.getById.bind(UserPostController));

router.post(
  "/",
  authMiddleware,
  UserPostController.post.bind(UserPostController)
);

router.put(
  "/:id",
  authMiddleware,
  UserPostController.updateById.bind(UserPostController)
);

router.delete(
  "/:id",
  authMiddleware,
  UserPostController.deleteById.bind(UserPostController)
);

export = router;
