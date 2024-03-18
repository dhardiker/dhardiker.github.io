import { Box, Button, Container, Typography } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { useLocation, useNavigate } from "react-router-dom"
import { QrScanner } from "@yudiel/react-qr-scanner";
import { z } from "zod";
import { parseCode } from "../utils/code";

const zState = z.object({
  code: z.string(),
})

export const Element: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const state = zState.parse(location.state)
  const code = state.code
  parseCode(code)

  return <>
    <Helmet>
      <title>Scan Attendee Badge</title>
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
          Scan Attendee Badge
        </Typography>
        <QrScanner
          onDecode={badge => {
            console.log('Navigate to captured badge along with the existing score code:', { code, badge })
            navigate('/submit', { state: { code, badge } })
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
