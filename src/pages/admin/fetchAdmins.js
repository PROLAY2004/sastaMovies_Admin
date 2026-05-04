import apiInterceptor from '../../api/interceptor.js';

export default async function fetchAdmins(
	navigate,
	toast,
	payload,
	setAdmins,
	setLoading,
	setTotalPages,
) {
	try {
		setLoading(true);

		if (localStorage.getItem('isSuperAdmin') !== 'true') {
			navigate('/dashboard', { replace: true });
		}

		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/admin/fetchAdmins', // Adjust backend route as needed
			payload,
		);

		const result = await response.json();

		if (result.success) {
			setAdmins(result.data.admins);
			setTotalPages(result.data.totalPages);
			setLoading(false);
			localStorage.setItem('adminName', result.data.adminDetails.name);
			localStorage.setItem(
				'isSuperAdmin',
				result.data.adminDetails.isSuperAdmin,
			);

			return result.data;
		} else {
			toast.error(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});

			setLoading(false);
			return { admins: [] };
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'top-right',
			autoClose: 5000,
			theme: 'dark',
		});

		setLoading(false);
		return { admins: [] };
	}
}
