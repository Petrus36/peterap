"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import { Edit as EditIcon, BookmarkBorder as BookmarkIcon, GridOn as GridOnIcon } from "@mui/icons-material";
import UserPostsView from "@/sections/UserPostsView";
import { useRouter } from "next/navigation";

interface Profile {
  bio: string | null;
  location: string | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${session?.user?.id}`);
        const data = await response.json();
        setProfile(data.profile);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (session?.user?.id) {
      loadProfile();
    }
  }, [session?.user?.id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Stats data - replace with real data later
  const stats = [
    { label: "príspevkov", value: "0" },
    { label: "sledovateľov", value: "0" },
    { label: "sledovaných", value: "0" },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Profile Header */}
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 4 }}>
          <Avatar
            src={session?.user?.image || undefined}
            sx={{
              width: 150,
              height: 150,
              bgcolor: "primary.main",
              fontSize: "4rem",
              mr: 4,
            }}
          >
            {session?.user?.name?.[0] || "P"}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  fontWeight: "bold",
                  mr: 2,
                }}
              >
                {session?.user?.name || "Peter Sefcik"}
              </Typography>

              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => router.push("/profil/upravit")}
                sx={{
                  background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
                    opacity: 0.9,
                  },
                }}
              >
                Upraviť profil
              </Button>
            </Box>

            {/* Stats */}
            <Grid container spacing={4} sx={{ mb: 2 }}>
              {stats.map((stat) => (
                <Grid item key={stat.label}>
                  <Typography variant="h6" component="div" align="center" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {stat.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* Bio and Location */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {profile?.bio || "Študent"}
              </Typography>
              {profile?.location && (
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  📍 {profile.location}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper sx={{ borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "uppercase",
                fontWeight: "bold",
              },
            }}
          >
            <Tab 
              icon={<GridOnIcon />} 
              iconPosition="start" 
              label="Príspevky" 
            />
            <Tab 
              icon={<BookmarkIcon />} 
              iconPosition="start" 
              label="Uložené" 
            />
          </Tabs>

          {/* Posts Tab */}
          <TabPanel value={tabValue} index={0}>
            {session?.user?.id ? (
              <UserPostsView userId={session.user.id} />
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Zatiaľ tu nie sú žiadne príspevky
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #FF4B91, #4B7BE5)",
                      opacity: 0.9,
                    },
                  }}
                >
                  Pridať prvý príspevok
                </Button>
              </Box>
            )}
          </TabPanel>

          {/* Saved Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Zatiaľ tu nie sú žiadne uložené príspevky
              </Typography>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}