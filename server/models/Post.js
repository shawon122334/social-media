import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },

    sharedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who shared the post
    }],
    sharedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Reference to the original post being shared
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;