import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import AppRouter from './router/AppRouter'

const App = () => {
  return (
    <AppRouter />
  )
}

export default App