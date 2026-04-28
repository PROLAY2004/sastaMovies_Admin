import apiInterceptor from '../../api/interceptor.js';

export default async function displayMovies(navigate, toast, setMovies) {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/admin/fetch-movie',
			{},
		);

		const result = await response.json();

		if (result.success) {
			setMovies(result.data.movies);
		} else {
			toast.error(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'top-right',
			autoClose: 5000,
			theme: 'dark',
		});
	}
}
