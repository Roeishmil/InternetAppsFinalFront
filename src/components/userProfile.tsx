import React, { useState, useEffect, useRef } from 'react';
import { User, Camera, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { userProfileApi, UserProfileI } from '../api';

const UserProfile = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [tempImgUrl, setTempImgUrl] = useState<string | null>(null);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [originalImage, setOriginalImage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userData, setUserData] = useState<UserProfileI>({
        username: '',
        email: '',
        password: '',
        imgUrl: ''
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const username = user.username;
        console.log('username is', username);
        fetchUserData(username);
    }, []);

    const fetchUserData = async (username: string) => {
        try {
            setIsLoading(true);
            const data = await userProfileApi.getByUsername(username);
            data.password = JSON.parse(localStorage.getItem("user") || "{}").password;
            setUserData(data);
            setOriginalImage(data.imgUrl);
            console.log('User data is', data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateEmail = async (newEmail: string) => {
        try {
            setIsLoading(true);
            await userProfileApi.updateEmail(userData.username, newEmail);
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
            
            const formData = new FormData();
            formData.append('username', username);
            formData.append('id', userId);
            formData.append('file', selectedFile);
            formData.append('imgUrl', selectedFile.name);
            
            await userProfileApi.updateProfileImage(formData);
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="relative">
                                    {isImageLoading ? (
                                        <div className="h-24 w-24 rounded-full bg-white/30 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleImageClick}
                                            className="relative h-24 w-24 rounded-full focus:outline-none"
                                        >
                                            {(isEditingImage ? tempImgUrl : userData.imgUrl) ? (
                                                <>
                                                    <img 
                                                        src={isEditingImage ? tempImgUrl || '' : userData.imgUrl} 
                                                        alt="Profile" 
                                                        className="h-24 w-24 rounded-full object-cover border-2 border-white"
                                                    />
                                                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                                        <Camera className="h-8 w-8 text-white opacity-0 hover:opacity-100" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="h-24 w-24 rounded-full bg-white/30 flex items-center justify-center text-white text-4xl font-bold">
                                                        {userData.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                                        <Camera className="h-8 w-8 text-white opacity-0 hover:opacity-100" />
                                                    </div>
                                                </>
                                            )}
                                        </button>
                                    )}
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleImageSelect} 
                                    />
                                </div>
                                <div className="ml-6">
                                    {isEditingName ? (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={userData.username}
                                                onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
                                                className="text-2xl font-bold text-white bg-transparent border-b border-white focus:outline-none"
                                            />
                                            <button 
                                                onClick={() => setIsEditingName(false)}
                                                className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <h1 className="text-2xl font-bold text-white">{userData.username}</h1>
                                            <button 
                                                onClick={() => setIsEditingName(true)}
                                                className="px-2 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-blue-100 mt-1">Account Settings</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Edit Controls */}
                    {isEditingImage && (
                        <div className="px-8 py-4 bg-gray-50 border-b">
                            <div className="flex justify-center gap-4">
                                <button 
                                    onClick={handleSaveImage}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Save New Image
                                </button>
                                <button 
                                    onClick={handleRevertImage}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                >
                                    Revert to Original
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsEditingImage(false);
                                        setTempImgUrl(null);
                                        setSelectedFile(null);
                                    }} 
                                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Rest of the component remains the same */}
                    {/* Content Section */}
                    <div className="px-8 py-6">
                        {/* Username Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <div className="flex items-center">
                                <User className="h-5 w-5 text-gray-400" />
                                <h2 className="ml-3 text-lg font-medium text-gray-900">Username</h2>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-gray-600">{userData.username}</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                    Cannot be changed
                                </span>
                            </div>
                        </div>

                        {/* Email Section */}
                        <div className="py-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <h2 className="ml-3 text-lg font-medium text-gray-900">Email Address</h2>
                            </div>
                            {isEditing ? (
                                <div className="mt-3">
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                                            className="flex-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter new email"
                                        />
                                        <button
                                            onClick={() => handleUpdateEmail(userData.email)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            disabled={isLoading}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-gray-600">{userData.email}</p>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Password Section */}
                        <div className="py-6">
                            <div className="flex items-center">
                                <Lock className="h-5 w-5 text-gray-400" />
                                <h2 className="ml-3 text-lg font-medium text-gray-900">Password</h2>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-gray-600">{showPassword ? userData.password : '••••••••'}</p>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {showPassword ? (
                                        <><EyeOff className="h-4 w-4 mr-2" /> Hide</>
                                    ) : (
                                        <><Eye className="h-4 w-4 mr-2" /> Show</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;