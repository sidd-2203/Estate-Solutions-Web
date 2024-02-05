import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle';


export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        try {
            const fetchListing = async () => {
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success == false) {
                    setLoading(false);
                    setError(data.message);
                    console(data.message);
                    return;
                }
                setLoading(false);
                setListing(data);
            }
            fetchListing();
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }

    }, []);
    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'></p>}
            {error && <p className='text-center my-7 text-2xl'>Something went wrong !!</p>}
            {
                listing && !loading && !error &&
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => {
                            return <SwiperSlide key={url}>
                                <div className='h-[500px]' style={{
                                    background: `url(${url}) center no-repeat`,
                                    backgroundSize: 'cover'
                                }} >

                                </div>
                            </SwiperSlide>
                        })}
                    </Swiper>
                </div>
            }
        </main>
    )
}
