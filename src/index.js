import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import Assist from './Components/Assist';
import MyLinks from "./Components/MyLinks";
import Birdeye from "./Components/Birdeye";

const router = createBrowserRouter([
    {
        path: '/askAssist',
        element: (
            <Assist/>
        )
    },
    {
        path: '/myLinks',
        element: (
            <MyLinks/>
        )
    },
    {
        path: '/birdeye',
        element: (
            <Birdeye/>
        )
    },
    {
        path: '/',
        element: (
            <App/>
        )
    }
])

createRoot(
    document.getElementById("root")
).render(<RouterProvider router={router}/>
);