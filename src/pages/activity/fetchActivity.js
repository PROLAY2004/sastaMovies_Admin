import apiInterceptor from '../../api/interceptor.js';

export default async function fetchActivity(
	navigate,
	toast,
	payload,
	setLogs,
	setAvailableActions,
	setLoading,
	setTotalPages,
) {
	try {
		setLoading(true);

		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/admin/activity',
			payload, // Forward search, filter, and pagination state
		);

		const result = await response.json();

		if (result.success) {
			setLogs(result.data.activities);
			setAvailableActions(result.data.allActions);
			setTotalPages(result.data.totalPages); // Update total pages
			setLoading(false);

			return result.data;
		} else {
			toast.error(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});

			setLoading(false);
			return { activities: [] };
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'top-right',
			autoClose: 5000,
			theme: 'dark',
		});

		setLoading(false);
		return { activities: [] };
	}
}
