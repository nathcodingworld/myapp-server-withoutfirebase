import mongoose from "mongoose";
import Audio from "../Audio";
import User from "../User";

export type addAudioType = {
  name: string;
  userid: string;
  propic: string;
  file: string;
  cover: string;
  title: string;
  owner: string;
  coverby: string;
};
export async function addAudio(arg: addAudioType) {
  const audio = await new Audio({
    userid: new mongoose.Types.ObjectId(arg.userid),
    file: arg.file,
    cover: arg.cover,
    date: new Date().toDateString(),
    title: arg.title,
    owner: arg.owner,
    coverby: arg.coverby,
  });
  await audio.save();
}

export async function findAllAudio(args: { authorid: string }) {
  if (args.authorid === "default") return await Audio.find({}).sort({ createdAt: "desc" }).populate({ path: "userid", select: "userName avatar id" });
  else return await Audio.find({ userid: args.authorid }).sort({ createdAt: "desc" }).populate({ path: "userid", select: "userName avatar id" });
}

export async function findOneAudio(args: { id: string }) {
  return await Audio.findById(args.id);
}

export async function updateOneAudio(args: { userid: string; audioid: string; cover: string; title: string; owner: string; coverby: string }) {
  await Audio.findByIdAndUpdate(args.audioid, { title: args.title, cover: args.cover, owner: args.owner, coverby: args.coverby });
}

export async function deleteOneAudio(args: { audioid: string; userid: string; cover: string; file: string }) {
  await User.findByIdAndUpdate(args.userid, { $pull: { allPhotoFiles: args.cover, allAudioFiles: args.file } });
  await Audio.findByIdAndDelete(args.audioid);
}

export async function deleteAllAudio(args: { userid: string }) {
  await Audio.deleteMany({ userid: args.userid });
}
