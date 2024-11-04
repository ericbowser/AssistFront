import React, {useState} from 'react';
import {SplitButton} from "react-bootstrap";
import {Model} from "../utils/constants";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";

const AssistModel = () => {
  const [askingAi, setAskingAi] = useState(Model.OpenAi);
  return (
      <form className={'pt-4'}>
        <SplitButton
          className={'m-2 w-fit bg-blue-500 text-white'}
          key={askingAi || null}
          id={`dropdown-split-variants-${askingAi}`}
          variant={'info'}
          title={askingAi || 'Select Model'}
        >
          {[Model.Gemini, Model.Claude, Model.OpenAi].map((model, index) => {
            console.log(model);
            return (
              <Dropdown.Item
                key={`${index}${model}`}
                eventKey={askingAi}
                title={model}
                onClick={() => setAskingAi(model)}>
                {model}
              </Dropdown.Item>)
          })}
        </SplitButton>
      </form>
  );
};

export default AssistModel;