import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Chart.js Setup
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

import '../../styles/analytics.scss';
import ListLoader from '../../components/loader/ListLoader.jsx';
import AnalyticsSkeleton from '../../components/loader/AnalyticsSkeleton.jsx'; 
import { fetchAnalyticsData } from './fetchAnalytics.js';
import formatDate from '../../utils/dateFormater.js';

const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function (chart) {
        if (chart.config.type !== 'doughnut') return;
        const { ctx, chartArea } = chart;
        
        if (!chartArea) return;
        ctx.save();
        
        const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
        const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
        const height = chartArea.bottom - chartArea.top;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textLines = chart.config.options.plugins.centerText?.text || ['', ''];

        const mainFontSize = (height / 100).toFixed(2);
        ctx.font = `600 ${mainFontSize}em Oswald, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(textLines[0], centerX, centerY - 10);

        const subFontSize = (height / 220).toFixed(2);
        ctx.font = `400 ${subFontSize}em Oswald, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(textLines[1], centerX, centerY + 18);

        ctx.restore();
    }
};

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler, centerTextPlugin);
ChartJS.defaults.color = 'rgba(255, 255, 255, 0.6)';

function Analytics() {
    const { userId } = useParams();
    const navigate = useNavigate();

    // Data States
    const [pageLoading, setPageLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [data, setData] = useState(null);

    // Filter States
    const [filter, setFilter] = useState('all');
    const [chartRange, setChartRange] = useState('7days');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;

    // Helper: Safely compare two dates and return the newest one
    const getLatestDate = (d1, d2) => {
        if (!d1) return d2;
        if (!d2) return d1;
        return new Date(d1) > new Date(d2) ? d1 : d2;
    };

    // Main Data Fetcher & Silent Background Polling
    useEffect(() => {
        if (!userId) return;
        let isMounted = true;

        const loadData = async (isInitial) => {
            if (isInitial && !data) setPageLoading(true);
            
            const payload = { userId, page: currentPage, limit, filter, chartRange };
            
            await fetchAnalyticsData(payload, navigate, toast, (fetchedData) => {
                if (isMounted) setData(fetchedData);
            }, () => {});

            if (isMounted && isInitial) setPageLoading(false);
        };

        // 1. Initial Load
        loadData(true);

        // 2. Silent Polling every 20 seconds
        const interval = setInterval(() => {
            loadData(false);
        }, 20000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [userId, navigate, currentPage, filter, chartRange]);

    useEffect(() => {
        setCurrentPage(1);
        setTableLoading(true);
        setTimeout(() => setTableLoading(false), 500);
    }, [filter]);

    if (pageLoading || !data) {
        return <AnalyticsSkeleton />;
    }

    const { userInfo, metrics, charts, table, activity } = data;
    const isLifetime = userInfo.role === 'admin' || userInfo.isSuperAdmin;
    const isExpired = !isLifetime && (new Date(userInfo.validTill) < new Date());
    const validText = isLifetime ? 'Lifetime Access' : formatDate(userInfo.validTill);

    const activeDateToDisplay = getLatestDate(userInfo.lastActive, userInfo.lastLogin);

    // Chart Configurations
    const lineChartData = {
        labels: charts.lineData.labels,
        datasets: [{
            label: 'Watch Hours',
            data: charts.lineData.data,
            borderColor: '#9ee600',
            backgroundColor: 'rgba(158, 230, 0, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#9ee600',
            pointBorderColor: '#fff',
        }]
    };

    const completionData = {
        labels: ['Completed', 'In Progress'],
        datasets: [{
            data: [charts.completion.completedCount, charts.completion.inProgressCount],
            backgroundColor: ['#9ee600', '#2a2a2a'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const typeSplitData = {
        labels: ['Movies', 'Series'],
        datasets: [{
            data: [charts.typeSplit.moviesCount, charts.typeSplit.seriesCount],
            backgroundColor: ['#ff4d4d', '#00d2ff'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const commonOptions = { responsive: true, maintainAspectRatio: false };
    const doughnutOptions = (val, label) => ({
        ...commonOptions,
        cutout: '75%',
        plugins: {
            legend: { position: 'right' },
            centerText: { text: [val, label] }
        }
    });

    return (
        <div className="standalone-analytics-container">
            <main className="analytics-content-main">

                <header className="analytics-header mb-4">
                    <div className="user-title-group">
                        <button className="action-btn icon-only" onClick={() => navigate(-1)}>
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div className="header-info">
                            <h1 className="list-title">{userInfo.name}'s Analytics</h1>
                            <div className="user-meta-info">
                                <span><i className="fas fa-calendar-alt"></i> Joined: {formatDate(userInfo.createdAt)}</span>
                                <span><i className="fas fa-envelope"></i> {userInfo.email}</span>
                                <span><i className="fas fa-sign-in-alt"></i> Last Login: {formatDate(userInfo.lastLogin)}</span>
                                <span><i className="fas fa-history"></i> Last Active: {activeDateToDisplay ? formatDate(activeDateToDisplay) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="status-indicator">
                        {activity.isOnline ? (
                            <span className="pulse-badge online"><span className="dot"></span> Online</span>
                        ) : (
                            <span className="pulse-badge offline"><span className="dot"></span> Offline</span>
                        )}
                    </div>
                </header>

                {/* 🚨 Maps through array if user is watching multiple items across devices */}
                {activity.isOnline && activity.currentWatching && activity.currentWatching.length > 0 && (
                    <div className="currently-watching-container mb-4">
                        {activity.currentWatching.map((item, index) => (
                            <div className="currently-watching-banner" key={index}>
                                <div className="pulse-ring"></div>
                                <i className="fas fa-play-circle mr-2"></i>
                                <span>Currently Watching:</span>
                                <strong>{item}</strong>
                            </div>
                        ))}
                    </div>
                )}

                {/* KPI Grid */}
                <div className="kpi-grid mb-4">
                    <div className="kpi-card">
                        <div className="kpi-icon"><i className="fas fa-clock"></i></div>
                        <div className="kpi-info">
                            <h3>{metrics.totalWatchHours} <span className="unit">hrs</span></h3>
                            <p>Total Watch Time</p>
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-icon"><i className="fas fa-film"></i></div>
                        <div className="kpi-info">
                            <h3>{metrics.totalUniqueStreams}</h3>
                            <p>Unique Streams</p>
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-icon"><i className="fas fa-bookmark"></i></div>
                        <div className="kpi-info">
                            <h3>{userInfo.savedContentsCount}</h3>
                            <p>Saved For Later</p>
                        </div>
                    </div>
                    <div className={`kpi-card ${isExpired ? 'danger' : 'success'}`}>
                        <div className="kpi-icon">
                            <i className={`fas ${isLifetime ? 'fa-infinity' : (isExpired ? 'fa-exclamation-triangle' : 'fa-check-circle')}`}></i>
                        </div>
                        <div className="kpi-info">
                            <h3>{isLifetime ? 'Admin' : (isExpired ? 'Expired' : 'Active')}</h3>
                            <p>Valid till: {validText}</p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="charts-grid mb-4">
                    <div className="chart-box main-chart">
                        <div className="chart-header">
                            <h3 className="section-title mb-0">Watch Activity</h3>
                            <select className="custom-dropdown mini" value={chartRange} onChange={(e) => setChartRange(e.target.value)}>
                                <option value="7days">Last 7 Days</option>
                                <option value="month">Last Month</option>
                                <option value="year">This Year</option>
                                <option value="lifetime">Lifetime</option>
                            </select>
                        </div>
                        <div className="chart-wrapper line-wrapper mt-3">
                            <Line data={lineChartData} options={{ ...commonOptions, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } } }} />
                        </div>
                    </div>

                    <div className="side-charts gap-2 d-flex flex-column">
                        <div className="chart-box">
                            <h3 className="section-title mb-2">Content Split</h3>
                            <div className="chart-wrapper donut-wrapper">
                                <Doughnut data={typeSplitData} options={doughnutOptions(metrics.totalUniqueStreams.toString(), 'Contents')} />
                            </div>
                        </div>
                        <div className="chart-box">
                            <h3 className="section-title mb-2">Completion Rate</h3>
                            <div className="chart-wrapper donut-wrapper">
                                <Doughnut data={completionData} options={doughnutOptions(charts.completion.completedCount.toString(), 'Completed')} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="table-section position-relative">
                    <div className="table-header-row mb-3">
                        <h3 className="section-title mb-0">Streaming Progress Library</h3>
                        <select className="custom-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Content</option>
                            <option value="movies">Movies</option>
                            <option value="series">Series</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                        </select>
                    </div>

                    {tableLoading ? (
                        <ListLoader loading={true} />
                    ) : table.streams.length > 0 ? (
                        <>
                            <div className="user-table-container">
                                <table className="user-table">
                                    <thead>
                                        <tr>
                                            <th>Content Name</th>
                                            <th>Type</th>
                                            <th>Progress</th>
                                            <th>Watch Count</th>
                                            <th>Last Watched</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.streams.map((stream) => (
                                            <tr key={stream._id}>
                                                <td className="font-weight-bold">
                                                    {stream.contentName}
                                                    {stream.contentType === 'series' && (
                                                        <span className="series-tag text-muted ml-2">
                                                            (S{stream.seasonNumber + 1} E{stream.episodeNumber + 1})
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ textTransform: 'capitalize' }}>
                                                    <span className={`type-badge ${stream.contentType}`}>{stream.contentType}</span>
                                                </td>
                                                <td>
                                                    <div className="progress-bar-wrapper">
                                                        <div className="progress-fill" style={{ width: `${stream.watchPercentage}%` }}></div>
                                                    </div>
                                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>{Math.floor(stream.watchPercentage)}%</span>
                                                </td>
                                                <td className="text-center font-weight-bold">{stream.watchCount}</td>
                                                <td>{formatDate(stream.updatedAt)}</td>
                                                <td>
                                                    {stream.isCompleted ? (
                                                        <span className="status-badge active">Completed</span>
                                                    ) : (
                                                        <span className="status-badge expired">In Progress</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {table.totalPages > 0 && (
                                <div className="pagination mt-4">
                                    <button
                                        className={`page-link ${currentPage === 1 ? 'disabled' : ''}`}
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        style={{ background: 'transparent', border: 'none' }}>
                                        <i className="fas fa-angle-left"></i>
                                    </button>

                                    {(() => {
                                        let pages = [];

                                        if (table.totalPages <= 5) {
                                            pages = Array.from({ length: table.totalPages }, (_, i) => i + 1);
                                        } else if (currentPage <= 3) {
                                            pages = [1, 2, 3, 4, '...', table.totalPages];
                                        } else if (currentPage >= table.totalPages - 2) {
                                            pages = [1, '...', table.totalPages - 3, table.totalPages - 2, table.totalPages - 1, table.totalPages];
                                        } else {
                                            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', table.totalPages];
                                        }

                                        return pages.map((page, index) => {
                                            if (page === '...') {
                                                return (
                                                    <span
                                                        key={`ellipsis-${index}`}
                                                        className="page-link disabled"
                                                        style={{ background: 'transparent', border: 'none', cursor: 'default', color: 'rgba(255,255,255,0.5)' }}>
                                                        ...
                                                    </span>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    className={`page-link ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(page)}
                                                    style={{ background: 'transparent', border: 'none' }}>
                                                    {page}
                                                </button>
                                            );
                                        });
                                    })()}

                                    <button
                                        className={`page-link ${currentPage === table.totalPages ? 'disabled' : ''}`}
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, table.totalPages))}
                                        disabled={currentPage === table.totalPages}
                                        style={{ background: 'transparent', border: 'none' }}>
                                        <i className="fas fa-angle-right"></i>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <i className="fas fa-folder-open"></i>
                            </div>
                            <h3 className="empty-state-title">No Streams Found</h3>
                            <p className="empty-state-message">No content matches the selected filter criteria.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Analytics;