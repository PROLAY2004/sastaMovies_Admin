import apiInterceptor from '../../api/interceptor.js';

export default async function displayDashboard(navigate, toast) {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'GET',
			'/user/admin/dashboard',
		);
		const result = await response.json();

		if (result.success) {
			return result.data;
		} else {
			toast.error(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});

			return false;
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'top-right',
			autoClose: 5000,
			theme: 'dark',
		});

		return false;
	}
}
