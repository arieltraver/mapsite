import { useEffect, useState} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import http from '../lib/http';
import NavBar from './NavBar';

const EditPath = () => {
  const { id: pathId } = useParams();
  const [user, setUser] = useState(null)

  useEffect(() => {
    const headerz = {
    "x-access-token": localStorage.getItem("token")
    }
    http.get('/api/auth/getName', {
    headers: headerz
    })
    .then(res => res.data.isLoggedIn ? setUser("name") : null) 
  }, []);


  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    async function fetchData() {
      const { data } = await http.get(`/api/paths/${pathId}`);
      const ipas = data.data.path.ips.map(
        (ipa) => " "+ipa.ip
      )
      // by calling "reset", we fill the form fields with the data from the database
      reset(
        {
          ips: ipas,
          notes: data.data.path.notes
        }
        );
    }
    fetchData();
  }, [pathId, reset]);

  
  const onSubmit = async ({ ips, notes,}) => {
    const payload = {
      ips: ips.split(',').map((ip) => ip.trim()),
      notes: notes
    };
    //we need to be careful about protecting tokens (encryption?)
    await http.put(`/api/paths/${pathId}`, {
      data: payload, headers: {"x-access-token": localStorage.getItem("token")}
    });
    navigate(`/paths/${pathId}`);
  };
  
  return (
    <>
    <NavBar/>
    { user ?
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <h1>Edit Route</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="my-5">
        <Form.Group className="mb-3">
          <Form.Label>IPs</Form.Label>
          <Form.Control type="text" placeholder="Enter IPs" {...register('ips')} />
          <Form.Text className="text-muted">
            Enter them separately them with ","
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Notes</Form.Label>
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

export default EditPath;