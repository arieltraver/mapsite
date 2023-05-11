import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import http from '../lib/http';

const NewPath = () => {

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ ips, notes}) => {
    const payload = {
      ips: ips.split(',').map((ip) => ip.trim()),
      notes,
    };
    const headerz = {
      "x-access-token": localStorage.getItem("token")
    }
    await http.post('/api/paths', {
      headers: headerz,
      data: payload,
    });
    navigate('/');
  };
  
  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <h1>Submit new route</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="my-5">
        <Form.Group className="mb-3">
          <Form.Label>IPs</Form.Label>
          <Form.Control type="text" placeholder="Enter ips" {...register('ips')} />
          <Form.Text className="text-muted">
            Enter them separately them with ","
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>notes</Form.Label>
          <Form.Control type="text" placeholder="Enter notes" {...register('notes')} />
        </Form.Group>
        <Button variant="primary" type="submit">Publish</Button>
      </Form>
      <Link to="/" style={{ textDecoration: 'none' }}>&#8592; Back to Home</Link>
    </Container>
  );
};

export default NewPath;