import express from "express";
import UserController from "../controllers/user_controller";
const router = express.Router();

router.get("/", UserController.getAll.bind(UserController));
router.get("/:id", UserController.getById.bind(UserController));

router.post("/", UserController.post.bind(UserController));

router.put("/:id", UserController.update.bind(UserController));

router.delete("/:id", UserController.delete.bind(UserController));

export = router;
