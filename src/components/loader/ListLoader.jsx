function ListLoader({ loading }) {
    return (
        <div className="skeleton-table mb-5" style={{ display: loading ? 'block' : 'none' }}>

            <div className="skeleton-table-header">
                <div className="skeleton th"></div>
                <div className="skeleton th"></div>
                <div className="skeleton th"></div>
                <div className="skeleton th"></div>
                <div className="skeleton th"></div>
                <div className="skeleton th"></div>
                <div className="skeleton th"></div>
            </div>

            <div className="skeleton-row">
                <div className="skeleton poster"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton actions"></div>
            </div>

            <div className="skeleton-row">
                <div className="skeleton poster"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton actions"></div>
            </div>

            <div className="skeleton-row">
                <div className="skeleton poster"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text"></div>
                <div className="skeleton actions"></div>
            </div>

        </div>
    );
}

export default ListLoader;
