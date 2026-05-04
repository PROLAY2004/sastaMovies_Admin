import apiInterceptor from '../../api/interceptor.js';

export default async function displaySeries(
	navigate,
	toast,
	payload,
	setSeries,
	setGenres,
	setYears,
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
			'/user/admin/fetch-series', // Update this to your actual series endpoint
			payload,
		);

		const result = await response.json();

		if (result.success) {
			setSeries(result.data.series);
			setGenres(result.data.allGenres);
			setYears(result.data.allYears);
			setTotalPages(result.data.totalPages);
			setLoading(false);
			setAdminDetails(result.data.adminDetails);

			return result.data;
		} else {
			toast.error(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});

			setLoading(false);
			return { series: [] };
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'top-right',
			autoClose: 5000,
			theme: 'dark',
		});

		setLoading(false);
		return { series: [] };
	}
}
