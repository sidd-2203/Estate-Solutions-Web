import React, { useState } from 'react'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase.js'

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    })
    const [imageUplaodError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    console.log(formData);
    const handleImageSubmit = (e) => {
        console.log(files);
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
                    console.log(progress);
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
        <main className='p-4 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'> Create Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1 '>
                    <input type='text' placeholder='Name' className='border p-3 rounded-lg' id="name" maxLength='62' minLength='10' required></input>
                    <input type='text' placeholder='Description' className='border p-3 rounded-lg h-24' id="description" required></input>
                    <input type='text' placeholder='Address' className='border p-3 rounded-lg' id="address" required></input>
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5'></input>
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5'></input>
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5'></input>
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5'></input>
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5'></input>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border-gray-300 rounded-lg'></input>
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bathrooms' min='1' max='5' required className='p-3 border-gray-300 rounded-lg'></input>
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='regularPrice' required className='p-3 border-gray-300 rounded-lg'></input>
                            <div className='flex flex-col items-center '>
                                <p>Regular price</p>
                                <span className='text-xs'> Rs/month</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='discountedPrice' required className='p-3 border-gray-300 rounded-lg'></input>
                            <div className='flex flex-col items-center '>
                                <p>Discounted Price</p>
                                <span className='text-xs'> Rs/month</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
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
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>

                </div>
            </form>
        </main>
    )
}
