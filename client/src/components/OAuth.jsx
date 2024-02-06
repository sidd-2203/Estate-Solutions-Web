import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const results = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: results.user.displayName, email: results.user.email, photo: results.user.photoURL }),
            });
            const data = await res.json();
            //console.log(data);
            dispatch(signInSuccess(data));
            navigate('/');
        }
        catch (err) {
            console.log("Could not Sign in with google ", err.message);
        }
    }

    return (
        <button type="button"
            onClick={handleGoogleClick}
            className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Continue with google</button>
    )
}
