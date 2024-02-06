import React from 'react'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase.js';
import { useState } from 'react';
export default function UploadImageComponent({ formData, setFormData, setUploading, uploading }) {
    const [imageUplaodError, setImageUploadError] = useState(false);
    const [files, setFiles] = useState([]);

    const handleImageSubmit = (e) => {
        //console.log(files);
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];
            setImageUploadError(false);
            setUploading(true);
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, imageUrls: formData.imageUrls.concat(urls)
                });
                setUploading(false);
                setImageUploadError(false);
            }).catch((err) => {
                console.log(err);
                setUploading(false);
                setImageUploadError('Image Upload Failed (2MB max per Image)');
            });
        }
        else {
            setUploading(false);
            setImageUploadError('You can upload max 6 images per listing!!');
        }
    }
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, 'listing/' + fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log(progress);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl);
                    })
                }
            )
        })
    }
    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i != index),
        });
    };
    return (
        <>
            <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>The first image will be cover (max 6)</span>
            </p>
            <div className='flex gap-4'>
                <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple></input>
                <button type='button' onClick={handleImageSubmit} disabled={uploading} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? "Uploading...." : "Upload"}</button>
            </div>
            <p className='text-red-700'>{imageUplaodError ? imageUplaodError : ''}</p>
            {
                (formData.imageUrls.length > 0) ?
                    formData.imageUrls.map((url, index) => {
                        return <div className='flex justify-between p-3 border items-center'>
                            <img key={url} src={url} alt='listing image' className='w-20 h-20 object-cover rounded-lg '></img>
                            <button className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' type='button' onClick={() => handleRemoveImage(index)}>Delete</button>
                        </div>
                    }) : ''
            }
        </>
    )
}
