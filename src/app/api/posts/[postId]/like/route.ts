import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const postId = params.postId;
    const userId = session.user.id;

    // Check if the user has already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error handling post like:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 