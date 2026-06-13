import '../../styles/analytics.scss';

export default function AnalyticsSkeleton() {
    return (
        <div className="standalone-analytics-container">
            <main className="analytics-content-main">
                <div className="analytics-header skeleton-header skeleton mb-4"></div>
                <div className="kpi-grid mb-4">
                    <div className="kpi-card skeleton"></div>
                    <div className="kpi-card skeleton"></div>
                    <div className="kpi-card skeleton"></div>
                    <div className="kpi-card skeleton"></div>
                </div>
                <div className="charts-grid mb-4">
                    <div className="chart-box skeleton" style={{ height: '350px' }}></div>
                    <div className="side-charts d-flex flex-column gap-3">
                        <div className="chart-box skeleton" style={{ height: '165px' }}></div>
                        <div className="chart-box skeleton" style={{ height: '165px' }}></div>
                    </div>
                </div>
            </main>
        </div>
    );
}