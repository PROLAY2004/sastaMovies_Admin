import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../../styles/content.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import ListLoader from '../../components/loader/ListLoader.jsx';
import SeriesList from '../../components/SeriesList.jsx';
import AddSeriesModal from '../../components/modals/AddSeriesModal.jsx';
import EditSeriesModal from '../../components/modals/EditSeriesModal.jsx';
import DeleteModal from '../../components/modals/DeleteModal.jsx';
import displaySeries from './fetchSeries.js';

function Series() {
    const navigate = useNavigate();
    const [sidebarActive, setSidebarActive] = useState(false);
    const [adminDetails, setAdminDetails] = useState({});

    // Modal States
    const [addSeriesModal, setAddSeriesModal] = useState(false);
    const [editModalActive, setEditModalActive] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);

    // Data states
    const [series, setSeries] = useState([]);
    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);
    const [seriesDetails, setSeriesDetails] = useState({});
    const [deleteId, setDeleteId] = useState('');

    // Filter and Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // UI states
    const [emptyState, setEmptyState] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pageReload, setPageReload] = useState(0);

    // 1. Debounce Search Implementation
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. Reset back to Page 1 if any filter logic is changed
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, selectedGenre, selectedYear]);

    // 3. Fetching series triggering on state change
    const fetchAllSeries = async () => {
        const payload = {
            search: debouncedSearch,
            genre: selectedGenre,
            year: selectedYear,
            page: currentPage,
            limit: 5,
        };

        const seriesData = await displaySeries(
            navigate,
            toast,
            payload,
            setSeries,
            setGenres,
            setYears,
            setLoading,
            setTotalPages,
            setAdminDetails
        );

        if (seriesData && seriesData.series.length === 0) {
            setEmptyState(true);
        } else {
            setEmptyState(false);
        }
    };

    useEffect(() => {
        fetchAllSeries();
    }, [debouncedSearch, selectedGenre, selectedYear, currentPage, pageReload]);

    return (
        <div className="admin-container">
            <Sidebar active={sidebarActive} adminDetails={adminDetails} />

            <main className="admin-main">
                <header className="header-group">
                    <Hambargar
                        toggle={() => setSidebarActive(!sidebarActive)}
                        sidebarActive={sidebarActive}
                    />

                    <div className="list-header">
                        <h1 className="list-title">Series Library</h1>
                        <div className="list-actions">
                            <button
                                onClick={() => setAddSeriesModal(true)}
                                className="action-btn primary">
                                <i className="fas fa-plus"></i>
                                Add Series
                            </button>
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <div className="search-filter d-flex gap-2 flex-sm-row">
                    <div className="search-box w-100">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search series..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-group d-flex gap-2">
                        <div className="filter-dropdown w-100">
                            <select
                                className="genre-filter w-100 h-100"
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}>
                                <option value="all">All Genres</option>

                                {selectedGenre !== 'all' && !genres.includes(selectedGenre) && (
                                    <option value={selectedGenre}>{selectedGenre}</option>
                                )}

                                {genres.map((genre) => (
                                    <option value={genre} key={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-dropdown w-100">
                            <select
                                className="year-filter w-100 h-100"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}>
                                <option value="all">All Years</option>

                                {selectedYear !== 'all' && !years.some(y => String(y) === String(selectedYear)) && (
                                    <option value={selectedYear}>{selectedYear}</option>
                                )}

                                {years.map((year) => (
                                    <option value={year} key={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <ListLoader loading={loading} />

                <div
                    className="movie-table-container mb-4"
                    style={{ display: loading ? 'none' : 'block' }}>
                    <table className="movie-table">
                        <thead>
                            <tr>
                                <th>Poster</th>
                                <th>Name</th>
                                <th>Genre</th>
                                <th>Year</th>
                                <th>Ratings</th>
                                <th>Seasons</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {series.map((item) => (
                                <SeriesList
                                    key={item._id}
                                    seriesData={item}
                                    onEdit={setEditModalActive}
                                    onDelete={setDeleteModalActive}
                                    setSeriesDetails={setSeriesDetails}
                                    setDelete={setDeleteId}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div
                    className="empty-state mt-4"
                    style={{ display: emptyState && !loading ? 'flex' : 'none' }}>
                    <div className="empty-state-icon">
                        <i className="fas fa-tv"></i>
                    </div>
                    <h3 className="empty-state-title">No Series Found</h3>
                    <p className="empty-state-message">
                        We couldn't find any series matching your search criteria.
                    </p>
                </div>

                {/* Pagination Rendering */}
                {!emptyState && !loading && (
                    <div className="pagination">
                        <button
                            className={`page-link ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ background: 'transparent', border: 'none' }}>
                            <i className="fas fa-angle-left"></i>
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`page-link ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{ background: 'transparent', border: 'none' }}>
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            style={{ background: 'transparent', border: 'none' }}>
                            <i className="fas fa-angle-right"></i>
                        </button>
                    </div>
                )}

                <AddSeriesModal
                    isActive={addSeriesModal}
                    onClose={() => setAddSeriesModal(false)}
                    refresh={setPageReload}
                />
                <EditSeriesModal
                    isActive={editModalActive}
                    onClose={() => setEditModalActive(false)}
                    seriesData={seriesDetails}
                    refresh={setPageReload}
                />
                <DeleteModal
                    isActive={deleteModalActive}
                    onClose={() => setDeleteModalActive(false)}
                    contentId={deleteId}
                    refresh={setPageReload}
                // Optional: If you need to map this strictly to a series delete route, 
                // ensure your generic DeleteModal supports dynamic route passing or creates a generic delete content endpoint.
                />
            </main>
        </div>
    );
}

export default Series;