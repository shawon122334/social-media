import express from 'express';
import {comment, getFeedPosts, getUserPosts, likePost, sharePost} from "../controllers/posts.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// READ
router.get('/', verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);

// Update

router.patch("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, comment);
router.post("/:id/share", verifyToken, sharePost);

export default router;
