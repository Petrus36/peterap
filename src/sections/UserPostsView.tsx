"use client";
import React, { useEffect, useState } from "react";
import { Post, User } from "@prisma/client";
import { 
    Card, 
    CardMedia, 
    CardContent, 
    Typography, 
    IconButton, 
    Box, 
    TextField,
    Button,
    Avatar,
    Divider,
    Stack,
    Paper
} from "@mui/material";
import { 
    Favorite, 
    FavoriteBorder, 
    ChatBubbleOutline,
    Send
} from "@mui/icons-material";
import { fetchPostsByUserId } from "@/app/actions/posts";

// Define a type that includes the user relation
type PostWithUser = Post & {
    user: User;
};

interface UserPostsViewProps {
    userId: string;
}

const UserPostsView = ({ userId }: UserPostsViewProps) => {
    const [posts, setPosts] = useState<PostWithUser[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const fetchedPosts = await fetchPostsByUserId(userId);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        loadPosts();
    }, [userId]);

    const handleLike = (postId: string) => {
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const handleComment = (postId: string) => {
        // Here you would typically send the comment to your backend
        console.log(`Comment for post ${postId}:`, commentText[postId]);
        setCommentText(prev => ({ ...prev, [postId]: '' }));
    };

    if (posts.length === 0) {
        return (
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    borderRadius: 2
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    Zatiaľ nemáte žiadne príspevky
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 3 }}>
            {posts.map((post) => (
                <Card key={post.id} sx={{ width: "70%", maxWidth: 600 }}>
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={post.user.image || undefined} alt={post.user.name || 'User'} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {post.user.name || 'Anonymous'}
                        </Typography>
                    </Box>
                    <CardMedia
                        component="img"
                        sx={{ 
                            height: 400,
                            objectFit: 'cover',
                            '&:hover': {
                                cursor: 'pointer'
                            }
                        }}
                        image={post.imageUrl}
                    />
                    <CardContent>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <IconButton onClick={() => handleLike(post.id)}>
                                {likedPosts.has(post.id) ? 
                                    <Favorite color="error" /> : 
                                    <FavoriteBorder />
                                }
                            </IconButton>
                            <IconButton>
                                <ChatBubbleOutline />
                            </IconButton>
                        </Stack>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {post.caption}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Add a comment..."
                                value={commentText[post.id] || ''}
                                onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                            />
                            <Button 
                                variant="contained" 
                                endIcon={<Send />}
                                onClick={() => handleComment(post.id)}
                                disabled={!commentText[post.id]}
                            >
                                Post
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default UserPostsView;
 