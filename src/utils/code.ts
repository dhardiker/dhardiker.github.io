export const parseCode = (code: string) => {
  // Check we match something like: `gameID|gamerName|gameRunTime|gameRunDuration|gameRunScore§hash`
  if (!code.match(/^\w+\|\w+\|\d+\|\d+\|\d+§[-A-Za-z0-9+/=]+$/)) {
    console.error('Invalid code:', code)
    throw new Error('Invalid code')
  }
  
  const [ payload, hash ] = code.split('§')
  const [ gameID, gamerName, gameRunTimeAsString, gameRunDurationAsString, gameRunScoreAsString ] = payload.split('|')
  const gameRunTime = parseInt(gameRunTimeAsString, 10)
  const gameRunDuration = parseInt(gameRunDurationAsString, 10)
  const gameRunScore = parseInt(gameRunScoreAsString, 10)

  // We will need to call an API to register the score and that will check the hash

  return {
    gameID,
    gamerName,
    gameRunTime,
    gameRunDuration,
    gameRunScore,
  }
}
