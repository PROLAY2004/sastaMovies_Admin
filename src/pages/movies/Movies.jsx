import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import '../../styles/movies.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import AddMovieModal from '../../components/modals/AddMovieModal.jsx';
import DeleteModal from '../../components/modals/DeleteModal.jsx';
import MovieList from '../../components/MovieList.jsx';
import displayMovies from './fetchMovie.js';

function Movies() {
    const navigate = useNavigate();
    const [sidebarActive, setSidebarActive] = useState(false);
    const [addModalActive, setAddModalActive] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const movieData = displayMovies(navigate, toast, setMovies);
    }, []);

    return (
        <div className="admin-container">
            <Sidebar active={sidebarActive} />

            <main className="admin-main">

                <header className="header-group">
                    <Hambargar toggle={() => setSidebarActive(!sidebarActive)} sidebarActive={sidebarActive} />

                    <div className="list-header">
                        <h1 className="list-title">Movie Library</h1>
                        <div className="list-actions">
                            <button className="action-btn primary" onClick={() => setAddModalActive(true)}>
                                <i className="fas fa-plus"></i>
                                Add Movie
                            </button>
                        </div>
                    </div>
                </header>

                <div className="search-filter d-flex gap-2 flex-sm-row">
                    <div className="search-box w-100">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Search movies..." />
                    </div>
                    <div className="filter-group d-flex gap-2">
                        <div className="filter-dropdown w-100">
                            <select className="genre-filter w-100 h-100">
                                <option value="all">All Genres</option>
                            </select>
                        </div>
                        <div className="filter-dropdown w-100">
                            <select className="year-filter w-100 h-100">
                                <option value="all">All Years</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="movie-table-container">
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
                            {movies.map((movie) => {
                                return (
                                    <MovieList movieData={movie} />
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* <p className="empty-movie-message">No Movies Found.</p> */}

                <div className="pagination">
                    <a href="#" className="page-link disabled">
                        <i className="fas fa-angle-left"></i>
                    </a>
                    <a href="#" className="page-link active">1</a>
                    <a href="#" className="page-link">2</a>
                    <a href="#" className="page-link">3</a>
                    <a href="#" className="page-link">
                        <i className="fas fa-angle-right"></i>
                    </a>
                </div>


                <AddMovieModal isActive={addModalActive} onClose={() => setAddModalActive(false)} />
                <DeleteModal isActive={deleteModalActive} onClose={() => setDeleteModalActive(false)} />

                {/* <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button className="modal-close">&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this movie? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-btn cancel">Cancel</button>
                            <button className="modal-btn confirm">Delete</button>
                        </div>
                    </div>
                </div> */}
            </main>
        </div>


    )
        ;
}

export default Movies;
