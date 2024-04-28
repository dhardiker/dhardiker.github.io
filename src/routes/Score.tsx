import { Box, Button, Container, Typography } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { useLocation, useNavigate } from "react-router-dom"
import { i18nGameNames, parseCode } from "../utils/code"

const DebugCode = ({ code, parsedCode }: { code: string, parsedCode: ReturnType<typeof parseCode> }) => {
  return <>
    <Typography component="h1" variant="h5" marginBottom={3}>
      Display QR Code Score
    </Typography>
    <Typography component="p" variant="body1" color={"GrayText"} marginBottom={3}>
      <em>{code}</em>
    </Typography>
    <Typography component="p" variant="body1" marginBottom={3}>
      <strong>Game ID: </strong>
      {parsedCode.gameID}
    </Typography>
    <Typography component="p" variant="body1" marginBottom={3}>
      <strong>Badge ID Prefix: </strong>
      {parsedCode.badgeID}
    </Typography>
    <Typography component="p" variant="body1" marginBottom={3}>
      <strong>Game Current Time: </strong>
      {parsedCode.gameCurrentTime} (since epoch)
    </Typography>
    <Typography component="p" variant="body1" marginBottom={3}>
      <strong>Game Run Duration: </strong>
      {parsedCode.gameRunDuration} (seconds)
    </Typography>
    <Typography component="p" variant="body1" marginBottom={3}>
      <strong>Game Run Score: </strong>
      {parsedCode.gameRunScore}
    </Typography>
  </>
}

export const Element: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const decodedSearch = decodeURIComponent(location.search)
  const code = decodedSearch.startsWith('?')
    ? decodedSearch.slice(1)
    : decodedSearch

  const parsedCode = parseCode(code)

  return <>
    <Helmet>
      <title>Save Score</title>
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
        <Typography component="h1" variant="h3" marginBottom={3}>
          Save your score!
        </Typography>
        <Typography component="h3" variant="h5" marginBottom={3}>
          You scored <strong>{parsedCode.gameRunScore.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> points
          in the game <strong>{i18nGameNames[parsedCode.gameID] ?? parsedCode.gameID}</strong> for
          the badge ID starting <strong>{parsedCode.badgeID.toUpperCase()}</strong>.
        </Typography>
        <Button
          variant="contained"
          sx={{ marginTop: 1 }}
          onClick={() => navigate('/scan-badge', { state: { code } })}
        >
          Scan Attendee Badge
        </Button>
        {/* <DebugCode code={code} parsedCode={parsedCode} /> */}
      </Box>
    </Container>
  </>
}
