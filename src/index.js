import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import Assist from './components/Assist';
import '../src/output.css';

const router = createBrowserRouter([
    {
        path: '/askAssist',
        element: (
          <div className={'container-sm'}>
              <Assist/>
          </div>
        )
    },
    /*
        {
            path: '/myLinks',
            element: (
                <MyLinks/>
            )
        },
    */
    /*
        {
            path: '/birdeye',
            element: (
                <Birdeye/>
            )
        },
    */
    {
        path: '/',
        element: (
          <div className={'bg-body-tertiary'}>
              <App/>
          </div>
        )
    }
])

createRoot(
    document.getElementById("root")
).render(<RouterProvider router={router}/>
);