import apiInterceptor from '../../api/interceptor.js';

export default async function fetchSingleMessage(
	msgId,
	navigate,
	toast,
	setLoading,
) {
	try {
		setLoading(true);
		const response = await apiInterceptor(
			navigate,
			toast,
			'GET',
			`/user/admin/response/${msgId}`, // Ensure your backend route matches this
		);

		const result = await response.json();
		setLoading(false);

		if (result.success) {
			return result.data;
		} else {
			toast.error(result.message, { position: 'top-right', theme: 'dark' });
			return null;
		}
	} catch (err) {
		setLoading(false);
		toast.error(err.message, { position: 'top-right', theme: 'dark' });
		return null;
	}
}
