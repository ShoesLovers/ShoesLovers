import express from "express";
import UserController from "../controllers/user_controller";
import authMiddleware from "../controllers/auth_middleware";
const router = express.Router();

router.get("/", authMiddleware, UserController.getAll.bind(UserController));
router.get("/:id", authMiddleware, UserController.getById.bind(UserController));

router.post("/", authMiddleware, UserController.post.bind(UserController));

router.put("/:id", authMiddleware, UserController.update.bind(UserController));

router.delete(
  "/:id",
  authMiddleware,
  UserController.delete.bind(UserController)
);

export = router;
