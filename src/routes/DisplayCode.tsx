import { Box, Button, Container, Typography } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"
import { parseCode } from "../utils/code"

const zState = z.object({
  code: z.string(),
})

export const Element: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const state = zState.parse(location.state)
  const parsedCode = parseCode(state.code)

  return <>
    <Helmet>
      <title>Display QR Code Details</title>
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
          Display QR Code Details
        </Typography>
        <Typography component="p" variant="body1" color={"GrayText"} marginBottom={3}>
          <em>{state.code}</em>
        </Typography>
        <Typography component="p" variant="body1" marginBottom={3}>
          <strong>Game ID: </strong>
          {parsedCode.gameID}
        </Typography>
        <Typography component="p" variant="body1" marginBottom={3}>
          <strong>Gamer Name: </strong>
          {parsedCode.gamerName}
        </Typography>
        <Typography component="p" variant="body1" marginBottom={3}>
          <strong>Game Run Time: </strong>
          {parsedCode.gameRunTime} (since epoch)
        </Typography>
        <Typography component="p" variant="body1" marginBottom={3}>
          <strong>Game Run Duration: </strong>
          {parsedCode.gameRunDuration} (seconds)
        </Typography>
        <Typography component="p" variant="body1" marginBottom={3}>
          <strong>Game Run Score: </strong>
          {parsedCode.gameRunScore}
        </Typography>
        <Button
          variant="contained"
          sx={{ marginTop: 1 }}
          onClick={() => navigate('/')}
        >
          Home
        </Button>
      </Box>
    </Container>
  </>
}
