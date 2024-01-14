import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from 'react-avatar';
import Typography from '@mui/material/Typography'
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"

type ScoreListItemProps = {
  name: string,
  score: number,
  gamesPlayed: number,
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
           — {gamesPlayed} game{gamesPlayed === 1 ? '' : 's'} played
        </React.Fragment>
      }
    />
  </ListItem>

export const Element: React.FC = () => {
  const navigate = useNavigate()

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
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <ScoreListItem name="Amy Connors" score={42423} gamesPlayed={5} />
          <ScoreListItem name="Bruce Wayne" score={40123} gamesPlayed={3} />
          <ScoreListItem name="Charlie Adams" score={38555} gamesPlayed={4} />
        </List>
        <Button
          variant="contained"
          sx={{ marginTop:3 }}
          onClick={() => navigate('/')}
        >
          Back
        </Button>
      </Box>
    </Container>
  </>
}
