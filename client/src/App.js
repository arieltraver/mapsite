
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';

import Home from './pages/home'
import Post from './pages/post';
import Create from './pages/create';
import Edit from './pages/edit';
import Signin from './pages/signin';
import Signup from './pages/signup';
import NavBar from './NavBar';


function App() {

  return (
    <>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/posts/:id" element={<Post />}/>
      <Route path="/posts/new" element={<Create />}/>
      <Route path="/posts/:id/edit" element={<Edit />}/>
      <Route path="/signin" element={<Signin />}/>
      <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  );
}

export default App;
