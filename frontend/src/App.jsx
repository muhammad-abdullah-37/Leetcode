
import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './authSlice';

function App() {

  // Checking whether the user is authenticated or not, if authenticated then redirect the user to home , otherwise redirect the user to the Login or signup page
  const {isAuthenticated} = useSelector((state) => state.auth); // auth is the slice name
  const dispatch = useDispatch();
  useEffect( () => {
    dispatch(checkAuth())
  },[dispatch]);

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
    </>
  )
}

export default App
