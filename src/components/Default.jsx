import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Default() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/dashboard', { replace: true });
	}, [navigate]);
}

export default Default;
