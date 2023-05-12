import { useEffect, useState} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import http from '../lib/http';
import NavBar from './NavBar';

const Edit = () => {
  const { id: postId } = useParams();
  const [user, setUser] = useState(null)



  useEffect(() => {
    const headerz = {
    "x-access-token": localStorage.getItem("token")
    }
    http.get('/api/auth/getName', {
    headers: headerz
    })
    .then(res => res.data.isLoggedIn ? setUser("user") : null) 
}, []);


  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  // we call the API to fetch the blog post current data
  useEffect(() => {
    async function fetchData() {
      const { data } = await http.get(`/api/posts/${postId}`);
      // by calling "reset", we fill the form fields with the data from the database
      reset(data.data.post);
    }
    fetchData();
  }, [postId, reset]);

  
  const onSubmit = async ({ ip, notes,}) => {
    const payload = {
      ip,
      notes
    };
    //we need to be careful about protecting tokens (encryption?)
    await http.put(`/api/posts/${postId}`, {
      data: payload, headers: {"x-access-token": localStorage.getItem("token")}
    });
    navigate(`/posts/${postId}`);
  };
  
  return (
    <>
    <NavBar/>
    { user ?
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <h1>Edit IP</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="my-5">
        <Form.Group className="mb-3">
          <Form.Label>IP</Form.Label>
          <Form.Control type="text" placeholder="Enter ip" {...register('ip')} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>notes</Form.Label>
          <Form.Control type="text" placeholder="Enter notes" {...register('notes')} />
        </Form.Group>
        <Button variant="primary" type="submit">Save</Button>
      </Form>
      <Link to="/" style={{ textDecoration: 'none' }}>&#8592; Back to Home</Link>
    </Container>
    :
    <></>
    }
    </>
  );
};

export default Edit;