export default class Api {
	getApi = async (url, token) => {
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			});

			return res;
		} catch (err) {
			throw new Error(err);
		}
	};

	postApi = async (url, token, reqBody = {}) => {
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqBody),
			});

			return res;
		} catch (err) {
			throw new Error(err);
		}
	};

	patchApi = async (url, token, reqBody = {}) => {
		try {
			const res = await fetch(url, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqBody),
			});

			return res;
		} catch (err) {
			throw new Error(err);
		}
	};

	putApi = async (url, token, reqBody = {}) => {
		try {
			const res = await fetch(url, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqBody),
			});

			return res;
		} catch (err) {
			throw new Error(err);
		}
	};

	deleteApi = async (url, token, reqBody = {}) => {
		try {
			const res = await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqBody),
			});

			return res;
		} catch (err) {
			throw new Error(err);
		}
	};
}
