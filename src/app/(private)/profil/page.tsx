//src/app/profil/page.tsx

import { Typography, Container, Box, Avatar, Paper } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import UserPostsView from "@/sections/UserPostsView";

export const metadata = { title: "Profil | peterap" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" color="error">
            Nie ste prihlásený
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Profile Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Avatar
            src={session?.user?.image || undefined}
            alt={session?.user?.name || "User"}
            sx={{ 
              width: 120, 
              height: 120,
              mb: 2,
              border: '3px solid',
              borderColor: 'text.primary'
            }}
          >
            {session?.user?.name?.charAt(0) || "U"}
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {session?.user?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {session?.user?.email}
          </Typography>
        </Paper>

        {/* User's Posts */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            Moje príspevky
          </Typography>
          <UserPostsView userId={session.user.id} />
        </Box>
      </Box>
    </Container>
  );
}