import background from '../assets/circle-scatter-haikei.svg';
import React from "react";

const Background = ({children}) => {
  return (
    <div style={{backgroundImage: background}} className={'w-screen h-screen bg-cover bg-back'}>
      {children}
    </div>
  )
}

export default Background;