import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom'
import ListingItems from '../components/ListingItems';
import serverUrl from '../serverUrl';
export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setsaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    SwiperCore.use([Navigation]);
    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch(serverUrl + '/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings();
            } catch (error) {
                console.log(error);
            }
        }
        const fetchRentListings = async () => {
            try {
                const res = await fetch(serverUrl + '/api/listing/get?type=rent&limit=4');
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings();

            } catch (error) {
                console.log(error);
            }
        }
        const fetchSaleListings = async () => {
            try {
                const res = await fetch(serverUrl + '/api/listing/get?type=sale&limit=4');
                const data = await res.json();
                setsaleListings(data);

            } catch (error) {
                console.log(error);
            }
        }
        fetchOfferListings();
    }, [])

    return (
        <div>
            {/* Top side */}
            <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto' >
                <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl  '>Find you next <span
                    className='text-slate-500 '>Perfect</span><br /> place with ease </h1>
                <div className='text-gray-400 text-xs sm:text-sm'>
                    Estate solutions is the best place to find your home fast easy and comfortable.
                    <br />
                    Our expert support are always available.
                </div>
                <Link
                    className='text-xs sm:text-sm text-blue-800 hover:underline'
                    to={'/search'}>
                    Let's get started..
                </Link>
            </div>
            {/* swiper */}
            <Swiper navigation>
                {
                    offerListings && offerListings.length > 0 &&
                    offerListings.map((listing) => {
                        return <SwiperSlide key={listing._id}>
                            <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }} className='h-[500px]' >

                            </div>
                        </SwiperSlide>
                    })
                }
            </Swiper>
            {/* list results for offer rent and sale*/}
            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                {
                    offerListings && offerListings.length > 0 &&
                    <div>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                            <Link to={'/search?offer=true'}
                                className='text-sm text-blue-800 hover:underline'>Show more offers</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {
                                offerListings.map((listing) => {
                                    return <ListingItems key={listing._id} listing={listing}></ListingItems>
                                })
                            }
                        </div>



                    </div>

                }
                {
                    rentListings && rentListings.length > 0 &&
                    <div>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                            <Link to={'/search?type=rent'}
                                className='text-sm text-blue-800 hover:underline'>Show more places for rent</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {
                                rentListings.map((listing) => {
                                    return <ListingItems key={listing._id} listing={listing}></ListingItems>
                                })
                            }
                        </div>
                    </div>

                }
                {
                    saleListings && saleListings.length > 0 &&
                    <div>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                            <Link to={'/search?type=sale'}
                                className='text-sm text-blue-800 hover:underline'>Show more places for sale</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {
                                saleListings.map((listing) => {
                                    return <ListingItems key={listing._id} listing={listing}></ListingItems>
                                })
                            }
                        </div>



                    </div>

                }
            </div>
        </div >
    )
}
