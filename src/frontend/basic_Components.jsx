import React, { useState, useEffect } from 'react';

export const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch uploaded files on component mount
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('/api/files');
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            const data = await response.json();
            // Ensure data is an array
            setUploadedFiles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching files:', error);
            setUploadedFiles([]); // Set empty array on error
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setMessage('');

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }
            }

            setMessage('Files uploaded successfully!');
            setFiles([]);
            fetchFiles(); // Refresh the file list
        } catch (error) {
            setMessage('Error uploading files: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = (fileId, fileName) => {
        window.open(`/api/download/${fileId}`, '_blank');
    };

    const handleDelete = async (fileId) => {
        try {
            const response = await fetch(`/api/delete/${fileId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchFiles(); // Refresh the file list
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
                                    <span className="file-size">{formatSize(file.size)}</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            className="upload-btn" 
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload Now'}
                        </button>
                    </div>
                )}

                {message && <p className="message">{message}</p>}
            </div>

            {/* Uploaded Files List */}
            <div className="uploaded-files">
                <h2>Your Files</h2>
                {uploadedFiles.length === 0 ? (
                    <p>No files uploaded yet.</p>
                ) : (
                    <table className="files-table">
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Size</th>
                                <th>Upload Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploadedFiles.map((file) => (
                                <tr key={file._id}>
                                    <td>{file.originalName}</td>
                                    <td>{formatSize(file.size)}</td>
                                    <td>{formatDate(file.uploadDate)}</td>
                                    <td>
                                        <button 
                                            className="download-btn"
                                            onClick={() => handleDownload(file._id, file.originalName)}
                                        >
                                            Download
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(file._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
