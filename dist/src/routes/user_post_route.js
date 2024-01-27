"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
module.exports = router;
//# sourceMappingURL=user_post_route.js.map