import {useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import http from '../lib/http';
import Toast from 'react-bootstrap/Toast';
import NavBar from './NavBar';



const Signin = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);


    const onSubmit = ({email, password}) => {
        const payload = {
          email,
          password
        };
        http.post('/api/auth/signin', { data: payload })
        .then(res => {
            localStorage.setItem("token", res.data.token)
            console.log("token in storage:",localStorage.getItem("token"))
            navigate("/")
        }
        ).catch(err =>{
            console.log("login failed", err)
            setShow(true)
        });
    };
    //checks if you're logged in and navigates home if so
    useEffect(() => {
        const headerz = {
            "x-access-token": localStorage.getItem("token")
        }
        http.get('/api/auth/getName', {
            headers: headerz
        })
        .then(res => res.data.isLoggedIn ? setShow2(true) : null)
    }, [])
    return (
        <>
        <NavBar/>
        <Container className="my-5" style={{ maxWidth: '800px' }}>
            <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body>Failed to log in.</Toast.Body>
            </Toast>
            <Toast onClose={() => setShow2(false)} show={show2} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Already Logged In</strong>
                </Toast.Header>
                <Toast.Body>You are already logged in!</Toast.Body>
            </Toast>
            <h1>Sign In</h1>
            <Form onSubmit={handleSubmit(onSubmit)} className="my-5">
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" placeholder="Enter email address" {...register('email')} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" placeholder="Enter password" {...register('password')} />
                </Form.Group>
                <Button variant="primary" type="submit">Sign In</Button>
            </Form>
            <Link to="/" style={{ textDecoration: 'none' }}>&#8592; Back to Home</Link>
        </Container>
        </>
    );
};
    
    export default Signin;