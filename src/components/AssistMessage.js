import React, {useEffect, useMemo, useState} from "react";
import {decideUrl} from "../utils/assistUtils";
import {post} from "../api/httpApi";
import 'react-quill/dist/quill.snow.css';
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import {Model} from "../utils/constants";
import {FormCheck} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";


const AssistMessage = (
  {
    selectedChat,
    model = Model.OpenAi,
    // setThread,
    setCurrent,
    history = [],
    setHistory,
  }) => {

  const [isChecked, setIsChecked] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [question, setQuestion] = useState(null);
  const [thread, setThread] = useState(null);

  useEffect(() => {
  }, [question, spinner, history, thread]);

  useMemo(() => {

  }, [selectedChat]);

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
            history: [...history]
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
      setSpinner(false);
      setCurrent(err.message);
    }
  };

  function calculateValue() {
    if (question === null && selectedChat?.question) {
      setQuestion(selectedChat.question);
    } else {
      setQuestion(question);
    }
  }

  return (
    <React.Fragment>
      <Spinner variant={'danger'} animation={'grow'} hidden={!spinner}/>

      <textarea
        rows={5}
        value={question || ''}
        onChange={(event) => setQuestion(event.target.value)}>
          {question}
      </textarea>
      {/*   {history && history.length > 0 && (
        <AssistMarkdown ></AssistMarkdown>
      )
      }*/}
      <div className={'flex flex-col text-white'}>

        <Button
          className={'p-2 m-2'}
          onClick={() => clear()}>
          Clear Question
        </Button>
        <Button
          className={'p-2 m-2'}
          variant={'outline-light'}
          onClick={() =>
            setQuestion('Generate few JavaScript Snippets')}
        >
          A few JavaScript Snippets
        </Button>
        <Button
          className={'p-2 m-2'}
          variant={'outline-light'}
          onClick={() => setQuestion('Generate few C# snippets')}>
          A few C# Snippets
        </Button>
        <Button
          className={'p-2 m-2'}
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
        <div className={'m-2 p-2 align-content-center'}>
          <FormCheck // prettier-ignore
            value={isChecked === true ? 'checked' : 'unchecked'}
            disabled={model !== Model.OpenAi}
            type="switch"
            id="custom-switch"
            label={'Assistant'}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />

        </div>
      </div>

      {thread && thread.length > 0 && (
        <Alert
          className={'m-2 p-2'}
          variant={'info'}>
          <div className={'p-2 bg-info'}>
            <strong>Thread: </strong> {thread}
          </div>
        </Alert>)
      }


    </React.Fragment>
  )
    ;
}

export default AssistMessage;