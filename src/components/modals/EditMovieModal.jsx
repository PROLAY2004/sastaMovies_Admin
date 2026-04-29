import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Note: You are using the 'uploadMovie' endpoint here. Make sure this endpoint 
// supports updating (e.g., PUT request) or create a dedicated editMovie.js function!
import updateMovie from '../../pages/movies/editMovie.js';

function EditMovieModal({ isActive, onClose, movieData, refresh }) {
    const navigate = useNavigate();

    // 1. Initialize states empty so it doesn't crash on the first hidden render
    const [imdbLink, setImdbLink] = useState("");
    const [posterLink, setPosterLink] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [totalChunks, setTotalChunks] = useState("");
    const [totalSize, setTotalSize] = useState("");
    const [mimeType, setMimeType] = useState("");
    const [subtitleLink, setSubtitleLink] = useState("");
    const [loading, setLoading] = useState(false);

    // 2. Watch for changes in movieData and update local form states
    useEffect(() => {
        if (movieData && isActive) {
            setImdbLink(movieData.imdbId ? `https://www.imdb.com/title/${movieData.imdbId}/` : (movieData.imdbLink || ""));
            setPosterLink(movieData.posterUrl?.horizontal || movieData.posterLink || "");
            setBaseUrl(movieData.baseUrl || "");
            setTotalChunks(movieData.chunkCount || "");
            setTotalSize(movieData.size_kb || "");
            setMimeType(movieData.mimeType ? movieData.mimeType.toLowerCase() : "");
            setSubtitleLink(movieData.subtitleUrl || "");
        }
    }, [movieData, isActive]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedMovieData = {
            contentId: movieData._id, // Important: Include ID so backend knows what to update
            imdbLink,
            posterLink,
            baseUrl,
            totalChunks,
            totalSize,
            mimeType,
            subtitleLink
        };

        const isSuccess = await updateMovie(updatedMovieData, navigate, toast);
        setLoading(false);

        if (isSuccess) {
            onClose();
            if (refresh) refresh((prev) => prev + 1); // Safely call refresh
        }
    };

    return (
        <div className={isActive ? " modal-overlay active" : " modal-overlay"}>
            <div className="custom-modal add-modal">
                <div className="modal-header">
                    <h2>Edit Movie</h2>
                    <span className="close-btn" onClick={() => { if (!loading) { onClose() } }}>
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
                            <select value={mimeType} onChange={(e) => setMimeType(e.target.value)} required>
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
                        <button type="button" className="btn cancel" onClick={() => { if (!loading) { onClose(); } }}>
                            Cancel
                        </button>
                        <button disabled={loading} className="btn submit" type="submit">
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border text-dark"
                                        role="status"
                                        style={{ width: '20px', height: '20px' }}></div>{' '}
                                    Updating Movie...
                                </>
                            ) : (
                                'Update Movie'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMovieModal;