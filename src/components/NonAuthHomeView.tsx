import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export function NonAuthHomeView() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Vitajte v PeterApp
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Prihláste sa alebo sa zaregistrujte pre prístup k obsahu.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            href="/auth/prihlasenie"
            variant="contained"
            color="primary"
          >
            Prihlásiť sa
          </Button>
          <Button
            component={Link}
            href="/auth/registracia"
            variant="outlined"
            color="primary"
          >
            Registrovať sa
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 