import { authError, authTimeOutError, registeringError } from "../../ErrorHandlers/AuthErrors";
import { addAudio, addAudioType, deleteOneAudio, updateOneAudio } from "../../Keeper/Model/AudioModel";

const AudioMutation = {
  audio: async (parent: any, args: addAudioType, context: any) => {
    if (!context.req.isAuth) throw authError;
    try {
      await addAudio(args);
      return { message: "add Audio Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
  editaudio: async (parent: any, args: { userid: string; audioid: string; cover: string; title: string; owner: string; coverby: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await updateOneAudio(args);
      return { message: "edit Audio Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
  deleteaudio: async (parent: any, args: { userid: string; audioid: string; cover: string; file: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await deleteOneAudio(args);
      return { message: "delete Audio Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
};

export default AudioMutation;
