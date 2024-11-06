import React, {useState} from 'react';
import {SplitButton} from "react-bootstrap";
import {Model} from "../utils/constants";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";

const AssistModel = ({setModel, model = Model.OpenAi}) => {
  const [askingAi, setAskingAi] = useState(model);
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
      </form>
  );
};

export default AssistModel;