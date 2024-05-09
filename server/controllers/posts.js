import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res, next) => {
    try {

        const {userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes:{},
            comments: []
        });

        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({message: err.message});
    }
}

// Read

export const getFeedPosts = async (req, res) => {
    try{
        const posts = await Post.find().sort({ createdAt: "desc" });
        res.status(200).json(posts);
    }catch(err){
        res.status(404).json({message: err.message});
    }
        
}

export const getUserPosts = async (req, res) => {
    try {
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch(err){
        res.status(409).json({message: err.message});
    }
}

export const likePost = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked) {
            post.likes.delete(userId);
        } else{
            post.likes.set(userId, true);
        }

        const updatePost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        );
        res.status(200).json(updatePost);
    }  catch   (err) {
        res.status(409).json({message: err.message});
    }
}

export const comment = async (req, res) => {
        try{
            const {id} = req.params;
            const newComment = req.body.comment;
            const post = await Post.findById(id);
            console.log("Comment", newComment);
        if(!post) {
            res.status(404).json({message: "Post not found."});
        }

        const updatePost = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: newComment } },
            { new: true }
          );
          res.status(200).json(updatePost);
        } catch (err) {
            res.status(409).json({message: err.message});
        }
}

export const sharePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.user; // Assuming you have user authentication middleware
        
        // Find the post to share
        const postToShare = await Post.findById(postId);
    
        // Check if the post has already been shared by the current user
        if (postToShare.sharedBy.includes(userId)) {
          return res.status(400).json({ error: 'Post already shared by the user' });
        }
    
        // Push the ID of the user who shared the post into the sharedBy array
        postToShare.sharedBy.push(userId);
        
        // Save the updated post
        const savedPost = await postToShare.save();
    
        res.status(201).json(savedPost);
      } catch (error) {
        console.error('Error sharing post:', error);
        res.status(500).json({ error: 'Failed to share post' });
      }
}

