import {useState, useEffect} from 'react';
import http from '../lib/http'
import NavBar from './NavBar';
import NewPath from './newpath';
import NewPost from './newpost'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const New = () => {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const headerz = {
    "x-access-token": localStorage.getItem("token")
    }
    http.get('/api/auth/getName', {
    headers: headerz
    })
    .then(res => res.data.isLoggedIn ? setUser(res.data.user.name) : null) 
  }, []);
  
  
  return (
    <>
    <NavBar/>
    { user ?
      <Tabs
      defaultActiveKey="post"
      id="postroute"
      className="mb-3"
      >
        <Tab eventKey="post" title="Single IP">
          <NewPost />
        </Tab>
        <Tab eventKey="path" title="Route">
          <NewPath />
        </Tab>
      </Tabs>
    : 
    <>Please reload and log in again.</>
    }
    </>
  );
};

export default New;