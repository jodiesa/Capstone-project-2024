import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/Signin';
import Logout from './pages/Logout';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
//import Userprofile from './pages/Userprofile';
import Header from './components/Header'; // Ensure this path is correct

export default function App() {
  return (
    <BrowserRouter> 
    <Header />
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>

        <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
