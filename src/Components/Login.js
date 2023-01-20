import React, {useState, useEffect, useMemo} from 'react';
import {Form, Container, Button, Alert} from 'react-bootstrap';
import styled from 'styled-components';
import {post} from '../Api/loginApi';
import Calc from './Calculator';
import {localLogin} from '../Api/routes';

const StyledContainer = styled(Container)`
  height: 300px;
  width: auto;
  background-color: #5793be;
  padding: 15px;
  margin: 2%;
  border: groove #a9cebd 3px;
`;

const Credential = styled(Form.Label)`
  color: ghostwhite;
`;

const Register = styled(Button)`
  border: outset;
  color: ghostwhite;
`;

const SignIn = styled(Button)`
  border: outset;
  color: ghostwhite;
`;

function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [submitType, setType] = useState('');

  useEffect(() => {
  }, [password, username]);

  useMemo(() => {
  }, [status]);

  useMemo(() => {
  }, [submitType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        username: username,
        password: password,
        loginType: submitType
      };

      console.log('submit type', submitType)

      const response = await post(localLogin, data);
      console.log("returned status", response?.status);

      if (response) {
        switch (response?.status) {
          case 200:
            setStatus("Success");
            break;
          case 400:
            setStatus('Bad request - User name and password must be set');
            break;
          case 409:
            setStatus('User already exists, please login');
            break;
          case 500:
            setStatus("Server error");
            break;
        }
      }
    } catch (err) {
      console.dir(err);
      alert(err);
    }
  };

  function setSubmitType(submitType) {
    setType(submitType);
  };

  return (
    <StyledContainer>
      <Form method='post' onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Credential>Email address</Credential>
          <Form.Control type='userName' placeholder='Enter email' onChange={event => {
            setUserName(event.target.value);
          }}/>
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Credential>Password</Credential>
          <Form.Control type='password' placeholder='Password' onChange={event => {
            setPassword(event.target.value);
          }}/>
        </Form.Group>
        <Form.Group>
          <div style={{'paddingBottom': '30px'}}>
            <SignIn variant='primary' type='submit' onClick={() => setSubmitType('login')}> Login </SignIn>
            <Register variant='primary' type='submit' onClick={() => setSubmitType('register')}> Register </Register>
          </div>
        </Form.Group>
      </Form>
      {status && (
        <Alert title={status}/>
      )}
    </StyledContainer>
  );
}

export default Login
