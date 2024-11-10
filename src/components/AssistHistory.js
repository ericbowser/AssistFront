import React, {useEffect, useState} from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from "react-bootstrap/Button";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light";

const AssistHistory = ({history = [], showHistory}) => {
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
          {history && history.length > 0 && history.map((item, index) => {
            return (
              <div key={`${index}${item.substring(0, 10)}`}>
                <span className={'text-wrap'}>Question: {item.question}</span>
                <SyntaxHighlighter language={'HTML'}>
                  <p>{item.answer}</p>
                </SyntaxHighlighter>
              </div>
            )
          })}
        </Offcanvas.Body>

      </Offcanvas>
    </React.Fragment>
  )
}


export default AssistHistory;