import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import http from '../lib/http';
import formatDate from '../lib/formatDate';
import NavBar from './NavBar';
import {BsArrowRight} from 'react-icons/bs';

const Path = () => {

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



  const { id: pathId } = useParams();
  const [path, setPath] = useState({});
  const navigate = useNavigate();
  // Fetch the single path
  useEffect(() => {
    async function fetchData() {
      const { data } = await http.get(`/api/paths/${pathId}`);
      setPath(data.data.path);
    }
    fetchData();
  }, [pathId]);
  // Delete the path and redirect the user to the homepage
  const deletePath = async () => {
    await http.delete(`/api/paths/${pathId}`);
    navigate('/');
  }
  
  
  return (
    <>
      <NavBar/>
      <Container className="my-5 text-justified" style={{ maxWidth: '800px' }}>
        <h1>Route</h1>
        <div className="text-secondary mb-4">{formatDate(path.createdAt)}</div>
        <div className="text-secondary mb-4">{path.ips?.map((ip) => <span>{ip.ip} <BsArrowRight/> </span>)}</div>
        <div className="text-secondary mb-5">- {path.notes}</div>
        {user ?
          <div className="mb-5">
            <Link
              variant="primary"
              className=" btn btn-primary m-2"
              to={`/paths/${pathId}/edit`}
            >
              Edit
            </Link>
            <Button variant="danger" onClick={deletePath}>Delete</Button>
          </div>
        :
          <></>
        }
        <Link to="/" style={{ textDecoration: 'none' }}>&#8592; Back to Home</Link>
      </Container>
    </>
  );
};

export default Path;