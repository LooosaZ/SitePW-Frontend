import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const ProfilePage = ({ username }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [base64Result, setBase64Result] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [userData, setUserData] = useState({ username: '', nome: '', email: '', telemovel: '' });

    useEffect(() => {
        // Fetch user data when the component mounts
        fetch('http://localhost:3001/menu/utilizador/me/data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setUserData(data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setSelectedFile(file);
                setImagePreview(reader.result);
            };
            reader.onerror = (error) => {
                console.error('Error: ', error);
            };
        }
    };

    const convertToBase64 = () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1]; // Extract base64 string
                setBase64Result(base64String);
                console.log('Base64:', base64String); // Log base64 to console

                // Send the base64 string to the backend
                fetch('http://localhost:3001/menu/utilizador/me/fotoPerfil', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
                    },
                    body: JSON.stringify({ username: userData.username, image: base64String }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        setUploadStatus('Upload successful!');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        setUploadStatus('Upload failed!');
                    });
            };
            reader.onerror = (error) => {
                console.error('Error: ', error);
            };
        } else {
            alert('Please select an image file.');
        }
    };

    return (
        <div className="container">
            <h2>Profile template</h2>
            <div className="user-info">
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Name:</strong> {userData.nome}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Phone Number:</strong> {userData.telemovel}</p>
            </div>
            <input
                type="file"
                id="fileInput"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileInputChange}
            />
            <button onClick={convertToBase64}>Upload Picture</button>
            {imagePreview && (
                <div id="imagePreview">
                    <img
                        src={imagePreview}
                        alt="Uploaded Profile"
                        className="profile-image"
                    />
                </div>
            )}
            <textarea
                id="base64Result"
                rows="10"
                className="base64-result"
                value={base64Result}
                readOnly
                placeholder="Base64 string will appear here after upload"
            />
            {uploadStatus && (
                <div className={`upload-status ${uploadStatus === 'Upload successful!' ? 'success' : 'error'}`}>
                    {uploadStatus}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
