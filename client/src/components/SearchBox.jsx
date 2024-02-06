import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
    const [searchVal, setSearchVal] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchVal(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchVal);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    return (
        <>
            <form onClick={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'  >
                <input type='text' placeholder='Search...'
                    onChange={(e) => setSearchVal(e.target.value)}
                    value={searchVal}
                    className='bg-transparent focus:outline-none w-24 sm:w-64' />
                <button>
                    <FaSearch className='text-slate-600 ' />
                </button>
            </form>
        </>
    )
}
