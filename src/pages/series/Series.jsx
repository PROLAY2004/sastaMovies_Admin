import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../../styles/movies.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import ListLoader from '../../components/loader/ListLoader.jsx';
import AddSeriesModal from '../../components/modals/AddSeriesModal.jsx';

function Series() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [emptyState, setEmptyState] = useState(false);
    const [sidebarActive, setSidebarActive] = useState(false);
    const [addSeriesModal, setAddSeriesModal] = useState(false);
    const [pageReload, setPageReload] = useState(0);

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

                        />
                    </div>
                    <div className="filter-group d-flex gap-2">
                        <div className="filter-dropdown w-100">
                            <select
                                className="genre-filter w-100 h-100">
                                <option value="all">All Genres</option>

                                {/* {selectedGenre !== 'all' && !genres.includes(selectedGenre) && (
                                    <option value={selectedGenre}>{selectedGenre}</option>
                                )}

                                {genres.map((genre) => (
                                    <option value={genre} key={genre}>
                                        {genre}
                                    </option>
                                ))} */}
                            </select>
                        </div>
                        <div className="filter-dropdown w-100">
                            <select
                                className="year-filter w-100 h-100">
                                <option value="all">All Years</option>
                                {/* 
                                {selectedYear !== 'all' && !years.some(y => String(y) === String(selectedYear)) && (
                                    <option value={selectedYear}>{selectedYear}</option>
                                )}

                                {years.map((year) => (
                                    <option value={year} key={year}>
                                        {year}
                                    </option>
                                ))} */}
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
                            <tr>
                                <td>
                                    <div className="table-poster" style={{ backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJpzxAtM9Rqy-jmIURm2ER98twBWGs4rYMxg&s)` }}></div>
                                </td>
                                <td>Squid Game</td>
                                <td>Action, Crime, Drama</td>
                                <td>2021–2025</td>
                                <td>7.9</td>
                                <td>3</td>
                                <td className="action-cell">
                                    <button className="action-icon edit" >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="action-icon delete" >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div
                        className="empty-state mt-4"
                        style={{ display: emptyState ? 'flex' : 'none' }}>
                        <div className="empty-state-icon">
                            <i className="fas fa-tv"></i>
                        </div>
                        <h3 className="empty-state-title">No Series Found</h3>
                        <p className="empty-state-message">
                            We couldn't find any movies matching your search criteria.
                        </p>
                    </div>
                </div>

                {/* Pagination Rendering */}
                {/* {!emptyState && !loading && (
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
                )} */}

                <AddSeriesModal isActive={addSeriesModal} onClose={() => setAddSeriesModal(false)} refresh={setPageReload} />

            </main>
        </div>
    );
}

export default Series;
