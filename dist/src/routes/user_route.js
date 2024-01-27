"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
router.get("/", user_controller_1.default.getAllUsers);
router.get("/:id", user_controller_1.default.getUserById);
router.post("/", user_controller_1.default.postUser);
router.put("/:id", user_controller_1.default.updateUser);
router.delete("/:id", user_controller_1.default.deleteUser);
module.exports = router;
//# sourceMappingURL=user_route.js.map