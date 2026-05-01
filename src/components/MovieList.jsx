function MovieList({ movieData, onEdit, onDelete, setMovie, setDelete }) {
    return (
        <tr>
            <td>
                <div className="table-poster" style={{ backgroundImage: `url(${movieData.posterUrl.horizontal})` }}></div>
            </td>
            <td>{movieData.title}</td>
            <td>{movieData.genre.join(', ')}</td>
            <td>{movieData.release.slice(-4)}</td>
            <td>{movieData.rating}</td>
            <td>{movieData.runtime}</td>
            <td className="action-cell">
                <button className="action-icon edit" onClick={() => { setMovie(movieData); onEdit(true); }}>
                    <i className="fas fa-edit"></i>
                </button>
                <button className="action-icon delete" onClick={() => { onDelete(true); setDelete(movieData._id) }}>
                    <i className="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    );
}

export default MovieList;
