import apiInterceptor from '../../api/interceptor.js';

export default async function updateMovie(movieData, navigate, toast) {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'PUT',
			'/user/admin/movie',
			movieData,
		);
		const result = await response.json();

		if (result.success) {
			toast.success(result.message);
			return true;
		} else {
			toast.error(result.message);
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
