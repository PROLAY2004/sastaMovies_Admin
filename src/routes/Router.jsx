import { createBrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import configaruration from '../config/config.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../pages/login/Login.jsx';
import Default from '../components/Default.jsx';
import Movies from '../pages/movies/Movies.jsx';
import Series from '../pages/series/Series.jsx';
import Users from '../pages/users/Users.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Default />,
	},
	{
		path: '/login',
		element: (
			<GoogleOAuthProvider clientId={configaruration.CLIENT_ID}>
				<Login />
			</GoogleOAuthProvider>
		),
	},
	{
		path: '/dashboard',
		element: (
			<ProtectedRoute>
				<Dashboard />
			</ProtectedRoute>
		),
	},
	{
		path: '/movies',
		element: (
			<ProtectedRoute>
				<Movies />
			</ProtectedRoute>
		),
	},
	{
		path: '/series',
		element: (
			<ProtectedRoute>
				<Series />
			</ProtectedRoute>
		),
	},
	{
		path: '/users',
		element: (
			<ProtectedRoute>
				<Users />
			</ProtectedRoute>
		),
	},
	{
		path: '*',
		element: <h1>No page found</h1>,
	},
]);

export default router;
