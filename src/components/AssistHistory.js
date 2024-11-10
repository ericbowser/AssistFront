import React, {useEffect, useState} from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Alert from "react-bootstrap/Alert";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  far
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

const AssistHistory = ({history = [], showHistory, language}) => {
  const [show, setShow] = useState(showHistory);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true)

  useEffect(() => {
  }, [show]);

  return (
    <React.Fragment>
      <Offcanvas show={show} onHide={handleClose} className={'bg-black text-white'}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>History</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {history && history.length > 0 &&
            (
              history.map((item, index) => {
                return (
                  <div key={index}>
                    <Alert>Question: {item.question}</Alert>
                    <SyntaxHighlighter style={far}>

                      {item.answer}
                    </SyntaxHighlighter>
                  </div>
                )
              })
            )
          }
        </Offcanvas.Body>

      </Offcanvas>
    </React.Fragment>
  )
}


export default AssistHistory;