function ErrorPage() {
    return (
        <>
            <style>{`
                .not-found-page {
                    min-height: 100vh;
                    background: linear-gradient(
                        135deg,
                        #0a0a0a 0%,
                        #141414 50%,
                        #0a0a0a 100%
                    );
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    position: relative;
                    color: #ffffff;
                }

                .not-found-page::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background-image:
                        radial-gradient(rgba(158, 230, 0, 0.08) 1px, transparent 1px);
                    background-size: 25px 25px;
                    opacity: 0.4;
                }

                .not-found-card {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    max-width: 700px;
                    padding: 3rem 2rem;
                    text-align: center;
                    border: 2px solid #4c6613;
                    border-radius: 20px;
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(10px);
                    box-shadow:
                        0 0 20px rgba(158, 230, 0, 0.15),
                        0 0 50px rgba(158, 230, 0, 0.08);
                }

                .glitch {
                    position: relative;
                    display: inline-block;
                    color: #9ee600;
                    font-weight: 700;
                    line-height: 1;
                    text-transform: uppercase;
                }

                .glitch::before,
                .glitch::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    overflow: hidden;
                }

                .glitch::before {
                    color: #ffffff;
                    left: -3px;
                    text-shadow: 2px 0 #9ee600;
                    animation: glitch1 2s infinite linear alternate-reverse;
                }

                .glitch::after {
                    color: #9ee600;
                    left: 3px;
                    text-shadow: -2px 0 #ffffff;
                    animation: glitch2 1.5s infinite linear alternate-reverse;
                }

                .error-code {
                    font-size: clamp(5rem, 18vw, 10rem);
                    margin-bottom: 0.5rem;
                }

                .error-title {
                    font-size: clamp(1.5rem, 4vw, 3rem);
                    margin-bottom: 1rem;
                    letter-spacing: 3px;
                }

                .error-text {
                    color: rgba(255,255,255,0.7);
                    font-size: 1rem;
                    margin-bottom: 2rem;
                }

                .home-btn {
                    background: #9ee600;
                    color: #141414;
                    border: none;
                    font-weight: 600;
                    padding: 12px 30px;
                    border-radius: 50px;
                    transition: all 0.3s ease;
                }

                .home-btn:hover {
                    background: #b7ff2c;
                    transform: translateY(-2px);
                    color: #0a0a0a;
                    box-shadow: 0 0 20px rgba(158,230,0,0.4);
                }

                @keyframes glitch1 {
                    0% {
                        clip-path: inset(0 0 85% 0);
                    }
                    20% {
                        clip-path: inset(15% 0 55% 0);
                    }
                    40% {
                        clip-path: inset(60% 0 10% 0);
                    }
                    60% {
                        clip-path: inset(30% 0 40% 0);
                    }
                    80% {
                        clip-path: inset(75% 0 5% 0);
                    }
                    100% {
                        clip-path: inset(45% 0 30% 0);
                    }
                }

                @keyframes glitch2 {
                    0% {
                        clip-path: inset(80% 0 5% 0);
                    }
                    20% {
                        clip-path: inset(10% 0 70% 0);
                    }
                    40% {
                        clip-path: inset(50% 0 25% 0);
                    }
                    60% {
                        clip-path: inset(20% 0 55% 0);
                    }
                    80% {
                        clip-path: inset(65% 0 10% 0);
                    }
                    100% {
                        clip-path: inset(35% 0 35% 0);
                    }
                }
            `}</style>

            <div className="not-found-page">
                <div className="not-found-card">
                    <h1
                        className="glitch error-code"
                        data-text="404"
                    >
                        404
                    </h1>

                    <h2
                        className="glitch error-title"
                        data-text="PAGE NOT FOUND"
                    >
                        PAGE NOT FOUND
                    </h2>

                    <p className="error-text">
                        The page you are looking for doesn't exist or has been
                        moved to another location.
                    </p>

                    <button
                        className="btn home-btn"
                        onClick={() => (window.location.href = "/")}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </>
    );
}

export default ErrorPage;