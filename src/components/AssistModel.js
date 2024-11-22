import React, {useEffect, useState} from 'react';
import {SplitButton} from "react-bootstrap";
import {Model} from "../utils/constants";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import AssistHistory from "./AssistHistory";

const AssistModel = ({history, setSelectedChat, selectedChat, setModel, model = Model.OpenAi}) => {
  const [askingAi, setAskingAi] = useState(model);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
  }, [showHistory, askingAi, selectedChat]);

  return (
    <div >
      <label className={'text-white p-4'}>
        Select a model to assist you:
      </label>
        <SplitButton
          className={'m-1'}
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
              <div className={'mt-5'} key={`${item.question.substring(0, 10)}${index}`}>
                <Alert className={'cursor-pointer'}
                       variant={'light'}
                       onClick={() => {
                         console.log('selected chat: ', item);
                         setSelectedChat(item.question);
                       }}>
                  {item.question}
                </Alert>
              </div>
            )
          })
        )}
      {showHistory && (
        <AssistHistory
          history={history}
          showHistory={showHistory}
          setShowHistory={setShowHistory}>
        </AssistHistory>
      )}
    </div>
  );
};

export default AssistModel;