import mongoose from "mongoose";

const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    userid: { type: mongoose.Types.ObjectId, ref: "User" },
    title: String!,
    thumbnail: String!,
    view: Number!,
    like: Number!,
    dislike: Number!,
    comment: Number!,
    file: String!,
    description: String!,
    date: String,
    disablelike: Boolean!,
    disablecomment: Boolean!,
    comments: [
      {
        userid: { type: mongoose.Types.ObjectId, ref: "User" },
        date: String,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
