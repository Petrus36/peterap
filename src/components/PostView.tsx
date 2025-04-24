"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Avatar,
  Skeleton,
  Stack,
  CardHeader,
  CardActions,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

interface Author {
  name: string | null;
  image: string | null;
}

interface Post {
  id: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  author: Author;
  liked: boolean;
  likes: number;
  comments: number;
}

export default function PostView() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (loading) {
    return (
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader
              avatar={<Skeleton variant="circular" width={40} height={40} />}
              title={<Skeleton variant="text" width={120} />}
              subheader={<Skeleton variant="text" width={80} />}
            />
            <Skeleton variant="rectangular" height={300} />
            <CardContent>
              <Skeleton variant="text" width="90%" />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  if (posts.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
        No posts available
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader
            avatar={
              <Avatar
                src={post.author.image || undefined}
                alt={post.author.name || "User"}
              />
            }
            title={post.author.name}
            subheader={formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          />
          <CardMedia
            component="img"
            height="300"
            image={post.imageUrl}
            alt="Post image"
          />
          <CardActions disableSpacing>
            <IconButton
              aria-label="like"
              onClick={() => handleLike(post.id)}
              color={post.liked ? "error" : "default"}
            >
              {post.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.likes}
            </Typography>
            <IconButton aria-label="comment">
              <CommentIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.comments}
            </Typography>
          </CardActions>
          {post.caption && (
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {post.caption}
              </Typography>
            </CardContent>
          )}
        </Card>
      ))}
    </Stack>
  );
} 