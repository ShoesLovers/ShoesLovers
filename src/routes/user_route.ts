import express from "express";
import UserController from "../controllers/user_controller";
import authMiddleware from "../controllers/auth_middleware";
const router = express.Router();

router.get("/", authMiddleware, UserController.getAll.bind(UserController));
router.get("/:id", authMiddleware, UserController.getById.bind(UserController));

router.post("/", authMiddleware, UserController.post.bind(UserController));

router.put(
  "/:id",

  authMiddleware,
  UserController.updateById.bind(UserController)
);

router.delete(
  "/:id",
  authMiddleware,
  UserController.deleteById.bind(UserController)
);

export = router;
