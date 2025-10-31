import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Dashboard/Dashboard'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/register' element={ <Register />}/>
        <Route path='/login' element={ <Login />}/>
        <Route path='/' element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App