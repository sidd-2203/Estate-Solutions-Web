import React, { useState } from 'react'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    })
    const [imageUplaodError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    //console.log(formData);
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
    const handleInput = (e) => {
        if (e.target.id == 'sale' || e.target.id == 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        else if (e.target.id == 'parking' || e.target.id == 'furnished' || e.target.id == 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            })
        }
        else {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('You must upload atleast one image!!');
            // + sign to convert to number
            if (+formData.regularPrice < +formData.discountPrice) return setError("Discount Price must be less than regular price");
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success == false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }

    }

    return (
        <main className='p-4 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'> Create Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1 '>
                    <input type='text' onChange={handleInput} placeholder='Name' value={formData.name} className='border p-3 rounded-lg' id="name" maxLength='62' minLength='10' required></input>
                    <input type='text' onChange={handleInput} placeholder='Description' value={formData.description} className='border p-3 rounded-lg h-24' id="description" required></input>
                    <input type='text' placeholder='Address' onChange={handleInput} value={formData.address} className='border p-3 rounded-lg' id="address" required></input>
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' onChange={handleInput} checked={formData.type === 'sale'} className='w-5'></input>
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' onChange={handleInput} checked={formData.type === 'rent'} className='w-5'></input>
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' onChange={handleInput} checked={formData.parking} className='w-5'></input>
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' onChange={handleInput} checked={formData.furnished} className='w-5'></input>
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' onChange={handleInput} checked={formData.offer} className='w-5'></input>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bedrooms' min='1' max='10' onChange={handleInput} value={formData.bedrooms} required className='p-3 border-gray-300 rounded-lg'></input>
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bathrooms' min='1' max='5' onChange={handleInput} value={formData.bathrooms} required className='p-3 border-gray-300 rounded-lg'></input>
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='regularPrice' onChange={handleInput} value={formData.regularPrice} required className='p-3 border-gray-300 rounded-lg'></input>
                            <div className='flex flex-col items-center '>
                                <p>Regular price</p>
                                <span className='text-xs'> Rs/month</span>
                            </div>
                        </div>
                        {
                            formData.offer && <div className='flex items-center gap-2'>
                                <input type='number' id='discountPrice' required onChange={handleInput} value={formData.discountPrice} className='p-3 border-gray-300 rounded-lg'></input>
                                <div className='flex flex-col items-center '>
                                    <p>Discounted Price</p>
                                    <span className='text-xs'> Rs/month</span>
                                </div>
                            </div>

                        }

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
                    <button onClick={handleFormSubmit} disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {loading ? 'Creating....' : 'Create Listing'}</button>
                    {error && <p className='text-red-700'>{error}</p>}
                </div>
            </form>
        </main>
    )
}
