import React from 'react'

export default function Signin() {
    return (
        <div>

            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
            <form className='flex flex-col gap-4'>
                <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' />
                <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' />
            </form>
        </div>
    )
}
