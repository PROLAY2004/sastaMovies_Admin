import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../../styles/content.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import AddMovieModal from '../../components/modals/AddMovieModal.jsx';
import EditMovieModal from '../../components/modals/EditMovieModal.jsx';
import DeleteModal from '../../components/modals/DeleteModal.jsx';
import MovieList from '../../components/MovieList.jsx';
import ListLoader from '../../components/loader/ListLoader.jsx';
import displayMovies from './fetchMovie.js';

function Movies() {
    const navigate = useNavigate();
    const [sidebarActive, setSidebarActive] = useState(false);
    const [adminDetails, setAdminDetails] = useState({});
    const [addModalActive, setAddModalActive] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const [editModalActive, setEditModalActive] = useState(false);

    // Data states
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);
    const [movieDetails, setMovieDetails] = useState({});
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

    // 1. Debounce Search Implementation (Triggers 400ms after user stops typing)
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

    // 3. Fetching movies triggering on state change
    const fetchMovies = async () => {
        const payload = {
            search: debouncedSearch,
            genre: selectedGenre,
            year: selectedYear,
            page: currentPage,
            limit: 5,
        };

        const movieData = await displayMovies(
            navigate,
            toast,
            payload,
            setMovies,
            setGenres,
            setYears,
            setLoading,
            setTotalPages,
            setAdminDetails
        );

        if (movieData && movieData.movies.length === 0) {
            setEmptyState(true);
        } else {
            setEmptyState(false);
        }
    };

    useEffect(() => {
        fetchMovies();
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
                        <h1 className="list-title">Movie Library</h1>
                        <div className="list-actions">
                            <button
                                className="action-btn primary"
                                onClick={() => setAddModalActive(true)}>
                                <i className="fas fa-plus"></i>
                                Add Movie
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
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-group d-flex flex-row w-100 gap-2">
                        <div className="filter-dropdown w-100">
                            <select
                                className="genre-filter w-100 h-100"
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}>
                                <option value="all">All Genres</option>

                                {/* FIX: Keep selected genre in dropdown even if no movies exist */}
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

                                {/* FIX: Keep selected year in dropdown even if no movies exist */}
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
                                <th>Runtime</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie) => (
                                <MovieList
                                    movieData={movie}
                                    key={movie._id}
                                    onEdit={setEditModalActive}
                                    onDelete={setDeleteModalActive}
                                    setMovie={setMovieDetails}
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
                        <i className="fas fa-film"></i>
                    </div>
                    <h3 className="empty-state-title">No Movies Found</h3>
                    <p className="empty-state-message">
                        We couldn't find any movies matching your search criteria.
                    </p>
                </div>

                {/* Pagination Rendering */}
                {!emptyState && !loading && totalPages > 0 && (
                    <div className="pagination">
                        {/* Previous Button */}
                        <button
                            className={`page-link ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ background: 'transparent', border: 'none' }}>
                            <i className="fas fa-angle-left"></i>
                        </button>

                        {/* Dynamic Pagination with Ellipses */}
                        {(() => {
                            let pages = [];

                            if (totalPages <= 5) {
                                // Show all if 5 or fewer pages
                                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                            } else if (currentPage <= 3) {
                                // Near the start: 1, 2, 3, 4, ..., Last
                                pages = [1, 2, 3, 4, '...', totalPages];
                            } else if (currentPage >= totalPages - 2) {
                                // Near the end: 1, ..., Last-2, Last-1, Last
                                pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                            } else {
                                // In the middle: 1, ..., Prev, Current, Next, ..., Last
                                pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
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

                        {/* Next Button */}
                        <button
                            className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ background: 'transparent', border: 'none' }}>
                            <i className="fas fa-angle-right"></i>
                        </button>
                    </div>
                )}

                <AddMovieModal
                    isActive={addModalActive}
                    onClose={() => setAddModalActive(false)}
                    refresh={setPageReload}
                />
                <EditMovieModal
                    isActive={editModalActive}
                    onClose={() => setEditModalActive(false)}
                    movieData={movieDetails}
                    refresh={setPageReload}
                />
                <DeleteModal
                    isActive={deleteModalActive}
                    onClose={() => setDeleteModalActive(false)}
                    contentId={deleteId}
                    refresh={setPageReload}
                />
            </main>
        </div>
    );
}

export default Movies;
