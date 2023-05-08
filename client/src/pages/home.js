import { useEffect, useState } from 'react';
// Link component allow users to navigate to the blog post component page
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import http from '../lib/http';
import NavBar from './NavBar';
import formatDate from '../lib/formatDate';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { ComposableMap, Geographies, Geography, Annotation, Marker } from "react-simple-maps"
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const Home = () => {
  // useState allows us to make use of the component state to store the posts
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);




  useEffect(() => {
    // Call the server to fetch the posts and store them into the state
    async function fetchData() {
      const { data } = await http.get('/api/posts');
      setPosts(data.data.posts);
    }
    
    fetchData();
  }, []);

  
  return (
    <>
     <NavBar/>
      <Container className="my-5" style={{ maxWidth: '800px' }}>
        <Image
          src="../maplogo.svg"
          width="300"
          className="d-block mx-auto img-fluid"
          style={{marginBottom:-70}}
        />
        <h2 className="text-center">Welcome to IP Mapper</h2>

        <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} />
          ))
          }
        </Geographies>

        {
          posts.map((post) => {
            // Map the posts to JSX
            return (
              <>
              { post.lat ?
                <>
                <OverlayTrigger
                  key="test"
                  placement="right"
                  delay={{ show: 50, hide: 50 }}
                  overlay={<Tooltip id={post.ip}>{post.ip}</Tooltip>}
                >
                  <Marker coordinates={[post.lat, post.lon]}>
                    <circle r={8} fill="#F53" />
                  </Marker>
                </OverlayTrigger>
                </>
              :
                <></>
              }
              </>
            )
          })
        }

      </ComposableMap>
      </Container>

      <Container style={{ maxWidth: '800px' }}>
        <ListGroup variant="flush" as="ol">
          {
            posts.map((post) => {
              // Map the posts to JSX
              return (
                <ListGroup.Item key={post._id}> 
                  <div className="fw-bold h3">
                    <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none' }}>{post.ip}</Link>
                  </div>
                  <div>{post.author} - <span className="text-secondary">{formatDate(post.createdAt)}</span></div>
                </ListGroup.Item>
              );
            })
          }
        </ListGroup>
      </Container>
    </>
  );
};

export default Home;