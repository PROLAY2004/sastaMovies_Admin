import { useState } from "react";

import '../../styles/movies.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import AddMovieModal from '../../components/modals/AddMovieModal.jsx';
import DeleteModal from '../../components/modals/DeleteModal.jsx';

function Movies() {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [addModalActive, setAddModalActive] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);

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




                <div className="search-filter">
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Search movies..." />
                    </div>
                    <div className="filter-dropdown">
                        <select id="genre-filter">
                            <option value="all">All Genres</option>
                        </select>
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
                                <th>Chunks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>
                                    <div className="table-poster" style={{ backgroundImage: `url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/dbee4693-86bc-4245-a2a3-2766faf8080a/dgpgcf3-954feb91-1baf-48fc-ab46-0c44e29956b1.jpg/v1/fill/w_1280,h_672,q_75,strp/brahmayugam_malayalam_movie_custom_poster_by_subinraj_dgpgcf3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjcyIiwicGF0aCI6Ii9mL2RiZWU0NjkzLTg2YmMtNDI0NS1hMmEzLTI3NjZmYWY4MDgwYS9kZ3BnY2YzLTk1NGZlYjkxLTFiYWYtNDhmYy1hYjQ2LTBjNDRlMjk5NTZiMS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.97Ng7f8zeHRTT_9BQ3PDhf2-Bm3Vqq5f3X4cf7ySr2Y)` }}></div>
                                </td>
                                <td>Name</td>
                                <td>Genre</td>
                                <td>Year</td>
                                <td>Rating</td>
                                <td>Chunk_Count</td>
                                <td className="action-cell">
                                    <a href="/Admin/Movies/List/Edit/{{movie.mid}}/{{id}}/" className="action-icon edit">
                                        <i className="fas fa-edit"></i>
                                    </a>
                                    <a href="#" className="action-icon delete" onClick={() => setDeleteModalActive(true)}>
                                        <i className="fas fa-trash"></i>
                                    </a>
                                </td>
                            </tr>
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
