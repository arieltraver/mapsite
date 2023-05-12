import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import http from '../lib/http';
import formatDate from '../lib/formatDate';
import NavBar from './NavBar';

const Post = () => {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const headerz = {
    "x-access-token": localStorage.getItem("token")
    }
    http.get('/api/auth/getName', {
    headers: headerz
    })
    .then(res => res.data.isLoggedIn ? setUser(res.data.user) : null) 
  }, []);



  const { id: postId } = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  // Fetch the single blog post
  useEffect(() => {
    async function fetchData() {
      const { data } = await http.get(`/api/posts/${postId}`);
      setPost(data.data.post);
    }
    fetchData();
  }, [postId]);
  // Delete the post and redirect the user to the homepage
  const deletePost = async () => {
    const headerz = {
      "x-access-token": localStorage.getItem("token"),
    }
    await http.delete(`/api/posts/${postId}`,
    {headers: headerz});
    navigate('/');
  }
  
  
  return (
    <>
      <NavBar/>
      <Container className="my-5 text-justified" style={{ maxWidth: '800px' }}>
        <h1>{post.ip}</h1>
        <div className="text-secondary mb-4">{formatDate(post.createdAt)}</div>
        <div className="text-secondary mb-5">- {post.notes}</div>
        {user && user.userID === post.userID ?
          <div className="mb-5">
            <Link
              variant="primary"
              className=" btn btn-primary m-2"
              to={`/posts/${postId}/edit`}
            >
              Edit
            </Link>
            <Button variant="danger" onClick={deletePost}>Delete</Button>
          </div>
        :
          <></>
        }
        <Link to="/" style={{ textDecoration: 'none' }}>&#8592; Back to Home</Link>
      </Container>
    </>
  );
};

export default Post;