// pages/about.tsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: '2rem 0' }}>
      <Typography variant="h3" gutterBottom>
        O nás
      </Typography>
      <Box sx={{ textAlign: 'justify', marginBottom: '1.5rem' }}>
        <Typography variant="body1">
          Naša firma sa špecializuje na IT sieťové riešenia. Poskytujeme kompletné služby v oblasti
          návrhu, implementácie a údržby IT infraštruktúry.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '1rem' }}>
          Naša vízia je pomôcť firmám optimalizovať ich sieťovú infraštruktúru a dosiahnuť maximálnu
          efektivitu.
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom>
        Naša misia
      </Typography>
      <Box sx={{ textAlign: 'justify' }}>
        <Typography variant="body1">
          Naším cieľom je poskytovať kvalitné a spoľahlivé riešenia, ktoré zodpovedajú potrebám
          našich klientov a pomáhajú im rásť.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
