import React, { useState } from 'react';

export const FileUpload = () => {
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-box">
                <h2>Upload Files</h2>
                <p>Select files to upload to your secure drive.</p>
                
                <input 
                    type="file" 
                    id="fileInput" 
                    multiple 
                    onChange={handleFileChange} 
                    className="file-input"
                />
                <label htmlFor="fileInput" className="upload-label">
                    <span>Choose Files</span>
                </label>

                {files.length > 0 && (
                    <div className="file-preview">
                        <h3>Selected Files:</h3>
                        <ul>
                            {files.map((file, index) => (
                                <li key={index}>
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
                                </li>
                            ))}
                        </ul>
                        <button className="upload-btn" onClick={() => alert("Upload to backend coming soon!")}>
                            Upload Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
