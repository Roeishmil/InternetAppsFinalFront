import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Camera } from 'lucide-react';
import { userProfileApi, UserProfileI, ProfileImageUpdate } from '../api';
import PostList from './PostList';

export const UserProfile = () => {
    const [showPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [tempImgUrl, setTempImgUrl] = useState<string | null>(null);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [originalImage, setOriginalImage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<UserProfileI>({
        username: '',
        id: '',
        email: '',
        password: '',
        imgUrl: ''
    });

    const [showUserPosts, setShowUserPosts] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const username = user.username;
        fetchUserData(username);
    }, []);

    const fetchUserData = async (username: string) => {
        try {
            setIsLoading(true);
            const data: UserProfileI = await userProfileApi.getByUsername(username) as UserProfileI;
            data.password = JSON.parse(localStorage.getItem("user") || "{}").password;
            setUserData(data);
            setOriginalImage(data.imgUrl);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setUserData(prev => ({ ...prev, email: newEmail }));
    };

    const handleUpdateEmail = async (newEmail: string) => {
        try {
            setIsLoading(true);
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const updatedUser = { ...user, email: newEmail };
    
            await userProfileApi.updateEmail(user.username, newEmail);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUserData(prev => ({ ...prev, email: newEmail }));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating email:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setTempImgUrl(e.target?.result as string);
            setIsEditingImage(true);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveImage = async () => {
        if (!selectedFile) return;

        try {
            setIsImageLoading(true);
            const username = JSON.parse(localStorage.getItem("user") || "{}").username;
            const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
            
            const imageUpdateData: ProfileImageUpdate = {
                username,
                id: userId,
                file: selectedFile,
                imgUrl: selectedFile.name
            };
            
            await userProfileApi.updateProfileImage(imageUpdateData);
            await fetchUserData(username);
            setIsEditingImage(false);
            setSelectedFile(null);
            setTempImgUrl(null);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsImageLoading(false);
        }
    };

    const handleRevertImage = () => {
        setTempImgUrl(null);
        setSelectedFile(null);
        setIsEditingImage(false);
        setUserData(prev => ({ ...prev, imgUrl: originalImage }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="card shadow">
                            {/* Header Section */}
                            <div className="card-header bg-primary bg-gradient p-4 text-white">
                                <div className="d-flex align-items-center">
                                    <div className="position-relative">
                                        {isImageLoading ? (
                                            <div className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: '96px', height: '96px' }}>
                                                <div className="spinner-border spinner-border-sm text-white" role="status" />
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={handleImageClick}
                                                className="position-relative p-0 border-0 bg-transparent"
                                            >
                                                {(isEditingImage ? tempImgUrl : userData.imgUrl) ? (
                                                    <>
                                                        <img 
                                                            src={isEditingImage ? tempImgUrl || '' : userData.imgUrl} 
                                                            alt="Profile" 
                                                            className="rounded-circle border border-2 border-white"
                                                            style={{ width: '96px', height: '96px', objectFit: 'cover' }}
                                                        />
                                                        <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center" 
                                                             style={{ background: 'rgba(0,0,0,0)', transition: '0.2s' }}>
                                                            <Camera className="text-white opacity-0" style={{ transition: '0.2s' }} />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center" 
                                                             style={{ width: '96px', height: '96px' }}>
                                                            <span className="text-white fs-1 fw-bold">
                                                                {userData.username.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
                                                             style={{ background: 'rgba(0,0,0,0)', transition: '0.2s' }}>
                                                            <Camera className="text-white opacity-0" style={{ transition: '0.2s' }} />
                                                        </div>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="d-none" 
                                            accept="image/*" 
                                            onChange={handleImageSelect} 
                                        />
                                    </div>
                                    <div className="ms-4">
                                        <h1 className="fs-3 fw-bold mb-0">{userData.username}</h1>
                                        <p className="text-white-50 mb-0 mt-1">Account Settings</p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Edit Controls */}
                            {isEditingImage && (
                                <div className="bg-light border-bottom p-3">
                                    <div className="d-flex justify-content-center gap-2">
                                        <button 
                                            onClick={handleSaveImage}
                                            className="btn btn-primary"
                                        >
                                            Save New Image
                                        </button>
                                        <button 
                                            onClick={handleRevertImage}
                                            className="btn btn-warning text-white"
                                        >
                                            Revert to Original
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setIsEditingImage(false);
                                                setTempImgUrl(null);
                                                setSelectedFile(null);
                                            }} 
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Content Section */}
                            <div className="card-body p-4">
                                {/* Email Section */}
                                <div className="border-bottom pb-4 mb-4">
                                    <div className="d-flex align-items-center">
                                        <Mail className="text-secondary" size={20} />
                                        <h2 className="ms-2 fs-5 fw-medium mb-0">Email Address</h2>
                                    </div>
                                    {isEditing ? (
                                        <div className="mt-3">
                                            <div className="d-flex gap-2">
                                                <input
                                                    type="email"
                                                    value={userData.email}
                                                    onChange={handleEmailChange}
                                                    className="form-control"
                                                    placeholder="Enter new email"
                                                />
                                                <button
                                                    onClick={() => handleUpdateEmail(userData.email)}
                                                    className="btn btn-primary"
                                                    disabled={isLoading}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        // Reset to original email when canceling
                                                        fetchUserData(userData.username);
                                                    }}
                                                    className="btn btn-outline-secondary"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-between mt-3">
                                            <p className="text-secondary mb-0">{userData.email}</p>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Password Section */}
                                <div>
                                    <div className="d-flex align-items-center">
                                        <Lock className="text-secondary" size={20} />
                                        <h2 className="ms-2 fs-5 fw-medium mb-0">Password</h2>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mt-3">
                                        <p className="text-secondary mb-0">{showPassword ? userData.password : '••••••••'}</p>
                                    </div>
                                </div>
                                                            {/* New section for viewing user posts */}
                            <div className="card-footer bg-white p-3">
                                <div className="d-flex justify-content-center">
                                    <button 
                                        className="btn btn-outline-primary" 
                                        onClick={() => setShowUserPosts(!showUserPosts)}
                                    >
                                        {showUserPosts ? 'Hide My Posts' : 'View My Posts'}
                                    </button>
                                </div>
                            </div>

                            {/* User Posts Section */}
                            {showUserPosts && (
                                <div className="card-body p-0">
                                    <PostList initialFilterMode="userPostsOnly" />
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;