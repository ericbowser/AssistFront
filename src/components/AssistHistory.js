import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Alert from "react-bootstrap/Alert";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  far
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

const AssistHistory = ({history = [], showHistory, setShowHistory, language}) => {
  const handleClose = () => setShowHistory(!showHistory);

  return (
    <React.Fragment>
      <Offcanvas show={showHistory} onHide={handleClose} className={'bg-black text-white'}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>History</Offcanvas.Title>
        </Offcanvas.Header>
        {history?.length > 0 && (
          <Offcanvas.Body>
            {history.map((item, index) => {
              console.log(item);
              return (
                <div key={`${item}${index}-history`}>
                  <Alert>Question: {item.content}</Alert>
                  <SyntaxHighlighter
                    language={language}
                    style={far}
                    wrapLongLines={true}
                    showLineNumbers={true}
                  >

                      {item.answer}
                    </SyntaxHighlighter>
                  </div>
                )
              })
            }
          </Offcanvas.Body>
        )}
      </Offcanvas>
    </React.Fragment>
  )
}


export default AssistHistory;
