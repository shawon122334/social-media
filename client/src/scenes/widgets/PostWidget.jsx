import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  SendOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPosts = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await updatedPosts.json();
    dispatch(setPosts({ posts: data }));
  };

  const handleCommentSubmit = async () => {
    // Send comment to server
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment: commentText }),
      }
    );

    const updatedPosts = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await updatedPosts.json();
    dispatch(setPosts({ posts: data }));

    // Clear comment input field
    setCommentText("");
  };

  const handlePostShare = async () => {
    try {
      // Send share request to server
      const response = await fetch(`http://localhost:3001/posts/${postId}/share`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to share post', response);
      }
  
      // Fetch the updated post after sharing
      const updatedPostResponse = await fetch(`http://localhost:3001/posts/${postId}`);
      const updatedPost = await updatedPostResponse.json();
  
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error sharing post:", error);
      // Handle error as needed
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments?.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton onClick={handlePostShare}>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments?.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
          <Box
            mt="0.5rem"
            sx={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment..."
              value={commentText}
              size="small"
              onChange={(e) => setCommentText(e.target.value)}
            />
            <IconButton
              disabled={commentText === ""}
              onClick={handleCommentSubmit}
              sx={{
                width: 60,
                height: 35,
                background: "#00D5FA",
                borderRadius: "5px",
              }}
            >
              <SendOutlined /> {/* Assuming you have a send icon */}
            </IconButton>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
