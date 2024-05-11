import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
// import './index.css'
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

const PublicRoutes = () => {
  let accessToken = "";
  const accessTokenCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='));
  if (accessTokenCookie) accessToken = accessTokenCookie.split('=')[1];
  return accessToken ? <Navigate to="/" replace /> : <Outlet />;
};

const PrivateRoutes = () => {
  let accessToken = "";
  const accessTokenCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='));
  if (accessTokenCookie) accessToken = accessTokenCookie.split('=')[1];
  return accessToken ? <Outlet /> : <Navigate to="/auth" replace />;
};

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/auth",
        element: <Auth />
      }
    ]
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>

)
