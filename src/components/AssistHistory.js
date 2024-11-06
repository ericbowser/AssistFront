import React from 'react';

const AssistHistory = ({history}) => {
  return (
    <div>
      {
        history.map((item, index) => <div key={index}><p>{item.question}</p></div>)
      }
    </div>)
};

export default AssistHistory;