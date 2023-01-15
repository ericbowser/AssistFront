import React, {useState, useEffect} from 'react';
import {Form, Container, Button} from 'react-bootstrap';
import styled from 'styled-components';
import {post} from '../Api/loginApi';
import Calc from './Calculator';
import {localLogin} from '../Api/routes';

const StyledContainer = styled(Container)`
    background-color: red;
    margin-top: 2%;
    padding: 2%;
`;

function Login () {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
  }, [password, username]);
  
  async function handleSubmit() {
    try {
      const data = {
          username: username,
          password: password
      };
      const x = await post(localLogin, data);
      console.log("after request in Handle submit click action", x);
      if (x.status === 409) {
          console.log("It's a duplicate user, ask them to login");
          alert("please login. You are already registered");
      } else if (x.status === 400) {
          alert("Bad request. Must have a username and password that hasn't been registered")
      } else if (x.status === 500) {
          console.log("server error status returned")
      }
    } catch (err) {
      console.dir(err);
      alert(err);
      // handle your error state here
    }
  }
  
  return (
      <StyledContainer>
          <Calc/>
          <Form onSubmit={handleSubmit} >
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label style={{'color': 'white'}}>Email address</Form.Label>
                  <Form.Control type='userName' placeholder='Enter email' onChange={event => {
                      setUserName(event.target.value);
                  }}/>
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label style={{'color': 'white'}}>Password</Form.Label>
                  <Form.Control type='password' placeholder='Password' onChange={event => {
                      setPassword(event.target.value);
                  }}/>
              </Form.Group>
              <Form.Group>
                  <div style={{'paddingBottom': '30px'}}>
                      <Button variant='primary' type='submit' style={{'float': 'right'}}>
                          Submit
                      </Button>

                  <Button variant='info'  >
                          Register
                      </Button>
                  </div>
              </Form.Group>
          </Form>
      </StyledContainer>
  );
}

export default Login
