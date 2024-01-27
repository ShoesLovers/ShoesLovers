"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
});
module.exports = mongoose_1.default.model("user", userSchema);
//# sourceMappingURL=user_model.js.map