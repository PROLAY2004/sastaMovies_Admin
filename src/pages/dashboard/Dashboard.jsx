import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import DashboardLoader from '../../components/loader/DashboardLoader.jsx';
import displayDashboard from "../../pages/dashboard/fetchData.js";
import RecentContent from "../../components/RecentContent.jsx";
import '../../styles/dashboard.scss';

function Dashboard() {
    const navigate = useNavigate();
    const [adminDetails, setAdminDetails] = useState({});
    const [movieCount, setMovieCount] = useState(0);
    const [seriesCount, setSeriesCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [sidebarActive, setSidebarActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [contents, setContents] = useState([]);

    const handleDisplay = async () => {
        const result = await displayDashboard(navigate, toast);

        if (result) {
            setContents(result.contents);
            setMovieCount(result.movieCount);
            setSeriesCount(result.seriesCount);
            setUserCount(result.userCount);
            setAdminDetails(result.adminDetails);
            localStorage.setItem('adminName', result.adminDetails.name);
            localStorage.setItem('isSuperAdmin', result.adminDetails.isSuperAdmin);
            setLoading(false);
        }
    }
    useEffect(() => {
        handleDisplay();
    }, []);

    return (
        <div className="admin-container">
            <Sidebar active={sidebarActive} adminDetails={adminDetails} />

            <main className="admin-main">
                <header className="header-group">
                    <Hambargar toggle={() => setSidebarActive(!sidebarActive)} sidebarActive={sidebarActive} />

                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Admin Dashboard</h1>
                    </div>
                </header>

                <DashboardLoader loading={loading} />

                <div className="stats-grid" style={{ display: loading ? 'none' : 'grid' }}>
                    <div className="stat-card">
                        <div className="stat-value">{movieCount}</div>
                        <div className="stat-label">Total Movies</div>
                        <div className="stat-icon">
                            <i className="fas fa-film"></i>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{seriesCount}</div>
                        <div className="stat-label">Total Series</div>
                        <div className="stat-icon">
                            <i className="fas fa-tv"></i>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{userCount}</div>
                        <div className="stat-label">Active Users</div>
                        <div className="stat-icon">
                            <i className="fas fa-users"></i>
                        </div>
                    </div>
                </div>

                <div className="recent-uploads" style={{ display: loading ? 'none' : 'block' }}>
                    <div className="section-header">
                        <h2 className="section-title">Recent Uploads</h2>
                    </div>

                    <div className="uploads-grid">

                        {contents.map((content) => (
                            <RecentContent contentData={content} key={content._id} />
                        ))}


                        <div className="empty-state" style={{ gridColumn: "1 / -1", width: "100%", display: contents.length === 0 ? 'block' : 'none' }}>
                            <div className="empty-state-icon"><i className='fas fa-folder'></i></div>
                            <h3 className="empty-state-title">No Uploads Yet</h3>
                            <p className="empty-state-message">Be the first to upload content. Your uploaded files will appear here.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
