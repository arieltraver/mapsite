
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';

import Home from './pages/home'
import Post from './pages/post';
import Create from './pages/create';
import Edit from './pages/edit';
import Signin from './pages/signin'

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';



function App() {
  return (
    <>
    
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="/">Map Site</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="me-auto">
            <Nav.Link href="/posts/new">New</Nav.Link>
            <Nav.Link href="/signin">Sign In</Nav.Link>
          </Nav>
        </Container>
        </Navbar>

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/posts/:id" element={<Post />}/>
        <Route path="/posts/new" element={<Create />}/>
        <Route path="/posts/:id/edit" element={<Edit />}/>
        <Route path="/signin" element={<Signin />}/>
      </Routes>

    </>
  );
}

export default App;
