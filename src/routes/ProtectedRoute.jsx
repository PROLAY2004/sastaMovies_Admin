import { Navigate } from 'react-router-dom';
import isAuthenticated from '../utils/checkAuth.js';

const ProtectedRoute = ({ children }) => {
	if (!isAuthenticated()) {
		localStorage.setItem(
			'postLoginRedirect',
			window.location.pathname + window.location.search
		);
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
