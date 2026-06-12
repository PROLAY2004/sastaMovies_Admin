import apiInterceptor from '../../api/interceptor.js';

export default async function markReadStatus(messageId, navigate, toast) {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/admin/read-message',
			{ messageId },
		);

		const result = await response.json();
		if (!result.success) {
			toast.error(result.message, { position: 'top-right', theme: 'dark' });
			return false;
		}
		return true;
	} catch (err) {
		toast.error(err.message, { position: 'top-right', theme: 'dark' });
		return false;
	}
}
