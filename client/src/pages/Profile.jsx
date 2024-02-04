import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useRef } from 'react';
import { updateUserSuccess, updateFailure, updateUserStart, deleteFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signInFailure, signInSuccess, signOutFailure, signOutUserSuccess } from '../redux/user/userSlice';

export default function Profile() {
    const { currentUser, loading, error } = useSelector(state => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);
    function handleFileUpload(file) {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePercentage(Math.round(progress));
                //console.log('Uploading is', progress + "% done");
            },
            (error) => {
                setFileUploadError(true);

            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadUrl) => {
                        setFormData({ ...formData, avatar: downloadUrl });
                    }
                )
            });
    }
    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success == false) {
                dispatch(updateFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateFailure(error.message));
        }
    }
    const handleDelete = async (e) => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success == false) {
                dispatch(deleteFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));

        } catch (error) {
            dispatch(deleteFailure(error.message));
        }
    }
    const handleSignOut = async (e) => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch(`/api/auth/signout`);
            const data = await res.json();
            if (data.success == false) {
                dispatch(signOutFailure(data.message));
                return;
            }
            dispatch(signOutUserSuccess(data));

        } catch (error) {
            dispatch(signOutFailure(error.message));
        }
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type='file' onChange={(e) => { setFile(e.target.files[0]) }} ref={fileRef} hidden accept='image/*' />
                <img src={formData.avatar || currentUser.avatar} alt='profile' onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' ></img>
                <p className='text-sm self-center'>{fileUploadError
                    ? (<span className='text-red-700'>Error Image Upload (Image must be less than 2MB)</span>)
                    : (filePercentage > 0 && filePercentage < 100)
                        ? (<span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>)
                        : (filePercentage === 100)
                            ? (<span className='text-green-700'>Image Successfully Uploaded</span>) : ('')}
                </p>
                <input type='text' onChange={handleInputChange} placeholder='username' defaultValue={currentUser.username} className='border p-3 rounded-lg' id='username' />
                <input type='email' onChange={handleInputChange} placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' id='email' />
                <input type='password' onChange={handleInputChange} placeholder='password' className='border p-3 rounded-lg' id='password' />
                <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80' disabled={loading} >{loading ? "Loading..." : "Update"}</button>
                <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to='/createListing'>
                    Create Listing
                </Link>
            </form>

            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer' onClick={handleDelete}>Delete Account</span>
                <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
            </div>
            <p className='text-red-700 mt-5'>
                {error ? error : ''}
            </p>
            <p className='text-green-700 mt-5'>
                {updateSuccess ? 'User updated Successfully' : ''}
            </p>
        </div>
    )
}
