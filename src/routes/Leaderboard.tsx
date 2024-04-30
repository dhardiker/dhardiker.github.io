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

export const Element: React.FC = () => {
  const currentGameId = useGameCarrousel({ waitTime: { seconds: 5 } })

  const leaderboard = apiClientHooks.useGetPublicLeaderboard()
  if (process.env.NODE_ENV === 'development') console.log('leaderboard:', leaderboard)

  // const gameLeaderboard = apiClientHooks.useGetGameLeaderboard({ game: currentGameId })
  // if (process.env.NODE_ENV === 'development') console.log('gameLeaderboard:', gameLeaderboard)

  const mockHighscores: Record<typeof currentGameId, typeof highscores> = {
    'duker': [
      { name: 'Alice', highscore: 1000, rank: 1 },
      { name: 'Bob', highscore: 900, rank: 2 },
      { name: 'Charlie', highscore: 800, rank: 3 },
      { name: 'David', highscore: 700, rank: 4 },
      { name: 'Eve', highscore: 600, rank: 5 },
    ],
    'space': [
      { name: 'Frank', highscore: 500, rank: 1 },
      { name: 'Grace', highscore: 400, rank: 2 },
      { name: 'Heidi', highscore: 300, rank: 3 },
      { name: 'Ivan', highscore: 200, rank: 4 },
      { name: 'Judy', highscore: 100, rank: 5 },
    ],
    'boing': [
      { name: 'Kevin', highscore: 50, rank: 1 },
      { name: 'Linda', highscore: 40, rank: 2 },
      { name: 'Mike', highscore: 30, rank: 3 },
      { name: 'Nancy', highscore: 20, rank: 4 },
      { name: 'Oscar', highscore: 10, rank: 5 },
    ],
    'pacman': [
      { name: 'Peter', highscore: 5, rank: 1 },
      { name: 'Quinn', highscore: 4, rank: 2 },
      { name: 'Rose', highscore: 3, rank: 3 },
      { name: 'Steve', highscore: 2, rank: 4 },
      { name: 'Tina', highscore: 1, rank: 5 },
    ],
    'runner': [
      { name: 'Ursula', highscore: 0, rank: 1 },
      { name: 'Victor', highscore: 0, rank: 2 },
      { name: 'Wendy', highscore: 0, rank: 3 },
      { name: 'Xavier', highscore: 0, rank: 4 },
      { name: 'Yvonne', highscore: 0, rank: 5 },
    ],
  }

  const maxScoreCount = 5
  const highscores = ensureArrayHasExactLength(leaderboard.data?.highscores, 5, { name: 'Generated Player', highscore: 0, rank: 0 })
  const gameHighscores: typeof highscores = mockHighscores[currentGameId]

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
        <img src="/logo-devoxx-white.png" alt="Devoxx" style={{ position: 'absolute', bottom: 60, left: 20, width: '25vw' }} />
        <img src="/arcade-heads.png" alt="Arcade Heads" style={{ position: 'absolute', bottom: -20, right: 20, width: '25vw' }} />
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
