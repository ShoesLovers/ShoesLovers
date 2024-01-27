import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
});

export = mongoose.model("user", userSchema);
