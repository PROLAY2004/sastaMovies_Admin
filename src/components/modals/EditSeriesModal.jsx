import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import updateSeries from '../../pages/series/editSeries.js';

function EditSeriesModal({ isActive, onClose, seriesData, refresh }) {
    const navigate = useNavigate();

    const [imdbLink, setImdbLink] = useState('');
    const [posterLink, setPosterLink] = useState('');
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pre-fill form when modal opens or seriesData changes
    useEffect(() => {
        if (seriesData && isActive) {
            setImdbLink(seriesData.imdbId ? `https://www.imdb.com/title/${seriesData.imdbId}/` : (seriesData.imdbLink || ''));
            setPosterLink(seriesData.posterUrl?.horizontal || seriesData.posterLink || '');

            // The backend now provides a perfectly structured seasons array
            if (seriesData.seasons && Array.isArray(seriesData.seasons)) {
                // Deep copy the seasons to avoid mutating the original prop data
                setSeasons(JSON.parse(JSON.stringify(seriesData.seasons)));
            } else {
                setSeasons([]);
            }
        }
    }, [seriesData, isActive]);

    const resetForm = () => {
        setImdbLink('');
        setPosterLink('');
        setSeasons([]);
    };

    /* Add Season */
    const addSeason = () => {
        setSeasons((prev) => [
            ...prev,
            { seasonNumber: prev.length + 1, episodes: [] },
        ]);
    };

    /* Add Episode */
    const addEpisode = (seasonIndex) => {
        const updated = [...seasons];
        updated[seasonIndex].episodes.push({
            _id: null, // Null indicates this is a brand new episode being added during the edit
            baseUrl: '',
            totalChunks: '',
            totalSize: '',
            mimeType: '',
            subtitleLink: '',
        });
        setSeasons(updated);
    };

    /* Handle Episode Change */
    const handleEpisodeChange = (sIndex, eIndex, field, value) => {
        const updated = [...seasons];
        updated[sIndex].episodes[eIndex][field] = value;
        setSeasons(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedSeriesData = {
            contentId: seriesData._id,
            imdbLink,
            posterLink,
            seasons,
        };

        const isSuccess = await updateSeries(updatedSeriesData, navigate, toast);

        setLoading(false);

        if (isSuccess) {
            onClose();
            resetForm();
            if (refresh) refresh((prev) => prev + 1);
        }
    };

    return (
        <div className={isActive ? 'modal-overlay active' : 'modal-overlay'}>
            <div className="custom-modal add-modal series-modal">
                <div className="modal-header">
                    <h2>Edit Series</h2>
                    <span
                        className="close-btn"
                        onClick={() => {
                            if (!loading) {
                                onClose();
                                resetForm();
                            }
                        }}>
                        &times;
                    </span>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    {/* IMDB */}
                    <div className="form-group">
                        <label>IMDB Link</label>
                        <input
                            type="text"
                            placeholder="https://www.imdb.com/title/..."
                            value={imdbLink}
                            onChange={(e) => setImdbLink(e.target.value)}
                        />
                    </div>

                    {/* Poster */}
                    <div className="form-group">
                        <label>Poster (16:9)</label>
                        <input
                            type="text"
                            value={posterLink}
                            placeholder="Poster image link"
                            onChange={(e) => setPosterLink(e.target.value)}
                        />

                        <div
                            className="poster-preview"
                            style={{
                                display: posterLink ? 'block' : 'none',
                                backgroundImage: `url(${posterLink})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            }}
                        />
                    </div>

                    <div className="season-actions">
                        <button type="button" className="btn small-btn" onClick={addSeason}>
                            <i className="fas fa-add"></i> Add Season
                        </button>

                        {seasons.length > 0 && (
                            <button
                                type="button"
                                className="btn small-btn danger-outline"
                                onClick={() => setSeasons(prev => prev.slice(0, -1))}
                            >
                                <i className="fas fa-times"></i> Remove Season
                            </button>
                        )}
                    </div>

                    {/* Seasons */}
                    {seasons.map((season, sIndex) => (
                        <div className="season-block" key={sIndex}>
                            <div className="season-header">
                                <h3>Season {season.seasonNumber || sIndex + 1}</h3>

                                <div className="episode-actions">
                                    <button
                                        type="button"
                                        className="mini-btn"
                                        onClick={() => addEpisode(sIndex)}
                                    >
                                        <i className="fas fa-add"></i> Add Episode
                                    </button>

                                    {season.episodes.length > 0 && (
                                        <button
                                            type="button"
                                            className="mini-btn danger-outline"
                                            onClick={() => {
                                                const updated = [...seasons];
                                                updated[sIndex].episodes.pop();
                                                setSeasons(updated);
                                            }}
                                        >
                                            <i className="fas fa-times"></i> Remove Episode
                                        </button>
                                    )}
                                </div>
                            </div>

                            {season.episodes.map((ep, eIndex) => (
                                <div className="episode-block" key={eIndex}>
                                    <div className="episode-header">
                                        <span>Episode {eIndex + 1}</span>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Base URL</label>
                                        <input
                                            type="text"
                                            value={ep.baseUrl || ''}
                                            placeholder="Enter base URL for chunks"
                                            onChange={(e) =>
                                                handleEpisodeChange(
                                                    sIndex,
                                                    eIndex,
                                                    'baseUrl',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label>Total Chunks</label>
                                            <input
                                                type="text"
                                                value={ep.totalChunks || ''}
                                                placeholder="e.g. 120"
                                                onChange={(e) =>
                                                    handleEpisodeChange(
                                                        sIndex,
                                                        eIndex,
                                                        'totalChunks',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Total Size (Byte)</label>
                                            <input
                                                type="text"
                                                value={ep.totalSize || ''}
                                                placeholder="e.g. 2048000"
                                                onChange={(e) =>
                                                    handleEpisodeChange(
                                                        sIndex,
                                                        eIndex,
                                                        'totalSize',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Mime Type</label>
                                            <select
                                                value={ep.mimeType?.toLowerCase() || ''}
                                                onChange={(e) =>
                                                    handleEpisodeChange(
                                                        sIndex,
                                                        eIndex,
                                                        'mimeType',
                                                        e.target.value,
                                                    )
                                                }>
                                                <option value="" disabled>Select Mime Type</option>
                                                <option value="mp4">MP4</option>
                                                <option value="mkv">MKV</option>
                                                <option value="webm">WEBM</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Subtitle (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="Subtitle file link"
                                                value={ep.subtitleLink || ''}
                                                onChange={(e) =>
                                                    handleEpisodeChange(
                                                        sIndex,
                                                        eIndex,
                                                        'subtitleLink',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Actions */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn cancel"
                            onClick={() => {
                                if (!loading) {
                                    onClose();
                                    resetForm();
                                }
                            }}>
                            Cancel
                        </button>

                        <button disabled={loading} className="btn submit" type="submit">
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border text-dark"
                                        role="status"
                                        style={{ width: '20px', height: '20px' }}></div>{' '}
                                    Updating Series...
                                </>
                            ) : (
                                'Update Series'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditSeriesModal;