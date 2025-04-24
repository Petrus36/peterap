// src/sections/PostView.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Post, User, PostImage } from "@prisma/client";
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
    ChatBubbleOutline,
    Send,
    Image as ImageIcon
} from "@mui/icons-material";
import { fetchPosts } from "@/app/actions/posts";

// Define a type that includes the user relation
type PostWithUser = Post & {
    user: User;
    images: PostImage[];
};

interface PostViewProps {
    post?: PostWithUser;
}

const PostView = () => {
    const [posts, setPosts] = useState<PostWithUser[]>([]);
    const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const fetchedPosts = await fetchPosts();
                console.log('Posts in component:', fetchedPosts);
                setPosts(fetchedPosts);
                // Initialize image indices
                const initialIndices = fetchedPosts.reduce((acc, post) => ({
                    ...acc,
                    [post.id]: 0
                }), {});
                setCurrentImageIndex(initialIndices);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        loadPosts();
    }, []);

    const handleNextImage = (postId: string) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [postId]: (prev[postId] + 1) % posts.find(p => p.id === postId)!.images.length
        }));
    };

    const handleComment = (postId: string) => {
        console.log(`Comment for post ${postId}:`, commentText[postId]);
        setCommentText(prev => ({ ...prev, [postId]: '' }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 3 }}>
            {posts.map((post) => {
                const currentIndex = currentImageIndex[post.id] || 0;
                const hasImages = post.images.length > 0;
                
                return (
                    <Card key={post.id} sx={{ width: "70%", maxWidth: 600 }}>
                        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={post.user.image || undefined} alt={post.user.name || 'User'} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {post.user.name || 'Anonymous'}
                            </Typography>
                        </Box>
                        
                        {hasImages ? (
                            <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ 
                                        height: 400,
                                        objectFit: 'cover',
                                        cursor: post.images.length > 1 ? 'pointer' : 'default'
                                    }}
                                    image={post.images[currentIndex].imageUrl}
                                    onClick={() => post.images.length > 1 && handleNextImage(post.id)}
                                />
                                {post.images.length > 1 && (
                                    <Typography
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            px: 1,
                                            borderRadius: 1,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {currentIndex + 1} / {post.images.length}
                                    </Typography>
                                )}
                            </Box>
                        ) : (
                            <Paper 
                                sx={{ 
                                    height: 200, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    bgcolor: 'grey.100'
                                }}
                            >
                                <Stack alignItems="center" spacing={1}>
                                    <ImageIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        No image available
                                    </Typography>
                                </Stack>
                            </Paper>
                        )}
                        
                        <CardContent>
                            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
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
                );
            })}
        </Box>
    );
}

export default PostView;
