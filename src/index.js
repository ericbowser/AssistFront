import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import Assist from './components/Assist';
import '../src/output.css';
import GetUrlInfo from "./components/GetUrlInfo";

const router = createBrowserRouter([
    {
        path: '/askAssist',
        element: (
          <div>
              <Assist/>
          </div>
        )
    },
    {
        path: '/getUrlInfo',
        element: (
          <div>
            <GetUrlInfo/>
          </div>
        )
    },
    {
        path: '/',
        element: (
          <div>
              <App/>
          </div>
        )
    }
])

createRoot(
    document.getElementById("root")
).render(<RouterProvider router={router}/>
);