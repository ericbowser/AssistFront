import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { Alert, Container } from 'react-bootstrap'
import Login from './Components/Login'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/calcAccount',
    element: <div>TODO -- Calc account after logged in</div>
  },
  {
    path: '/',
    element: (
      <Container fluid>
        <Alert variant={'info'}>
          <h3>
            This is a simple calculator app that performs basic math, and a
            Random function API call to ...
            <div>
              <ul>
                <br />
                <li>To login, type /login into the browser</li>
              </ul>
            </div>
          </h3>
        </Alert>
      </Container>
    )
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.Fragment>
    <RouterProvider router={router}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </RouterProvider>
  </React.Fragment>
)

export default root
