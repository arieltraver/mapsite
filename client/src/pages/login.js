import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import http from '../lib/http';

const Signin = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const onSubmit = async ({email, password}) => {
        const payload = {
          email,
          password
        };
        await http.post('/api/auth/signin', { data: payload });
        navigate('/');
    };
    return (
        <Container className="my-5" style={{ maxWidth: '800px' }}>
          <h1>Sign In</h1>
          <Form onSubmit={handleSubmit(onSubmit)} className="my-5">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" placeholder="Enter email address" {...register('title')} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" placeholder="Enter password" {...register('author')} />
            </Form.Group>
            <Button variant="primary" type="submit">Sign In</Button>
          </Form>
          <Link to="/" style={{ textDecoration: 'none' }}>&#8592; Back to Home</Link>
        </Container>
      );
    };
    
    export default Signin;