import {useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import http from '../lib/http';
import Toast from 'react-bootstrap/Toast';



const Signup = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false)


    const onSubmit = ({name, email, password, password_confirmation}) => {
        const payload = {
            name,
            email,
            password,
            password_confirmation
        };
        http.post('/api/auth/signup', { data: payload })
        .then(res => {
            localStorage.setItem("token", res.data.token)
            console.log("token in storage:",localStorage.getItem("token") )
            navigate("/")
            setShow3(true)
        }
        ).catch(err =>{
            console.log("error occurred login", err)
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
        <Container className="my-5" style={{ maxWidth: '800px' }}>
            <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body>Error when registering user.</Toast.Body>
            </Toast>
            <Toast onClose={() => setShow2(false)} show={show2} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Already Logged In</strong>
                </Toast.Header>
                <Toast.Body>You are already logged in!</Toast.Body>
            </Toast>
            <h1>Create an Account</h1>
            <Form onSubmit={handleSubmit(onSubmit)} className="my-5">
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" {...register('name')} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" placeholder="Enter email address" {...register('email')} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Create a password" {...register('password')} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Retype your password" {...register('password_confirmation')} />
                </Form.Group>
                <Button variant="primary" type="submit">Register</Button>
            </Form>
            <div>
            <Toast onClose={() => setShow3(false)} show={show3} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>You are now registered!</Toast.Body>
            </Toast> 
            </div>
            <Link to="/" style={{ textDecoration: 'none' }}>&#8592; Back to Home</Link>
        </Container>
    );
};
    
    export default Signup;