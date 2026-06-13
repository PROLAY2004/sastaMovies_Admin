import apiInterceptor from '../../api/interceptor.js';

export const fetchAnalyticsData = async (
	payload,
	navigate,
	toast,
	setAnalyticsData,
	setLoading,
) => {
	try {
		setLoading(true);

		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/admin/analytics/data',
			payload,
		);

		const result = await response.json();

		if (result.success) {
			setAnalyticsData(result.data);
			setLoading(false);
			return result.data;
		} else {
			toast.error(result.message, { theme: 'dark' });
			setLoading(false);
			return null;
		}
	} catch (err) {
		toast.error(err.message, { theme: 'dark' });
		setLoading(false);
		return null;
	}
};
