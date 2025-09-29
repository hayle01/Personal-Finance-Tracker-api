import { Route, Routes } from 'react-router'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { Dashboard } from './pages/dashboard/Dashboard'
import { Profile } from './pages/auth/Profile'
import { Home } from './pages/Home'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Layout } from './components/Layout'


function App() {
  return (
   <>
   <Routes>
    <Route element={<Layout />}>
    <Route path='/' element={<Home />}/>
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Route>
    <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
   </Routes>
   </>
  )
}

export default App
