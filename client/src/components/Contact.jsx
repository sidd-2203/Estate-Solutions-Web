import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function Contact({ listing }) {
    const { currentUser } = useSelector((state) => state.user);
    const [contact, setContact] = useState(false);
    const [LandLord, setLandLoard] = useState(null);
    const [message, setMessage] = useState('');
    useEffect(() => {
        async function fetchLanLord() {
            const res = await fetch(`/api/user/get/${listing.userRef}`);
            const data = await res.json();
            setLandLoard(data);
            //console.log(LandLord);
        }
        fetchLanLord();

    }, [contact])
    function handleContact() {
        setContact(true);
    }
    return <>
        {
            listing.userRef !== currentUser._id && !contact &&
            <button onClick={handleContact} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 mt-4 p-3'>Contact LandLord</button>
        }
        {
            contact &&
            <div className='flex flex-col gap-2'>
                <p >Contact <span className='font-semibold'>{LandLord.username}</span> for <span className='font-semibold' >{listing.name.toLowerCase()}</span></p>
                <textarea placeholder='Enter your message' className='w-full border p-3 rounded-lg' name='message' id='message' rows='2' onChange={(e) => setMessage(e.target.value)}></textarea>
                <Link to={`mailto:${LandLord.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95' >Send Mail</Link>
            </div>

        }
    </>
}
