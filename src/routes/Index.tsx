import { Box, Button, Container, Typography } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"

export const Element: React.FC = () => {
  const navigate = useNavigate()

  return <>
    <Helmet>
      <title>Devoxx Games Leaderboard</title>
    </Helmet>
    <Container component="main">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" marginBottom={3}>
          Devoxx Games Leaderboard
        </Typography>
        <Button
          variant="contained"
          sx={{ marginTop: 1 }}
          onClick={() => navigate('/scan-code')}
        >
          Scan QR Code
        </Button>
      </Box>
    </Container>
  </>
}