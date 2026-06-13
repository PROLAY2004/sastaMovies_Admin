import { createBrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import configaruration from '../config/config.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../pages/login/Login.jsx';
import Default from '../components/Default.jsx';
import Movies from '../pages/movies/Movies.jsx';
import Series from '../pages/series/Series.jsx';
import Users from '../pages/users/Users.jsx';
import Activity from '../pages/activity/Activity.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import Admin from '../pages/admin/Admin.jsx';
import Responses from '../pages/responses/Responses.jsx';
import ErrorPage from '../components/ErrorPage.jsx';
import Analytics from '../pages/analytics/Analytics.jsx';

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
		path: '/activity',
		element: (
			<ProtectedRoute>
				<Activity />
			</ProtectedRoute>
		),
	},
	{
		path: '/admin',
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: '/analytics/:userId',
		element: (
			<ProtectedRoute>
				<Analytics />
			</ProtectedRoute>
		)
	},
	{
		// Added optional parameter :msg_id? to handle both /responses and /responses/id
		path: '/responses/:msg_id?',
		element: (
			<ProtectedRoute>
				<Responses />
			</ProtectedRoute>
		),
	},
	{
		path: '*',
		element: <ErrorPage />,
	},
]);

export default router;
