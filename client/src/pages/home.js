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

//For mapping IP addresses
import { ComposableMap, Geographies, Geography, Annotation, Marker, ZoomableGroup } from "react-simple-maps"
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const red = '#F53';
const darkred = '#cc0000';
const blue = '#0066ff';
const circleSize = 6;

const Home = () => {
  // useState allows us to make use of the component state to store the posts
  const [posts, setPosts] = useState([]);
  const [paths, setPaths] = useState([]);

  //scrolling over custom links (red)
  function linkOver(e) {
    e.target.style.color = darkred;
  }

  function linkOff(e) {
    e.target.style.color = red;
  }



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

  //plot a point on the map
  function drawdot(x, y, ip, color) {
    return (
      <OverlayTrigger
        key="test"
        placement="right"
        delay={{ show: 50, hide: 50 }}
        overlay={<Tooltip id={ip}>{ip}</Tooltip>}
      >
        <Marker coordinates={[x, y]}>
          <circle r={circleSize} fill={color} />
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
        <h4 className="text-center">Click and drag to move | Scroll over to zoom in</h4>

        <ComposableMap>
        <ZoomableGroup center={[-90, 50]} zoom={3}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} />
              ))
            }
          </Geographies>
          {/* map takes an array, applies function, returns array. (paths is saved in state variable)*/}
        {
          paths.map((path) => {
            return (
              <>
              {path.ips?.map((ipa) =>
                <>
                {drawdot(ipa.lon, ipa.lat, ipa.ip, blue)}
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
                drawdot(post.lon, post.lat, post.ip, red) 
              :
                <></>
              }
              </>
            )
          })
        }
      </ZoomableGroup>
      </ComposableMap>
      </Container>

      <Container style={{ maxWidth: '800px' }}>
        <ListGroup variant="flush" as="ol">
        {
          paths.map((path) => {
            // Map the posts to JSX
            return (
              <ListGroup.Item key={path._id}>
                <Link to={`/paths/${path._id}`} style={{ textDecoration: 'none'}}> 
                  <div className="fw-bold h3">
                    {path.ips?.map((path) => <span>{path.ip} <BsArrowRight/> </span>)}
                  </div>
                  <div style={{color:'black'}}>- {path.notes}<span className="text-secondary">{'  '}{formatDate(path.createdAt)}</span></div>
                </Link>
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
                  <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', color:red}}>
                    <div className="fw-bold h3" onMouseOver={linkOver} onMouseLeave={linkOff}>
                      {post.ip}
                    </div>
                  </Link>
                  <div>- {post.notes} <span className="text-secondary">{'  '}{formatDate(post.createdAt)}</span></div>
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