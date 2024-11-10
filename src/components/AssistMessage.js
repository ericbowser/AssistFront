import React, {useEffect, useState} from "react";
import {decideUrl} from "../utils/assistUtils";
import {post} from "../api/httpApi";
import 'react-quill/dist/quill.snow.css';
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import {Model} from "../utils/constants";
import {FormCheck} from "react-bootstrap";


const AssistMessage = (
  {
    model = Model.OpenAi,
    setThread,
    setCurrent,
    history = [],
    setHistory,
  }) => {

  const [isChecked, setIsChecked] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
  }, [question, spinner, history]);


    function clear() {
      setQuestion(null);
    }

  const setCurrentHistory = (response) => {
    setThread(response.thread);
    setCurrent(response.answer); // callback to the parent for current message
    setHistory([...history, {
      question: question,
      answer: response.answer
    }]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = decideUrl(model, isChecked);
      console.log('url: ', url);
      if (question && url) {
        const body = {
          content: {
            question: question,
          }
        };
        setSpinner(true);

        const response = await post(url, body);
        if (response.status === 200) {
          console.log('response after await response: ', response);
          setCurrentHistory(response);
        } else if (!response || response.status !== 200) {
          setCurrent(`Server error ${response.status}`);
        }
      }
      setSpinner(false);
    } catch
      (err) {
      console.log(err.message)
      setCurrent(err.message);
    }
  };

  return (
    <React.Fragment>
      <Spinner variant={'primary'} animation={'grow'} hidden={!spinner}/>
      <div>

        <Button
          onClick={() => clear()}>
          Clear Question
        </Button>
        <Button
          variant={'outline-dark'}
          onClick={() =>
            setQuestion('Generate few JavaScript Snippets')}
        >
          A few JavaScript Snippets
        </Button>
        <Button
          variant={'outline-dark'}
          onClick={() => setQuestion('Generate few C# snippets')}>
          A few C# Snippets
        </Button>
        <Button
          className={'w-25 text-center align-content-center'}
          id={'submitquestion'}
          disabled={question === null || question === ''}
          type='submit'
          variant={'primary'}
          title={'Submit'}
          onClick={(e) => {
            handleSubmit(e);
          }}
          >
            Submit
          </Button>
        {model === Model.OpenAi && (
          <FormCheck // prettier-ignore
                value={isChecked === true ? 'checked' : 'unchecked'}
                type="switch"
                id="custom-switch"
                label={'Assistant'}
                onChange={() => {
                  setIsChecked(!isChecked);
                }}

          />
        )}
      </div>

      <textarea
        className={'bg-black text-white h-full w-full'}
        rows={5}
        value={question || ''}
        onChange={(event) => setQuestion(event.target.value)}>
          {question}
      </textarea>

    </React.Fragment>
  );
}

export default AssistMessage;