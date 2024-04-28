import { Box, CircularProgress, Container, Typography } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router-dom"
import { z } from "zod"
import { i18nGameNames, parseCode } from "../utils/code"
import { apiClientHooks } from "../bootstrapping/InitApiClient"
import { useEffect, useState } from "react"

const zState = z.object({
  code: z.string(),
  badge: z.string(),
})

export const Element: React.FC = () => {
  const location = useLocation()

  const state = zState.parse(location.state)
  const parsedCode = parseCode(state.code)

  const isGameValid = parsedCode.gameID in i18nGameNames
  const isBadgeValid = state.badge.startsWith(parsedCode.badgeID)
  const isValid = isGameValid && isBadgeValid

  const mutateSubmitScore = apiClientHooks.useSubmitScore()
  const [scoreResult, setScoreResult] = useState<typeof mutateSubmitScore.data>(undefined)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (!isValid || isSubmitted) return

    setIsSubmitted(true)
    setScoreResult(undefined)

    mutateSubmitScore.mutateAsync({
      attendeeId: state.badge,
      scoreCode: state.code,
    })
      .then(_scoreResult => setScoreResult(_scoreResult))
      .catch(console.error)
  }, [isValid, isSubmitted, mutateSubmitScore, state.badge, state.code])

  return <>
    <Helmet>
      <title>Submit Score</title>
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
        {!isValid
          ? <>
            <Typography component="h1" variant="h3" marginBottom={3}>
              ⚠️ Invalid Score Code!
            </Typography>
            <Typography component="p" variant="body1" marginBottom={3}>
              <strong>Game ID: </strong>
              {parsedCode.gameID} {isGameValid ? '✅' : '❌'}
            </Typography>
            <Typography component="p" variant="body1" marginBottom={3}>
              <strong>Badge ID: </strong>
              {state.badge.split('-')[0]} {isBadgeValid ? '✅' : '❌'}
            </Typography>
          </>
          : scoreResult === undefined
            ? <>
              <Typography component="h1" variant="h3" marginBottom={3}>
                <CircularProgress /> Saving Score...
              </Typography>
            </>
            : <>
              <Typography component="h1" variant="h3" marginBottom={3}>
                ✅ Score Saved Successfully!
              </Typography>
            </>}

        {/* <Typography component="p" variant="body1" color={"GrayText"} marginBottom={3}>
          <em>{state.code}</em>
        </Typography>
        <Typography component="p" variant="body1" marginBottom={3}>
          <strong>Game ID: </strong>
          {parsedCode.gameID} {isGameValid ? '✅' : '❌'}
        </Typography>
        <Typography component="p" variant="body1" marginBottom={3}>
          <strong>Badge ID Prefix: </strong>
          {parsedCode.badgeID}
        </Typography>
        <Typography component="p" variant="body1" marginBottom={3}>
          <strong>Full Badge ID: </strong>
          {state.badge} {isBadgeValid ? '✅' : '❌'}
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
        </Typography> */}
      </Box>
    </Container>
  </>
}
