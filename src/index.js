import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import Assist from './Components/Assist'
import Navigation from "./Components/Navigation";

const router = createBrowserRouter([
  {
    path: '/askAssist',
    element:(
        <Assist/>
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
  ).render(
    <RouterProvider router={router} />
);