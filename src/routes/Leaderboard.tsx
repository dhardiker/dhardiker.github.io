import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from 'react-avatar';
import Typography from '@mui/material/Typography'
import { Helmet } from "react-helmet-async"
import { apiClientHooks } from '../bootstrapping/InitApiClient'
import { Paper, keyframes } from '@mui/material'
import { gameIDs, i18nGameNames } from '../utils/code'
import { Duration, DurationObjectUnits } from 'luxon'

type ScoreListItemProps = {
  index: number,
  name: string,
  score: number,
  gamesPlayed?: number,
} & React.ComponentProps<typeof ListItem>
const ScoreListItem: React.FC<ScoreListItemProps> = ({ name, score, gamesPlayed, ...listItemProps }) =>
  <ListItem alignItems="flex-start" {...listItemProps}>
    <ListItemAvatar sx={{ marginRight: 2 }}>
      <Avatar name={name} round={true} size='6vh' />
    </ListItemAvatar>
    <ListItemText
      primary={
        <Typography
          sx={{ display: 'inline' }}
          component="span"
          fontSize='2.5vh'
          color="white"
        >
          {Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(score)} points
        </Typography>
      }
      secondary={
        <React.Fragment>
          <Typography
            sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            component="span"
            variant="body2"
            fontSize='1.5vh'
            color="lightgray"
          >
            {name}
          </Typography>
          {gamesPlayed !== undefined && <>— {gamesPlayed} game{gamesPlayed === 1 ? '' : 's'} played</>}
        </React.Fragment>
      }
    />
  </ListItem>

const fadeInMoveUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(1000px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedScoreListItem: React.FC<ScoreListItemProps> = ({ index, ...props }) => (
  <Box
    component={ScoreListItem}
    sx={{
      opacity: 0,
      transform: 'translateY(20px)',
      animation: `${fadeInMoveUp} 0.5s forwards`,
      animationDelay: `${index * 0.1}s`,
    }}
    index={index}
    {...props}
  />
);

type ScoreListProps = {
  title: string,
  maxScoreCount: number,
  highscores: {
    name: string;
    highscore: number;
    rank: number;
  }[],
} & React.ComponentProps<typeof Box>
const ScoreList: React.FC<ScoreListProps> = ({ title, maxScoreCount, highscores, ...boxProps }) =>
  <Box
    sx={{
      position: 'relative',
      flex: 1,
      m: 1,
      ...((boxProps ?? {}).sx)
    }}
  >
    <Typography variant="h4" sx={{
      fontWeight: 'bold',
      color: 'white',
      position: 'absolute',
      top: '-4.5vh',
      left: '1vh',
      zIndex: 'tooltip'
    }}>
      {title}
    </Typography>
    <Paper elevation={6} sx={{
      bgcolor: 'black',
      height: `${9 * maxScoreCount}vh`,
      border: '0.25vh solid limegreen',
      borderRadius: '2vh',
      display: 'flex',
      alignItems: 'top',
      justifyContent: 'center',
      width: '45vh',
      overflow: 'hidden',
    }}>
      <List sx={{ width: '100%', maxWidth: '35vh' }}>
        {highscores.map((entry, index) => (
          // TODO: Add a player key to the leaderboard API
          // TODO: Add gamesPlayed to the leaderboard API
          <AnimatedScoreListItem
            key={title + ':' + index}
            index={index}
            name={entry.name}
            score={entry.highscore}
          />
        ))}
      </List>
    </Paper>
  </Box>

const ensureArrayHasExactLength = <T extends unknown>(arr: T[] | undefined, length: number, fill: T): T[] => {
  if (arr === undefined) return Array(length).fill(fill)
  if (arr.length === length) return arr
  if (arr.length > length) return arr.slice(0, length)
  return [...arr, ...Array(length - arr.length).fill(fill)]
}

type GameCarrouselProps = {
  waitTime: DurationObjectUnits,
}
const useGameCarrousel = ({ waitTime }: GameCarrouselProps) => {
  const [currentGame, setCurrentGame] = React.useState<keyof typeof i18nGameNames>('duker')

  // Wait before switching to the next game
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const gameIndex = gameIDs.indexOf(currentGame)
      const nextGameIndex = (gameIndex + 1) % Object.keys(i18nGameNames).length
      setCurrentGame(gameIDs[nextGameIndex])
    }, Duration.fromObject(waitTime).as('milliseconds'))

    return () => clearTimeout(timer)
  }, [currentGame, waitTime])

  return currentGame
}

const fiveSeconds = Duration.fromObject({ seconds: 5 }).as('milliseconds')
const tenSeconds = Duration.fromObject({ seconds: 10 }).as('milliseconds')

export const Element: React.FC = () => {
  const currentGameId = useGameCarrousel({ waitTime: { seconds: 5 } })

  const leaderboard = apiClientHooks.useGetPublicLeaderboard({}, { staleTime: fiveSeconds, refetchInterval: tenSeconds })
  if (process.env.NODE_ENV === 'development') console.log('leaderboard:', leaderboard)

  const gameLeaderboard = apiClientHooks.useGetPublicLeaderboardForGame({ params: { gameId: currentGameId } }, { staleTime: fiveSeconds })
  if (process.env.NODE_ENV === 'development') console.log('gameLeaderboard:', gameLeaderboard)

  const maxScoreCount = 5
  const highscores = leaderboard.data?.highscores ?? []
  const gameHighscores: typeof highscores = gameLeaderboard.data?.highscores ?? []

  return <>
    <Helmet>
      <title>Leaderboard</title>
    </Helmet>
    <Container component="main" maxWidth={false} disableGutters>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        bgcolor: 'black',
        color: 'white',
      }}>
        <img src="/arcade-title.png" alt="Arcade Title" style={{ position: 'absolute', top: 0, left: -25, width: '65vw' }} />
        <img src="/logo-devoxx-white.png" alt="Devoxx Logo" style={{ position: 'absolute', bottom: 60, left: 90, width: '25vw' }} />
        <img src="/theme-devoxx.png" alt="Devoxx Theme" style={{ position: 'absolute', bottom: -20, right: -80, width: '25vw' }} />
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100vh', // this is bit weird, but works due to other hacks
        }}>
          <ScoreList
            sx={{ marginTop: 8 }}
            title="Overall Standings"
            maxScoreCount={maxScoreCount}
            highscores={highscores}
          />
          <ScoreList
            sx={{ marginTop: 8 }}
            title={i18nGameNames[currentGameId]}
            maxScoreCount={maxScoreCount}
            highscores={gameHighscores}
          />
        </Box>
      </Box>
    </Container>
  </>
}
