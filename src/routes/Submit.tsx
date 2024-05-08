import { Box, Button, CircularProgress, Container, Typography } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"
import { i18nGameNames, parseCode } from "../utils/code"
import { apiClientHooks } from "../bootstrapping/InitApiClient"
import { useEffect, useState } from "react"

const zState = z.object({
  code: z.string(),
  badge: z.string(),
})

const isNotUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return !uuidRegex.test(uuid)
}

export const Element: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const state = zState.parse(location.state)
  const parsedCode = parseCode(state.code)

  const isGameValid = parsedCode.gameID in i18nGameNames
  const isBadgeNotAttendee = isNotUUID(state.badge)
  const isBadgeValid = state.badge.startsWith(parsedCode.badgeID)
  const isValid = isGameValid && isBadgeValid

  const mutateSubmitScore = apiClientHooks.useSubmitScore()
  const [scoreResult, setScoreResult] = useState<typeof mutateSubmitScore.data>(undefined)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<{
    http: {
      code?: string,
      status?: string,
      message?: string,
    },
    app: {
      type?: string,
      message?: string,
    },
  } | undefined>()

  useEffect(() => {
    if (!isValid || isSubmitted) return

    setIsSubmitted(true)
    setScoreResult(undefined)

    mutateSubmitScore.mutateAsync({
      attendeeId: state.badge,
      scoreCode: state.code,
    })
      .then(_scoreResult => setScoreResult(_scoreResult))
      .catch(err => {
        console.error(err)
        console.info('Failed to submit score!', {
          reason: err.response?.data?.error,
        })

        setError({
          http: {
            code: err.code,
            status: err.response?.status,
            message: err.message,
          },
          app: {
            type: err.response?.data?.error?.type,
            message: err.response?.data?.error?.message,
          },
        })
      })
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
          ? isBadgeNotAttendee
            ? <>
              <Typography component="h1" variant="h3" marginBottom={3}>
                ⚠️ Not an Attendee QR!
              </Typography>
              <Typography component="p" variant="body1" marginBottom={3}>
                <strong>{state.badge}</strong> doesn't looks like a Devoxx Attendee QR code.
              </Typography>
              <Typography component="p" variant="body1" marginBottom={3}>
                <em>Did you scan the wrong side of your badge?</em>
              </Typography>
              <Typography component="p" variant="body1" marginBottom={3}>
                <Button
                  variant="contained"
                  sx={{ marginTop: 1 }}
                  onClick={() => navigate('/scan-badge', { state: { code: state.code } })}
                >
                  Scan Attendee Badge
                </Button>
              </Typography>
            </>
            : <>
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
            ? error === undefined
              ? <>
                <Typography component="h1" variant="h3" marginBottom={3}>
                  <CircularProgress /> Saving Score...
                </Typography>
              </>
              : <>
                <Typography component="h1" variant="h3" marginBottom={3}>
                  😢 Error while Saving!
                </Typography>
                <Typography component="p" variant="body1" marginBottom={3}>
                  HTTP returned the error <strong>{error.http.code}</strong> ({error.http.message})
                </Typography>
                <Typography component="p" variant="body1" marginBottom={3}>
                  App returned the error <strong>{error.app.type}</strong> ({error.app.message})
                </Typography>
                <Typography component="p" variant="body1" marginBottom={3}>
                  <em>You can try to submit again by rescanning your attendee badge.</em>
                </Typography>
                <Typography component="p" variant="body1" marginBottom={3}>
                  <Button
                    variant="contained"
                    sx={{ marginTop: 1 }}
                    onClick={() => navigate('/scan-badge', { state: { code: state.code } })}
                  >
                    Scan Attendee Badge
                  </Button>
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
