import React, {useState} from 'react';
import {SplitButton} from "react-bootstrap";
import {Model} from "../utils/constants";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

const AssistModel = ({history, setModel, model = Model.OpenAi}) => {
  const [askingAi, setAskingAi] = useState(model);
  const [showHistory, setShowHistory] = useState(false);
  return (
      <form>
        <label className={'text-white p-4'}>
          Select a model to assist you:
        </label>
        <SplitButton
          key={askingAi || null}
          id={`dropdown-split-variants-${askingAi}`}
          variant={'success'}
          title={askingAi || 'Select Model'}
        >
          {[Model.Gemini, Model.Claude, Model.OpenAi].map((model, index) => {
            console.log(model);
            return (
              <Dropdown.Item
                key={`${index}${model}`}
                eventKey={askingAi}
                title={model}
                onClick={() => {
                  setAskingAi(model)
                  setModel(model);
                }}>
                {model}
              </Dropdown.Item>)
          })}
        </SplitButton>
        <Button onClick={() => setShowHistory(!showHistory)}>
          Show History
        </Button>
        {history && history.length > 0 && (
          history.map((item, index) => {
            return (
              <div key={`${item.question.substring(0, 10)}${index}`}>
                <Alert variant={'light'}>{item.question}</Alert>
              </div>
            )
          })
        )}
        {showHistory && (
          <Offcanvas show={showHistory} onHide={() => setShowHistory(!showHistory)} className={'bg-black text-white'}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>History</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {history && history.length > 0 && history.map((item, index) => {
                return (
                  <div key={`${item.question.substring(0, 10)}${index}`}>
                    <Alert variant={'light'}>{item.question}</Alert>
                    <Alert variant={'dark'}>{item.answer}</Alert>
                  </div>
                )
              })}
            </Offcanvas.Body>
          </Offcanvas>
        )}
     {/*   {history && history.length > 0 && (
          <Offcanvas show={showHistory} onHide={() => setShowHistory(!showHistory)} className={'bg-black text-white'}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>History</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {history && history.length > 0 && history.map((item, index) => {
                return (
                  <div key={index}>
                    <p>{item.question}</p>
                    <p>{item.answer}</p>
                  </div>
                )
              })}
            </Offcanvas.Body>
          </Offcanvas>
        )}*/}
      </form>
  );
};

export default AssistModel;