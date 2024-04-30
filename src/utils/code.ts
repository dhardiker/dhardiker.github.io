export const getGameName = (gameID: string) => {
  // A hack to allow any string to attempt to be looked up from the map
  // Missing values are returned as the original string
  return (i18nGameNames as Record<string, string>)[gameID] ?? gameID
}

export const i18nGameNames = {
  'duker': 'Duker',
  'boing': 'Boing',
  'space': 'Space Invaders',
  'pacman': 'Pac-Man',
  'runner': 'Tempest Run',
} as const

export const gameIDs = Object.keys(i18nGameNames) as Array<keyof typeof i18nGameNames>

export const parseCode = (code: string) => {
  // Check we match something like: `gameID|gamerName|gameRunTime|gameRunDuration|gameRunScore§hash`
  if (!code.match(/^\w+\|\w+\|\d+\|\d+\|\d+§[-A-Za-z0-9+/=]+$/)) {
    console.error('Invalid code:', code)
    throw new Error('Invalid code')
  }
  
  const [ payload, hash ] = code.split('§')
  const [ gameID, badgeID, gameCurrentTimeAsString, gameRunDurationAsString, gameRunScoreAsString ] = payload.split('|')
  const gameCurrentTime = parseInt(gameCurrentTimeAsString, 10)
  const gameRunDuration = parseInt(gameRunDurationAsString, 10)
  const gameRunScore = parseInt(gameRunScoreAsString, 10)

  // We will need to call an API to register the score and that will check the hash

  return {
    gameID,
    badgeID,
    gameCurrentTime,
    gameRunDuration,
    gameRunScore,
  }
}
