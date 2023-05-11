
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';

import Home from './pages/home'
import Post from './pages/post';
import Path from './pages/path'
import New from './pages/new';
import Edit from './pages/edit';
import Signin from './pages/signin';
import Signup from './pages/signup';


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/posts/:id" element={<Post />}/>
      <Route path="/paths/:id" element={<Path/>}/>
      <Route path="/new" element={<New />}/>
      <Route path="/posts/:id/edit" element={<Edit />}/>
      <Route path="/signin" element={<Signin />}/>
      <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  );
}

export default App;
