"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import Image from "next/image";

export default function NewPostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [caption, setCaption] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 6) {
      alert("Môžete pridať maximálne 6 fotiek");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Prosím pridajte aspoň jednu fotku");
      return;
    }

    setLoading(true);
    try {
      // First, create the post
      const postResponse = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption,
        }),
      });

      const { postId } = await postResponse.json();

      // Then upload all images
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("file", images[i].file);
        formData.append("postId", postId);
        formData.append("order", i.toString());

        await fetch("/api/posts/upload", {
          method: "POST",
          body: formData,
        });
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Chyba pri vytváraní príspevku");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{
              background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            Nový príspevok
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Zdieľajte svoje najlepšie momenty s ostatnými
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Image Upload Area */}
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderStyle: "dashed",
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CloudUploadIcon
                  sx={{
                    fontSize: 48,
                    color: "text.secondary",
                  }}
                />
                <Typography variant="h6" color="text.secondary">
                  Pridajte fotky
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Môžete pridať až 6 fotiek
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </Box>
            </Paper>

            {/* Image Preview */}
            {images.length > 0 && (
              <ImageList
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 400,
                }}
                cols={3}
                rowHeight={164}
              >
                {images.map((image, index) => (
                  <ImageListItem key={image.preview}>
                    <Box sx={{ position: "relative", height: 164 }}>
                      <Image
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "background.paper",
                          "&:hover": {
                            bgcolor: "background.paper",
                          },
                        }}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  </ImageListItem>
                ))}
              </ImageList>
            )}

            {/* Caption Field */}
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Popis príspevku"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading || images.length === 0}
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
                  opacity: 0.9,
                },
              }}
            >
              Zdieľať príspevok
            </Button>

            {/* Back Button */}
            <Button
              onClick={() => router.back()}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#FF4B91",
                "&:hover": {
                  backgroundColor: "transparent",
                  opacity: 0.8,
                },
              }}
            >
              Späť
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 