import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignOut from './pages/SignOut'
import About from './pages/About'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/privateRoute'
import CreateListing from './pages/CreateListing'

export default function App() {
  return <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={< SignUp />} />
        <Route path='/sign-out' element={<SignOut />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='createListing' element={<CreateListing />} />
        </Route>


        <Route path='/about' element={<About />} />
      </Routes>
    </BrowserRouter>
  </>

}
