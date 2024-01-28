"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_post_controller_1 = __importDefault(require("../controllers/user_post_controller"));
const router = express_1.default.Router();
// import UserPost from "../controllers/user_post_controller";
router.get("/", user_post_controller_1.default.getAll.bind(user_post_controller_1.default));
router.get("/:id", user_post_controller_1.default.getById.bind(user_post_controller_1.default));
router.post("/", user_post_controller_1.default.post.bind(user_post_controller_1.default));
router.put("/:id", user_post_controller_1.default.update.bind(user_post_controller_1.default));
router.delete("/:id", user_post_controller_1.default.delete.bind(user_post_controller_1.default));
module.exports = router;
//# sourceMappingURL=user_post_route.js.map