import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../../styles/movies.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import AddMovieModal from '../../components/modals/AddMovieModal.jsx';
import EditMovieModal from '../../components/modals/EditMovieModal.jsx';
import DeleteModal from '../../components/modals/DeleteModal.jsx';
import MovieList from '../../components/MovieList.jsx';
import ListLoader from '../../components/ListLoader.jsx';
import displayMovies from './fetchMovie.js';

function Movies() {
    const navigate = useNavigate();
    const [sidebarActive, setSidebarActive] = useState(false);
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
            <Sidebar active={sidebarActive} />

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
                    <div className="filter-group d-flex gap-2">
                        <div className="filter-dropdown w-100">
                            <select
                                className="genre-filter w-100 h-100"
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}>
                                <option value="all">All Genres</option>
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

                    <div
                        className="empty-state mt-4"
                        style={{ display: emptyState ? 'flex' : 'none' }}>
                        <div className="empty-state-icon">
                            <i className="fas fa-film"></i>
                        </div>
                        <h3 className="empty-state-title">No Movies Found</h3>
                        <p className="empty-state-message">
                            We couldn't find any movies matching your search criteria.
                        </p>
                    </div>
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
