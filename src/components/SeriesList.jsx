function SeriesList({ seriesData, onEdit, onDelete, setSeriesDetails, setDelete }) {
    return (
        <tr>
            <td>
                <div className="table-poster" style={{ backgroundImage: `url(${seriesData.posterUrl.horizontal})` }}></div>
            </td>
            <td>{seriesData.title}</td>
            <td>{seriesData.genre.join(', ')}</td>
            <td>{seriesData.release.slice(-4)}</td>
            <td>{seriesData.rating}</td>
            <td>{seriesData.contentIds.length}</td>
            <td className="action-cell">
                <button className="action-icon edit" title="Edit Series" onClick={() => { setSeriesDetails(seriesData); onEdit(true); }}>
                    <i className="fas fa-edit"></i>
                </button>
                <button className="action-icon delete" title="Delete Series" onClick={() => { onDelete(true); setDelete(seriesData._id) }}>
                    <i className="fas fa-trash"></i>
                </button>
            </td>
        </tr>


    );
}

export default SeriesList;
