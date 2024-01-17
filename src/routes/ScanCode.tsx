import { Box, Button, Container, Typography } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { QrScanner } from "@yudiel/react-qr-scanner";

export const Element: React.FC = () => {
  const navigate = useNavigate()

  return <>
    <Helmet>
      <title>Scan QR Code</title>
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
          Scan QR Code
        </Typography>
        <QrScanner
          onDecode={code => {
            console.log('Navigate to captured code:', code)
            navigate('/display-code', { state: { code } })
          }}
          onError={error => {
            console.error(error?.message)
            throw error
          }}
        />
        <Button
          variant="contained"
          sx={{ marginTop: 1 }}
          onClick={() => navigate('/')}
        >
          Cancel Scan
        </Button>
      </Box>
    </Container>
  </>
}
