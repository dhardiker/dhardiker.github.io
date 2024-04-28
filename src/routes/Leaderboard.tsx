import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from 'react-avatar';
import Typography from '@mui/material/Typography'
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { apiClientHooks } from '../bootstrapping/InitApiClient'
import { Skeleton } from '@mui/material'

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
    <ListItemAvatar>
      <Avatar name={name} round={true} size='42px' />
    </ListItemAvatar>
    <ListItemText
      primary={`${Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(score)} points`}
      secondary={
        <React.Fragment>
          <Typography
            sx={{ display: 'inline' }}
            component="span"
            variant="body2"
            color="text.primary"
          >
            {name}
          </Typography>
          {gamesPlayed !== undefined && <>— {gamesPlayed} game{gamesPlayed === 1 ? '' : 's'} played</>}
        </React.Fragment>
      }
    />
  </ListItem>

export const Element: React.FC = () => {
  const navigate = useNavigate()

  const leaderboard = apiClientHooks.useGetPublicLeaderboard()
  if (process.env.NODE_ENV === 'development') console.log('leaderboard:', leaderboard)

  return <>
    <Helmet>
      <title>Leaderboard</title>
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
          Leaderboard
        </Typography>
        {!leaderboard.isLoading && leaderboard.data?.highscores.length === 0 && (
          <Typography component="h2" variant="h2" marginBottom={3}>
            <em>There are no scores yet!</em>
          </Typography>
        )}
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {leaderboard.isLoading && <SkeletonListItem />}
          {leaderboard.data?.highscores.map((entry, index) => (
            // TODO: Add a player key to the leaderboard API
            // TODO: Add gamesPlayed to the leaderboard API
            <ScoreListItem key={index} name={entry.name} score={entry.highscore} />
          ))}
        </List>
        <Button
          variant="contained"
          sx={{ marginTop: 3 }}
          onClick={() => navigate('/')}
        >
          Back
        </Button>
      </Box>
    </Container>
  </>
}
