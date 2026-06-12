import apiInterceptor from '../../api/interceptor.js';

export default async function displayResponses(
	navigate,
	toast,
	payload,
	setResponses,
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
			'/user/admin/responses',
			payload,
		);

		const result = await response.json();

		if (result.success) {
			setResponses(result.data.responses);
			setTotalPages(result.data.totalPages);
			setAdminDetails(result.data.adminDetails);
			localStorage.setItem('adminName', result.data.adminDetails.name);
			localStorage.setItem(
				'isSuperAdmin',
				result.data.adminDetails.isSuperAdmin,
			);
			setLoading(false);
			return result.data;
		} else {
			toast.error(result.message, { position: 'top-right', theme: 'dark' });
			setLoading(false);
			return { responses: [] };
		}
	} catch (err) {
		toast.error(err.message, { position: 'top-right', theme: 'dark' });
		setLoading(false);
		return { responses: [] };
	}
}
