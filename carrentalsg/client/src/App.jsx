import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Logout from './pages/Logout';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing.jsx';
import UpdateListing from './pages/UpdateListing.jsx';
import PrivateRoute from './components/PrivateRoute';
import Listing from './pages/Listing.jsx';
import ReturnCar from './pages/ReturnCar.jsx'
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
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
        <Route path='/return-car' element={<ReturnCar />} />
        <Route path='/create-listing' element={<CreateListing />} />
        <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
