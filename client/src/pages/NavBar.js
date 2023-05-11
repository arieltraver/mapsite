
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom'
import http from '../lib/http'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

function checkUser() {
    http.get('/api/auth/getName', {
        headers: {"x-access-token": localStorage.getItem("token")}
    }).then(res => {return res.IsLoggedIn ? "loggedin" : "name"})
}

function NavBar() {
    const navigate = useNavigate();
    const usrName = checkUser()

    const [user, setUser] = useState(usrName)

    useEffect(() => {
        const headerz = {
        "x-access-token": localStorage.getItem("token")
        }
        http.get('/api/auth/getName', {
        headers: headerz
        })
        .then(res => res.data.isLoggedIn ? setUser("name") : null) 
    }, []);
    
    function logout() {
    localStorage.removeItem("token");
    setUser(null)
    navigate("/signin");
    }

    return (
        <>
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
            <Navbar.Brand href="/">Map Site</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {user ?
                <Nav className="me-auto"> 
                    <Nav.Link href="/new">New</Nav.Link>
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                </Nav>
                :
                <Nav className="me-auto">
                <Nav.Link href="/signin">Sign In</Nav.Link>
                <Nav.Link href="/signup">Register</Nav.Link>
                </Nav>
                }
            </Container>
        </Navbar>
        </>
  );
}

export default NavBar;