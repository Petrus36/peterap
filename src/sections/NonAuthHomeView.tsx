// src/sections/NonAuthHomeView.tsx

import { Container, Typography, Box, Paper } from "@mui/material";

export default function NonAuthHomeView() {
  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            maxWidth: 600,
            borderRadius: 2
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Vitajte na Peterapp
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 2,
              color: 'text.secondary',
              lineHeight: 1.6
            }}
          >
            Registrujte sa, aby ste mohli pridať príspevky a zobraziť profil. 
            Uživajte si naše prostredie a zdieľajte svoje zážitky s ostatnými.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
