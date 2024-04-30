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
import { useNavigate } from "react-router-dom"
import { apiClientHooks } from '../bootstrapping/InitApiClient'
import { Paper, Skeleton } from '@mui/material'

const SkeletonListItem: React.FC = () => (
  <ListItem alignItems="flex-start">
    <ListItemAvatar>
      <Avatar color='grey' round={true} size='42px' />
    </ListItemAvatar>
    <Skeleton variant="rectangular" width={210} height={60} />
  </ListItem>
)

type ScoreListItemProps = {
  name: string,
  score: number,
  gamesPlayed?: number,
}
const ScoreListItem: React.FC<ScoreListItemProps> = ({ name, score, gamesPlayed }) =>
  <ListItem alignItems="flex-start">
    <ListItemAvatar sx={{ marginRight: 2 }}>
      <Avatar name={name} round={true} size='6vh' />
    </ListItemAvatar>
    <ListItemText
      // sx={{ color: 'white', fontSize: '5rem' }}
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

const ensureArrayHasExactLength = <T extends unknown>(arr: T[] | undefined, length: number, fill: T): T[] => {
  if (arr === undefined) return Array(length).fill(fill)
  if (arr.length === length) return arr
  if (arr.length > length) return arr.slice(0, length)
  return [...arr, ...Array(length - arr.length).fill(fill)]
}

export const Element: React.FC = () => {
  const navigate = useNavigate()

  const leaderboard = apiClientHooks.useGetPublicLeaderboard()
  if (process.env.NODE_ENV === 'development') console.log('leaderboard:', leaderboard)

  const scoreCount = 5
  const highscores = ensureArrayHasExactLength(leaderboard.data?.highscores, scoreCount, { name: 'Realsdoginoinsodign Long----', highscore: 0, rank: 0 })

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
          width: '80%',
          maxWidth: '80vh'
        }}>
          <Box sx={{ position: 'relative', flex: 1, m: 1, marginTop: 8, marginRight: 3 }}>
            <Typography variant="h4" sx={{
              fontWeight: 'bold',
              color: 'white',
              position: 'absolute',
              top: '-4.5vh', // Adjust this value as needed
              left: '1vh', // Adjust for alignment
              zIndex: 'tooltip'
            }}>
              Overall Standings
            </Typography>
            <Paper elevation={6} sx={{
              bgcolor: 'black',
              height: `${9 * scoreCount}vh`, // Adjust as per content
              border: '0.25vh solid limegreen',
              borderRadius: '2vh',
              display: 'flex',
              alignItems: 'top',
              justifyContent: 'center',
              width: '45vh',
            }}>

              <List sx={{ width: '100%', maxWidth: '35vh' }}>
                {leaderboard.isLoading && <SkeletonListItem />}
                {highscores.map((entry, index) => (
                  // TODO: Add a player key to the leaderboard API
                  // TODO: Add gamesPlayed to the leaderboard API
                  <ScoreListItem key={index} name={entry.name} score={entry.highscore} />
                ))}
              </List>

            </Paper>
          </Box>
          <Box sx={{ position: 'relative', flex: 1, m: 1, marginTop: 8 }}>
            <Typography variant="h4" sx={{
              fontWeight: 'bold',
              color: 'white',
              position: 'absolute',
              top: '-4.5vh', // Adjust this value as needed
              left: '1vh', // Adjust for alignment
              zIndex: 'tooltip'
            }}>
              Game Name
            </Typography>
            <Paper elevation={6} sx={{
              bgcolor: 'black',
              height: `${9 * scoreCount}vh`, // Adjust as per content
              border: '0.25vh solid limegreen',
              borderRadius: '2vh',
              display: 'flex',
              alignItems: 'top',
              justifyContent: 'center',
              width: '45vh',
            }}>
              {/* Replace with dynamic content */}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  </>
}
