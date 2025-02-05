// src/sections/PostView.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Post } from "@prisma/client";
import { Card, CardMedia, CardActionArea, CardContent, Typography } from "@mui/material";
import { fetchPosts} from "@/app/actions/posts";


interface PostViewProps {
    post?: Post;
}

const PostView = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
        const loadPosts = async () => {
        try{
            const fetchedPosts = await fetchPosts();
            setPosts(fetchedPosts);}
        catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

        loadPosts();
        
    }, []);

    return (              
        posts.map((post) => (
            <Card key={post.id} sx={{m: 2, width: "70%"}}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="200"
                        image={post.imageUrl}
                    />
                    <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {post.caption}
                        </Typography>
                        <Typography sx={{ mt: 1 }}>
                            <img src={post.user.image} style={{ width: "30px", height: "30px", borderRadius: "50%"}}/> {post.user.name}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        ))

    );



}

export default PostView
