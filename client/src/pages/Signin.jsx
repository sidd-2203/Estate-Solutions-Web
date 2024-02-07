import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

export default function Signin() {
    const [formData, setformData] = useState({});
    const { loading, error } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleChange = (e) => {
        setformData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        // to prevent refresh the page after submitting the value
        e.preventDefault();
        try {
            dispatch(signInStart());
            const res = await (fetch('/api/auth/signin',
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                }));
            const data = await res.json();
            if (data.success == false) {
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            //console.log(data);
            navigate('/');
        } catch (err) {
            dispatch(signInFailure(err.message));
        }
    }
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
                <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >{loading ? "Loading...." : "Sign In"}</button>
                <OAuth></OAuth>
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Dont have an account? </p>
                <Link to='/signup'>
                    <span className='text-blue-500'>Signup</span>
                </Link>
            </div>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    )

}
