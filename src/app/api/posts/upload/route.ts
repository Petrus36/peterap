import { NextResponse } from "next/server";
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const postId = formData.get("postId") as string;
    const order = parseInt(formData.get("order") as string);

    if (!file || !postId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads', 'posts');
    await createDirIfNotExists(uploadsDir);

    // Save file with unique name
    const uniqueFilename = `${postId}-${Date.now()}${path.extname(file.name)}`;
    const filePath = path.join('uploads', 'posts', uniqueFilename);
    const fullPath = path.join(publicDir, filePath);
    await writeFile(fullPath, buffer);

    // Create post image record
    const postImage = await prisma.postImage.create({
      data: {
        postId,
        imageUrl: `/${filePath}`,
        order,
      },
    });

    return NextResponse.json({ imageUrl: postImage.imageUrl });
  } catch (error) {
    console.error("Error uploading post image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await writeFile(dir, '', { flag: 'wx' });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
} 