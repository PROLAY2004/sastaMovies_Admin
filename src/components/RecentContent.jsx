import { useState } from "react";
import { Link } from "react-router-dom";

function RecentContent({ contentData }) {
    return (
        <Link className="upload-item" to={contentData.contentType === "movie" ? "/movies" : "/series"} >
            <div className="upload-poster" style={{ backgroundImage: `url(${contentData.posterUrl.horizontal})` }}></div>
            <div className="upload-info">
                <h3 className="upload-title">{contentData.title}</h3>
                <div className="upload-meta">
                    <span className="meta-item">{contentData.rating}</span>
                    <span className="meta-item">{contentData.release.slice(-4)}</span>
                    <span className="meta-item">{contentData.runtime}</span>

                </div>
            </div>
        </Link>
    );
}

export default RecentContent;
