import apiInterceptor from '../../api/interceptor.js';

export default async function displayMovies(
	navigate,
	toast,
	payload,
	setMovies,
	setGenres,
	setYears,
	setLoading,
	setTotalPages,
) {
	try {
		setLoading(true);

		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/admin/fetch-movie',
			payload, // Forward search, filter, and pagination state
		);

		const result = await response.json();

		if (result.success) {
			setMovies(result.data.movies);
			setGenres(result.data.allGenres);
			setYears(result.data.allYears);
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
			return { movies: [] };
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'top-right',
			autoClose: 5000,
			theme: 'dark',
		});

		setLoading(false);
		return { movies: [] };
	}
}
