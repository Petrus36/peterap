"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { updateProfile } from "@/app/actions/profile";

export default function EditProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    bio: "",
    location: "",
    image: session?.user?.image || null,
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${session?.user?.id}`);
        const data = await response.json();
        if (data.profile) {
          setFormData(prev => ({
            ...prev,
            name: session?.user?.name || "",
            bio: data.profile.bio || "",
            location: data.profile.location || "",
            image: session?.user?.image || null,
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (session?.user?.id) {
      loadProfile();
    }
  }, [session?.user?.id, session?.user?.name, session?.user?.image]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setFormData(prev => ({
          ...prev,
          image: data.url,
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        image: formData.image,
      });

      // Update the session with new data
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          image: formData.image,
        },
      });

      router.push("/profil");
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/profil");
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
            sx={{
              color: "#FF4B91",
              fontWeight: "bold",
              mb: 4,
            }}
          >
            Upraviť profil
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
            {/* Profile Picture */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={imagePreview || formData.image || undefined}
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "primary.main",
                    fontSize: "2.5rem",
                    cursor: "pointer",
                  }}
                  onClick={handleImageClick}
                >
                  {session?.user?.name?.[0] || "P"}
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <IconButton
                  onClick={handleImageClick}
                  sx={{
                    position: "absolute",
                    bottom: -8,
                    right: -8,
                    backgroundColor: "white",
                    boxShadow: 1,
                    "&:hover": { backgroundColor: "white" },
                  }}
                  size="small"
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <PhotoCameraIcon />
                  )}
                </IconButton>
              </Box>
            </Box>

            {/* Name Field */}
            <TextField
              fullWidth
              label="Meno"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">👤</InputAdornment>
                ),
                endAdornment: formData.name && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClear("name")} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Bio Field */}
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              multiline
              rows={4}
              helperText={`${formData.bio.length}/500`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">📝</InputAdornment>
                ),
                endAdornment: formData.bio && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClear("bio")} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Location Field */}
            <TextField
              fullWidth
              label="Lokalita"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">📍</InputAdornment>
                ),
                endAdornment: formData.location && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClear("location")} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
                  opacity: 0.9,
                },
              }}
            >
              Uložiť zmeny
            </Button>

            {/* Back Button */}
            <Button
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#FF4B91",
                "&:hover": {
                  backgroundColor: "transparent",
                  opacity: 0.8,
                },
              }}
            >
              Späť na profil
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 