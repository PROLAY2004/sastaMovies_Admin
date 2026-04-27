import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Default() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/login', { replace: true });
	}, [navigate]);
}

export default Default;
