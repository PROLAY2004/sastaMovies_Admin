import { useState } from "react";

function MovieList({ movieData }) {
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
                <button className="action-icon edit">
                    <i className="fas fa-edit"></i>
                </button>
                <button className="action-icon delete">
                    <i className="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    );
}

export default MovieList;
