// src/app/actions/posts.ts

"use server";

// Import Prisma client
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

// Fetch all posts
export const fetchPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { 
        user: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
    });

    console.log('Fetched posts:', JSON.stringify(posts, null, 2));
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
};

// Fetch posts by a specific user ID
export const fetchPostsByUserId = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { 
        user: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
    });

    console.log('Fetched user posts:', JSON.stringify(posts, null, 2));
    return posts;
  } catch (error) {
    console.error("Error fetching posts by userId:", error);
    throw new Error("Could not fetch posts");
  }
};

// Create a new post
export const createPost = async (userId: string, caption: string, imageUrls: string[]) => {
  try {
    const newPost = await prisma.post.create({
      data: {
        userId,
        caption,
        images: {
          create: imageUrls.map((url, index) => ({
            imageUrl: url,
            order: index
          }))
        }
      },
      include: {
        user: true,
        images: true
      }
    });

    console.log('Created new post:', JSON.stringify(newPost, null, 2));
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Could not create post");
  }
};

