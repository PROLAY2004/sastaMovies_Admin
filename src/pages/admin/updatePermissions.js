import apiInterceptor from '../../api/interceptor.js';

export default async function updateAdminPermissions(
	adminData,
	navigate,
	toast,
) {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'PUT', // Or PATCH depending on your backend
			'/user/admin/permissions',
			adminData,
		);
		const result = await response.json();

		if (result.success) {
			toast.success(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});
			return true;
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
