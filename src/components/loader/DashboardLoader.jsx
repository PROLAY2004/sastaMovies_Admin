function DashboardLoader({ loading }) {
    return (
        <div className="dashboard-skeleton" style={{ display: loading ? 'block' : 'none' }}>
            <div className="skeleton-cards">
                <div className="skeleton-card">
                    <div className="skeleton number"></div>
                    <div className="skeleton label"></div>
                </div>

                <div className="skeleton-card">
                    <div className="skeleton number"></div>
                    <div className="skeleton label"></div>
                </div>

                <div className="skeleton-card">
                    <div className="skeleton number"></div>
                    <div className="skeleton label"></div>
                </div>
            </div>


            <div className="skeleton-uploads">
                <div className="skeleton title"></div>

                <div className="skeleton-upload-grid">
                    <div className="skeleton-upload-card">
                        <div className="skeleton poster-img"></div>
                        <div className="skeleton text"></div>
                        <div className="skeleton text small"></div>
                    </div>

                    <div className="skeleton-upload-card">
                        <div className="skeleton poster-img"></div>
                        <div className="skeleton text"></div>
                        <div className="skeleton text small"></div>
                    </div>

                    <div className="skeleton-upload-card">
                        <div className="skeleton poster-img"></div>
                        <div className="skeleton text"></div>
                        <div className="skeleton text small"></div>
                    </div>

                    <div className="skeleton-upload-card">
                        <div className="skeleton poster-img"></div>
                        <div className="skeleton text"></div>
                        <div className="skeleton text small"></div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DashboardLoader;
