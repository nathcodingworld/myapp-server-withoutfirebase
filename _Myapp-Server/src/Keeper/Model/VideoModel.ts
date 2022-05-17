import mongoose from "mongoose";
import User from "../User";
import Video from "../Video";

export type addVideoType = {
  name: string;
  userid: string;
  propic: string;
  file: string;
  title: string;
  thumbnail: string;
  description: string;
  disablelike: boolean;
  disablecomment: boolean;
};
export async function addVideo(arg: addVideoType) {
  const video = await new Video({
    userid: new mongoose.Types.ObjectId(arg.userid),
    file: arg.file,
    title: arg.title,
    thumbnail: arg.thumbnail,
    description: arg.description,
    date: new Date().toDateString(),
    like: 0,
    dislike: 0,
    comment: 0,
    view: 0,
    disablelike: arg.disablelike,
    disablecomment: arg.disablecomment,
    comments: [],
  });
  await video.save();
}

export async function findAllVideo(args: { authorid: string }) {
  if (args.authorid === "default")
    return await Video.find({}).sort({ createdAt: "desc" }).populate({ path: "userid", select: "userName avatar id" }).populate({ path: "comments.userid", select: "userName avatar id" });
  else
    return await Video.find({ userid: args.authorid })
      .sort({ createdAt: "desc" })
      .populate({ path: "userid", select: "userName avatar id" })
      .populate({ path: "comments.userid", select: "userName avatar id" });
}
export async function findOneVideo(args: { id: string }) {
  return await Video.findById(args.id).populate({ path: "userid", select: "userName avatar id" }).populate({ path: "comments.userid", select: "userName avatar id" });
}

export async function updateOneVideo(args: { userid: string; videoid: string; title: string; thumbnail: string; description: string; disablelike: boolean; disablecomment: boolean }) {
  await Video.findByIdAndUpdate(args.videoid, {
    title: args.title,
    description: args.description,
    thumbnail: args.thumbnail,
    disablelike: args.disablelike,
    disablecomment: args.disablecomment,
  });
}

export async function deleteOneVideo(args: { videoid: string; userid: string; thumbnail: string; file: string }) {
  await User.findByIdAndUpdate(args.userid, { $pull: { allPhotoFiles: args.thumbnail, allVideoFiles: args.file } });
  await Video.findByIdAndDelete(args.videoid);
}

export async function deleteAllVideo(args: { userid: string }) {
  await Video.deleteMany({ userid: args.userid });
}

export async function findMoreVideo(args: { userid: string }) {
  return await Video.find({ userid: args.userid }, { _id: 0, title: 1, file: 1, thumbnail: 1, view: 1, like: 1 });
}

export async function updateVideoLike(args: { userid: string; videoid: string }) {
  const user = await User.findById(args.userid, { likedVideos: 1, _id: 0 });
  const userliked = user.likedVideos;
  if (userliked.includes(args.videoid)) {
    await User.findByIdAndUpdate(args.userid, { $pull: { likedVideos: args.videoid } });
    const data = await Video.findByIdAndUpdate(args.videoid, { $inc: { like: -1 } });
    return { like: data.like - 1 };
  } else {
    await User.findByIdAndUpdate(args.userid, { $push: { likedVideos: args.videoid } });
    const data = await Video.findByIdAndUpdate(args.videoid, { $inc: { like: 1 } });
    return { like: data.like + 1 };
  }
}

export async function updateVideoDislike(args: { userid: string; videoid: string }) {
  const user = await User.findById(args.userid, { dislikedVideos: 1, _id: 0 });
  const userdislike = user.dislikedVideos;
  if (userdislike.includes(args.videoid)) {
    await User.findByIdAndUpdate(args.userid, { $pull: { dislikedVideos: args.videoid } });
    const data = await Video.findByIdAndUpdate(args.videoid, { $inc: { dislike: -1 } });
    return { dislike: data.dislike - 1 };
  } else {
    await User.findByIdAndUpdate(args.userid, { $push: { dislikedVideos: args.videoid } });
    const data = await Video.findByIdAndUpdate(args.videoid, { $inc: { dislike: 1 } });
    return { dislike: data.dislike + 1 };
  }
}

export async function updateVideoComment(args: { videoid: string; userid: string; comment: string }) {
  const update = { userid: new mongoose.Types.ObjectId(args.userid), date: new Date().toDateString(), comment: args.comment };
  await Video.findByIdAndUpdate(args.videoid, { $push: { comments: update } });
  return await Video.findById(args.videoid, { comments: 1, _id: 0 })
    .sort({ createdAt: "desc" })
    .populate({ path: "comments", populate: { path: "userid", select: "userName avatar id" } });
}
