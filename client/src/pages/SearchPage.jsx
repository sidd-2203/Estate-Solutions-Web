import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItems from '../components/ListingItems';
import serverUrl from '../serverUrl';

export default function Search() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    const [showMore, setshowMore] = useState(false);
    const [sidebarData, setsidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc',
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        let searchTermFromUrl = urlParams.get('searchTerm');
        let typeFromUrl = urlParams.get('type');
        let parkingFromUrl = urlParams.get('parking');
        let furnishedFromUrl = urlParams.get('furnished');
        let offerFromUrl = urlParams.get('offer');
        let sortFromUrl = urlParams.get('sort');
        let orderFromUrl = urlParams.get('order');
        if (searchTermFromUrl || typeFromUrl || parkingFromUrl ||
            furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setsidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                furnished: furnishedFromUrl == 'true' ? true : false,
                offer: offerFromUrl == 'true' ? true : false,
                parking: parkingFromUrl == 'true' ? true : false,
                order: orderFromUrl || 'desc',
                sort: sortFromUrl || 'createdAt',
            })
        }
        const fetchListing = async () => {
            try {
                setLoading(true);
                setshowMore(false);
                const searchQuery = urlParams.toString();
                const res = await fetch(serverUrl + `/api/listing/get/?${searchQuery}`);
                const data = await res.json();
                setListing(data);
                if (data.length > 8) setshowMore(true);
                else setshowMore(false);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
        fetchListing();
    }, [location.search])
    const handleChange = (e) => {
        if (e.target.id == 'all' || e.target.id == 'rent' || e.target.id == 'sale') {
            setsidebarData({ ...sidebarData, type: e.target.id });
        }
        if (e.target.id === 'searchTerm') {
            setsidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setsidebarData({ ...sidebarData, [e.target.id]: (e.target.checked || e.target.checked == 'true') ? true : false })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';
            setsidebarData({ ...sidebarData, sort, order });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    const showMoreClick = async () => {
        const numberOfListing = listing.length;
        const startIndex = numberOfListing;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(serverUrl + `/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setshowMore(false);
        }
        // add new listings to the prev listings 
        // main pagination
        setListing([...listing, ...data]);
    }

    return (
        <div className='flex flex-col md:flex-row' >
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap'>Search Term:</label>
                        <input type='text'
                            id='searchTerm'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                            placeholder='Serch...'
                            className='border rounded-lg p-3 w-full'></input>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Type: </label>
                        <div className='flex gap-2'>
                            <input type='checkbox'
                                id='all'
                                checked={sidebarData.type === 'all'}
                                onChange={handleChange}
                                className='w-5' ></input>
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox'
                                id='rent'
                                checked={sidebarData.type === 'rent'}
                                onChange={handleChange}
                                className='w-5' ></input>
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox'
                                id='sale'
                                checked={sidebarData.type === 'sale'}
                                onChange={handleChange}
                                className='w-5' ></input>
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox'
                                id='offer'
                                checked={sidebarData.offer}
                                onChange={handleChange}
                                className='w-5' ></input>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities: </label>
                        <div className='flex gap-2'>
                            <input type='checkbox'
                                id='parking'
                                className='w-5'
                                checked={sidebarData.parking}
                                onChange={handleChange} ></input>
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox'
                                id='furnished'
                                className='w-5' ></input>
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <select onChange={handleChange}
                            defaultValue={'createdAt_desc'}
                            className='border rounded-lg p-3' id='sort_order' >
                            <option value={'regularPrice_desc'}>Price high to low</option>
                            <option value={'regularPrice_asc'}>Price low to high</option>
                            <option value={'createdAt_desc'}>Latest </option>
                            <option value={'createdAt_asc'} >Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700'>Listing results</h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {
                        !loading && listing.length === 0 &&
                        <p className='text-xl text-slate-700'>No listing found!</p>
                    }
                    {
                        loading &&
                        <p className='text-xl text-slate-700'>Loading....</p>
                    }
                    {
                        !loading && listing.length > 0 &&
                        listing.map((eachListing) => {
                            return <ListingItems key={eachListing._id} listing={eachListing}></ListingItems>
                        })
                    }
                    {showMore && <button className='text-green-700 hover:underline p-7 text-center w-full' onClick={showMoreClick}>Show More</button>}
                </div>
            </div>
        </div>
    )
}
