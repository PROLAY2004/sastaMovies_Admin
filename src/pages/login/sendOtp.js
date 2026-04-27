import Api from '../../api/Api.js';
import configaruration from '../../config/config.js';

const api = new Api();

export default async function sendOtp(email, setLoading, toast) {
	try {
		setLoading(true);

		const res = await api.postApi(
			`${configaruration.BASE_URL}/user/auth/admin/signin`,
			null,
			{ email },
		);
		const result = await res.json();

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
	} finally {
		setLoading(false);
	}
}
