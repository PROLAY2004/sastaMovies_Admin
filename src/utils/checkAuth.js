export default function isAuthenticated() {
	const isAccess = localStorage.getItem('access_token');
	const isRefresh = localStorage.getItem('refresh_token');

	if (!isAccess || !isRefresh) {
		return false;
	}

	return true;
}
