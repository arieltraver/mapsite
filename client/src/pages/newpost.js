import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import http from '../lib/http';


const NewPost = () => {

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ip, notes}) => {
    const payload = {
      ip,
      notes,
    };
    const headerz = {
      "x-access-token": localStorage.getItem("token")
    }
    await http.post('/api/posts', {
      headers: headerz,
      data: payload,
    });
    navigate('/');
  };
  
  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <h1>Submit new IP</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="my-5">
        <Form.Group className="mb-3">
          <Form.Label>IP</Form.Label>
          <Form.Control type="text" placeholder="Enter IP" {...register('ip')} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Notes</Form.Label>
          <Form.Control type="text" placeholder="Enter notes" {...register('notes')} />
        </Form.Group>
        <Button variant="primary" type="submit">Publish</Button>
      </Form>
      <Link to="/" style={{ textDecoration: 'none' }}>&#8592; Back to Home</Link>
    </Container>
  );
};

export default NewPost;