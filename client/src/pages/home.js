import { useEffect, useState } from 'react';
// Link component allow users to navigate to the blog post component page
import { Link } from 'react-router-dom';
import {BsArrowRight} from 'react-icons/bs';
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
  const [paths, setPaths] = useState([]);


  useEffect(() => {
    // Call the server to fetch the posts and store them into the state
    async function fetchData() {
      const { data } = await http.get('/api/posts');
      setPosts(data.data.posts);
    }
    async function fetchPaths() {
      const { data } = await http.get('/api/paths');
      setPaths(data.data.paths);
      console.log("paths is", data.data.paths)
    }
    
    fetchData();
    fetchPaths();
  }, []);

  function drawdot(x, y, ip, color) {
    return (
      <OverlayTrigger
        key="test"
        placement="right"
        delay={{ show: 50, hide: 50 }}
        overlay={<Tooltip id={ip}>{ip}</Tooltip>}
      >
        <Marker coordinates={[x, y]}>
          <circle r={8} fill={color} />
        </Marker>
      </OverlayTrigger>
    )
  }
  

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
          paths.map((path) => {
            return (
              <>
              {path.ips?.map((ipa) =>
                <>
                {drawdot(ipa.lat, ipa.lon, ipa.ip, "#002aff")}
                </>
              )}
              </>
              )
          })
        }

        {
          posts.map((post) => {
            // Map the posts to JSX
            return (
              <>
              { post.lat ?
                drawdot(post.lat, post.lon, post.ip, "#F53") 
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
          paths.map((path) => {
            // Map the posts to JSX
            return (
              <ListGroup.Item key={path._id}> 
                <div className="fw-bold h3">
                  <Link to={`/paths/${path._id}`} style={{ textDecoration: 'none' }}>{path.ips?.map((path) => <span>{path.ip} <BsArrowRight/> </span>)}</Link>
                </div>
                <div>{path.notes} - <span className="text-secondary">{formatDate(path.createdAt)}</span></div>
              </ListGroup.Item>
            );
          })
        }

        </ListGroup>
        <ListGroup variant="flush" as="ol">
          {
            posts.map((post) => {
              // Map the posts to JSX
              return (
                <ListGroup.Item key={post._id}> 
                  <div className="fw-bold h3">
                    <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none' }}>{post.ip}</Link>
                  </div>
                  <div>{post.notes} - <span className="text-secondary">{formatDate(post.createdAt)}</span></div>
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