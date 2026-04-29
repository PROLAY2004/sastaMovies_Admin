import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import uploadMovie from '../../pages/movies/addMovie.js';


function AddMovieModal({ isActive, onClose, refresh }) {
    const navigate = useNavigate();
    const [imdbLink, setImdbLink] = useState("");
    const [posterLink, setPosterLink] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [totalChunks, setTotalChunks] = useState("");
    const [totalSize, setTotalSize] = useState("");
    const [mimeType, setMimeType] = useState("");
    const [subtitleLink, setSubtitleLink] = useState("");
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setImdbLink("");
        setPosterLink("");
        setBaseUrl("");
        setTotalChunks("");
        setTotalSize("");
        setMimeType("");
        setSubtitleLink("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const movieData = {
            imdbLink,
            posterLink,
            baseUrl,
            totalChunks,
            totalSize,
            mimeType,
            subtitleLink
        };


        const isSuccess = await uploadMovie(movieData, navigate, toast);
        setLoading(false);

        if (isSuccess) {
            onClose();
            resetForm();
            refresh((prev) => prev + 1);
        }
    };

    return (
        <div className={isActive ? " modal-overlay active" : " modal-overlay"}>
            <div className="custom-modal add-modal">
                <div className="modal-header">
                    <h2>Add Movie</h2>
                    <span className="close-btn" onClick={onClose}>
                        &times;
                    </span>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>IMDB Link</label>
                        <input
                            type="url"
                            placeholder="https://www.imdb.com/title/..."
                            value={imdbLink}
                            onChange={(e) => setImdbLink(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Poster (16:9)</label>
                        <input
                            type="url"
                            placeholder="Poster image link"
                            value={posterLink}
                            onChange={(e) => setPosterLink(e.target.value)} />

                        <div className="poster-preview" style={{
                            display: posterLink ? 'block' : 'none',
                            backgroundImage: `url(${posterLink})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }}>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Base URL</label>
                        <input
                            type="url"
                            placeholder="Enter base URL for chunks"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                        />
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Total Chunks</label>
                            <input
                                type="text"
                                placeholder="e.g. 120"
                                value={totalChunks}
                                onChange={(e) => setTotalChunks(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Total Size (KB)</label>
                            <input
                                type="text"
                                placeholder="e.g. 2048000"
                                value={totalSize}
                                onChange={(e) => setTotalSize(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Mime Type</label>
                            <select value={mimeType} onChange={(e) => setMimeType(e.target.value)}>
                                <option value="" disabled>Select Mime Type</option>
                                <option value="mp4">MP4</option>
                                <option value="mkv">MKV</option>
                                <option value="webm">WEBM</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Subtitle (Optional)</label>
                            <input type="url" placeholder="Subtitle file link" value={subtitleLink} onChange={(e) => setSubtitleLink(e.target.value)} />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn cancel" onClick={() => { onClose(); resetForm(); }}>
                            Cancel
                        </button>
                        <button disabled={loading} className="btn submit" type="submit">
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border text-dark"
                                        role="status"
                                        style={{ width: '20px', height: '20px' }}></div>{' '}
                                    Adding Movie...
                                </>
                            ) : (
                                'Add Movie'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMovieModal;
