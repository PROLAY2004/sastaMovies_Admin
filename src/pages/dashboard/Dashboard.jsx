import { useState } from "react";

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import '../../styles/dashboard.scss';

function Dashboard() {
    const [sidebarActive, setSidebarActive] = useState(false);

    return (
        <div className="admin-container">
            <Sidebar active={sidebarActive} />

            <main className="admin-main">
                <header className="header-group">
                    <Hambargar toggle={() => setSidebarActive(!sidebarActive)} sidebarActive={sidebarActive} />

                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Admin Dashboard</h1>
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">0</div>
                        <div className="stat-label">Total Movies</div>
                        <div className="stat-icon">
                            <i className="fas fa-film"></i>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">0</div>
                        <div className="stat-label">Total Series</div>
                        <div className="stat-icon">
                            <i className="fas fa-tv"></i>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">0</div>
                        <div className="stat-label">Active Users</div>
                        <div className="stat-icon">
                            <i className="fas fa-users"></i>
                        </div>
                    </div>
                </div>

                <div className="recent-uploads">
                    <div className="section-header">
                        <h2 className="section-title">Recent Uploads</h2>
                    </div>

                    <div className="uploads-grid">
                        {/* <div className="upload-item">
                        <div className="upload-poster" style={{ backgroundImage: 'url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/dbee4693-86bc-4245-a2a3-2766faf8080a/dgpgcf3-954feb91-1baf-48fc-ab46-0c44e29956b1.jpg/v1/fill/w_1280,h_672,q_75,strp/brahmayugam_malayalam_movie_custom_poster_by_subinraj_dgpgcf3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjcyIiwicGF0aCI6Ii9mL2RiZWU0NjkzLTg2YmMtNDI0NS1hMmEzLTI3NjZmYWY4MDgwYS9kZ3BnY2YzLTk1NGZlYjkxLTFiYWYtNDhmYy1hYjQ2LTBjNDRlMjk5NTZiMS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.97Ng7f8zeHRTT_9BQ3PDhf2-Bm3Vqq5f3X4cf7ySr2Y)' }}></div>
                        <div className="upload-info">
                            <h3 className="upload-title">Name</h3>
                            <div className="upload-meta">
                                <span className="meta-item">Year</span>
                                <span className="meta-item">Duration</span>
                                <span className="meta-item">Rating</span>
                            </div>
                        </div>
                    </div> */}

                        <div className="empty-state" style={{ gridColumn: "1 / -1", width: "100%" }}>
                            <div className="empty-state-icon"><i class='fas fa-folder'></i></div>
                            <h3 className="empty-state-title">No Uploads Yet</h3>
                            <p className="empty-state-message">Be the first to upload content. Your uploaded files will appear here.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>);
}

export default Dashboard;
