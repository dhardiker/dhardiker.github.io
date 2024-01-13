import { Outlet, useNavigation } from "react-router-dom"
import { Box, CircularProgress, Container } from "@mui/material";

export const Element: React.FC = () => {
  const navigation = useNavigation()

  return <>
    {navigation.state === "loading"
      ? (
        <Container component="main">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        </Container>
      )
      : (
        <Outlet />
      )}
  </>
}

export default Element
