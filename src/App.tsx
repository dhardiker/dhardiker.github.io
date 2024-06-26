import React from 'react';
import * as Root from './routes/Root';
import * as Index from './routes/Index';
import * as ScanBadge from './routes/ScanBadge';
import * as Submit from './routes/Submit';
import * as Score from './routes/Score';
import * as Leaderboard from './routes/Leaderboard';
import ErrorPage from './components/ErrorPage';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

const router = () => createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root.Element />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route
          index
          element={<Index.Element />}
        />
        <Route
          path="score"
          element={<Score.Element />}
        />
        <Route
          path="scan-badge"
          element={<ScanBadge.Element />}
        />
        <Route
          path="submit"
          element={<Submit.Element />}
        />
        <Route
          path="leaderboard"
          element={<Leaderboard.Element />}
        />
      </Route>
    </Route>
  )
)

function App() {
  console.log("[App] Loaded!")
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router()} />
    </QueryClientProvider>
  )
}

export default App;
