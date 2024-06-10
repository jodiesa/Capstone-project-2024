import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Logout from './pages/Logout';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
//import Userprofile from './pages/Userprofile';

export default function App() {
  return (
    <BrowserRouter> 
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        
      </Routes>
    </BrowserRouter>
  );
}
