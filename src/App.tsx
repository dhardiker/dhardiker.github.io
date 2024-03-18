import React from 'react';
import * as Root from './routes/Root';
import * as Index from './routes/Index';
import * as ScanCode from './routes/ScanCode';
import * as Score from './routes/Score';
import * as DisplayCode from './routes/DisplayCode';
import * as Leaderboard from './routes/Leaderboard';
import ErrorPage from './components/ErrorPage';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';

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
          path="scan-code"
          element={<ScanCode.Element />}
        />
        <Route
          path="display-code"
          element={<DisplayCode.Element />}
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
  return <RouterProvider router={router()} />
}

export default App;
