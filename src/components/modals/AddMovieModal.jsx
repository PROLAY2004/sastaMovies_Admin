import { useState } from "react";


function AddMovieModal({ isActive, onClose }) {

    return (
        <div className={isActive ? " modal-overlay active" : " modal-overlay"}>
            <div className="custom-modal add-modal">
                <div className="modal-header">
                    <h2>Add Movie</h2>
                    <span className="close-btn" onClick={onClose}>
                        &times;
                    </span>
                </div>

                <form className="modal-form">

                    <div className="form-group">
                        <label>IMDB Link</label>
                        <input type="url" placeholder="https://www.imdb.com/title/..." />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea rows="3" placeholder="Enter movie description..."></textarea>
                    </div>

                    <div className="form-group">
                        <label>Poster (16:9)</label>
                        <input type="url" placeholder="Poster image link" />
                        <div className="poster-preview">
                            <span>Preview</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Base URL</label>
                        <input type="url" placeholder="Enter base URL for chunks" />
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Total Chunks</label>
                            <input type="text" placeholder="e.g. 120" />
                        </div>

                        <div className="form-group">
                            <label>Total Size (KB)</label>
                            <input type="text" placeholder="e.g. 2048000" />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Mime Type</label>
                            <select>
                                <option>MP4</option>
                                <option>MKV</option>
                                <option>WEBM</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Subtitle (Optional)</label>
                            <input type="url" placeholder="Subtitle file link" />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn submit">
                            Add Movie
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddMovieModal;
