import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

import '../../styles/login.scss';
import sendOtp from './sendOtp.js';
import userLogin from './userLogin.js';
import isAuthenticated from '../../utils/checkAuth.js';
import googleResponse from './googleAuth.js';

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [otp, setOtp] = useState('');
	const [timerActive, setTimerActive] = useState(false);
	const [timer, setTimer] = useState(120);
	const [emailForm, setEmailForm] = useState('block');
	const [otpForm, setOtpForm] = useState('none');

	const sendMail = async (e) => {
		e.preventDefault();
		const isSuccess = await sendOtp(email, setLoading, toast);

		if (isSuccess) {
			setEmailForm('none');
			setOtpForm('block');

			setTimer(120); // reset timer
			setTimerActive(true);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const isLogged = await userLogin(email, otp, setLoading, toast);

		if (isLogged) {
			const redirectPath = localStorage.getItem('postLoginRedirect');
			navigate(redirectPath || '/dashboard', { replace: true });
		}
	};

	useEffect(() => {
		if (isAuthenticated()) {
			const redirectPath = localStorage.getItem('postLoginRedirect');

			navigate(redirectPath || '/dashboard', { replace: true });
		}

		if (timer === 0 || !timerActive) return;

		const interval = setInterval(() => {
			setTimer((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [timer, timerActive]);

	const loginWithGoogle = useGoogleLogin({
		onSuccess: async (response) => {
			const isLogged = await googleResponse(response, toast);

			if (isLogged) {
				const redirectPath = localStorage.getItem('postLoginRedirect');
				navigate(redirectPath || '/dashboard', { replace: true });
			}
		},
		onError: (err) => {
			toast.error('Google login failed');
			console.log(err);
		},
		flow: 'auth-code',
	});

	return (
		<div className="auth-container">
			<div className="auth-overlay"></div>
			<div className="auth-content">
				<div className="auth-brand">
					<span className="logo-badge">Sasta Movies</span>
					<h1>Welcome Back</h1>
					<p>Unlimited entertainment awaits</p>
				</div>

				<form
					className="auth-form"
					onSubmit={sendMail}
					style={{ display: emailForm }}>
					<div className="input-group">
						<i className="fas fa-envelope"></i>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
						/>
					</div>
					<button disabled={loading} className="auth-btn primary" type="submit">
						{loading ? (
							<>
								<div
									className="spinner-border"
									role="status"
									style={{ width: '20px', height: '20px' }}></div>{' '}
								Sending OTP...
							</>
						) : (
							'Continue with Email →'
						)}
					</button>

					<div className="auth-divider">
						<span>OR</span>
					</div>

					<button
						className="auth-btn google"
						onClick={loginWithGoogle}
						type="button">
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/120px-Google_Favicon_2025.svg.png"
							alt="Google"
						/>
						Continue with Google
					</button>

					<div className="auth-footer">
						<p>This portal is exclusively for administrative users only.</p>
					</div>
				</form>

				<form
					className="login-box"
					style={{ display: otpForm }}
					onSubmit={handleSubmit}>
					<div className="input-group">
						<i className="fas fa-key"></i>

						<input
							type="text"
							maxLength="6"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							placeholder="Enter 6 Digits OTP"
						/>
					</div>

					<button disabled={loading} className="auth-btn primary" type="submit">
						{loading ? (
							<>
								<div
									className="spinner-border"
									role="status"
									style={{ width: '20px', height: '20px' }}></div>
								Verifying...
							</>
						) : (
							'Verify OTP →'
						)}
					</button>

					<div className="auth-footer">
						Didn’t receive the code?
						<div className="" style={{ fontSize: '13px', color: '#9ca3af' }}>
							{timer > 0 ? (
								<>
									Resend OTP in{' '}
									<span style={{ color: '#facc15' }}>{timer}s</span>
								</>
							) : (
								<span style={{ color: '#22c55e' }}>
									<button
										type="button"
										onClick={() => {
											setTimer(120);
											setTimerActive(true);
											sendOtp(email, setProcessing, toast);
										}}
										disabled={timer !== 0}
										className="resend-btn"
										style={{
											opacity: timer !== 0 ? 0.5 : 1,
											cursor: timer !== 0 ? 'not-allowed' : 'pointer',
										}}>
										{processing ? (
											<>
												<div
													className="spinner-border"
													role="status"
													style={{ width: '20px', height: '20px' }}></div>{' '}
												Please Wait...
											</>
										) : (
											'Resend OTP'
										)}
									</button>
								</span>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
