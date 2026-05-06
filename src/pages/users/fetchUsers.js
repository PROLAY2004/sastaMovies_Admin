import apiInterceptor from '../../api/interceptor.js';

export default async function displayUsers(
	navigate,
	toast,
	payload,
	setUsers,
	setLoading,
	setTotalPages,
	setAdminDetails,
) {
	try {
		setLoading(true);

		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/admin/users',
			payload,
		);

		const result = await response.json();

		if (result.success) {
			setUsers(result.data.users);
			setTotalPages(result.data.totalPages);
			setLoading(false);
			setAdminDetails(result.data.adminDetails);
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
			return { users: [] };
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'top-right',
			autoClose: 5000,
			theme: 'dark',
		});

		setLoading(false);
		return { users: [] };
	}
}
