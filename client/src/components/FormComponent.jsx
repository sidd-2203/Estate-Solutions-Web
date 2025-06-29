import React,{ useState } from 'react'
import UploadImageComponent from '../components/UploadImageComponent.jsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
export default function FormComponent({ formData, setFormData, params }) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const handleUpdate = async () => {
        try {
            if (formData.imageUrls.length < 1) return setError('You must upload atleast one image!!');
            // + sign to convert to number
            if (+formData.regularPrice < +formData.discountPrice) return setError("Discount Price must be less than regular price");
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
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
            if (!data.success ) {
                setError(data.message);
            }
            navigate(`/listing/${params.listingId}`);

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
    const handleCreate = async () => {
        try {
            if (formData.imageUrls.length < 1) return setError('You must upload atleast one image!!');
            // + sign to convert to number
            if (+formData.regularPrice < +formData.discountPrice) return setError("Discount Price must be less than regular price");
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/create`, {
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
            if (!data.success) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (params) {
            // this is update
            handleUpdate();
        }
        else {
            // this is create
            handleCreate();
        }


    }

    const handleInput = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        else if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
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
    return (
        <main className='p-4 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'> Update a Listing</h1>
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
                                {formData.type === 'rent' &&
                                    <span className='text-xs'> Rs/month</span>
                                }</div>
                        </div>
                        {
                            formData.offer && <div className='flex items-center gap-2'>
                                <input type='number' id='discountPrice' required onChange={handleInput} value={formData.discountPrice} className='p-3 border-gray-300 rounded-lg'></input>
                                <div className='flex flex-col items-center '>
                                    <p>Discounted Price</p>
                                    {
                                        formData.type === 'rent' &&
                                        <span className='text-xs'> Rs/month</span>
                                    }</div>
                            </div>

                        }

                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <UploadImageComponent formData={formData} setFormData={setFormData} setUploading={setUploading} uploading={uploading} />
                    <button onClick={handleFormSubmit} disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {loading ? 'Updating....' : 'Update Listing'}</button>
                    {error && <p className='text-red-700'>{error}</p>}
                </div>
            </form>
        </main>
    )
}
