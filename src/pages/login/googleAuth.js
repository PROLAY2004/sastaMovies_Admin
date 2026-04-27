import { toast } from 'react-toastify';

import Api from '../../api/Api.js';
import configaruration from '../../config/config.js';

const api = new Api();

const googleResponse = async (authResult) => {
	try {
		const res = await api.getApi(
			`${configaruration.BASE_URL}/user/auth/admin/google/?code=${authResult.code}`,
			null,
		);
		const result = await res.json();

		if (result.success) {
			toast.success(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});

			localStorage.setItem('access_token', result.data.access_token);
			localStorage.setItem('refresh_token', result.data.refresh_token);

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
};

export default googleResponse;
