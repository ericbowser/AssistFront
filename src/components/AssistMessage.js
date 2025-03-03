import React, {useEffect, useMemo, useState} from "react";
import {decideUrl} from "../utils/assistUtils";
import {post, postImage} from "../api/httpApi";
import 'react-quill/dist/quill.snow.css';
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import {Model} from "../utils/constants";
import {FormCheck} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import TextareaAutosize from 'react-textarea-autosize';

const AssistMessage = (
  {
    selectedChat,
    model = Model.OpenAi,
    // setThread,
    setCurrent = () => {},
    history = [],
    setHistory = () => {},
    setImageUrl = () => {}
  }) => {

  const [assistant, setAssistant] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [question, setQuestion] = useState('');
  const [thread, setThread] = useState(null);
  const [createImage, setCreateImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
  }, [question, spinner, history, thread, createImage, errorMessage, image]);

  useMemo(() => {

  }, [selectedChat]);

  function clear() {
    setQuestion(null);
  }

  const setCurrentHistory = (response) => {
    setImageUrl(null);
    setImage(null);
    setThread(response.thread);
    console.log('current thread: ', response.thread);
    setCurrent(response.answer); // callback to the parent for current message
    setHistory([...history, {
      question: question,
      thread: response.thread,
      answer: response.answer,
    }]);
  }

  const handleImageSubmit = async () => {
    try {
      const body = {
        content: {
          question: question
        }
      };
      setSpinner(true);

      const response = await postImage(process.env.OPENAI_API_IMAGE_URL, body);
      if (response.status === 200) {
        setImage(response.answer);
        setImageUrl(response.answer);
        setCurrent(`Image url ${imageUrl}`);
      } else if (!response || response.status !== 200) {
        setCurrent(`Server error ${response.status}`);
      }
    } catch (err) {
      console.log('Oops error! ', err.message);
      setSpinner(false);
      setCurrent(err.message);
      setErrorMessage(err.message);
    }
  }

  const handleSubmit = async () => {
    try {
      const url = decideUrl(model, assistant);
      console.log('The Assist back-end url: ', url);
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
          setCurrentHistory(response);
        } else if (!response || response.status !== 200) {
          setCurrent(`Server error ${response.status}`);
        }
      }
      setSpinner(false);
    } catch
      (err) {
      console.log('Oops error! ', err.message);
      setSpinner(false);
      setCurrent('');
      setErrorMessage(err.message);
    }
  };

  return (
    <React.Fragment>
      <Spinner variant={'danger'} animation={'border'} hidden={!spinner}/>
      <TextareaAutosize
        maxRows={8}
        minRows={3}
        inputMode={'text'}
        cacheMeasurements={true}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}>
        {question}
      </TextareaAutosize>
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
        {!createImage &&
          <Button
            className={'p-2 m-2'}
            id={'submitQuestion'}
            disabled={question === null || question === ''}
            type='submit'
            variant={'primary'}
            title={'Submit'}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        }
        {createImage &&
          <Button
            className={'p-2 m-2'}
            id={'submitImage'}
            disabled={question === null || question === ''}
            type='submit'
            variant={'primary'}
            title={'ImageSubmit'}
            onClick={handleImageSubmit}
          >
            Create Image
          </Button>
        }
        <div className={'m-2 p-2 align-content-center'}>
          {!createImage &&
            <FormCheck // prettier-ignore
              value={assistant === true ? 'checked' : 'unchecked'}
              disabled={model !== Model.OpenAi}
              type="switch"
              id="custom-switch"
              label={'Assistant'}
              onChange={() => {
                setAssistant(!assistant);
              }}
            />
          }
          {!assistant &&
            <FormCheck // prettier-ignore
              value={createImage === true ? 'checked' : 'unchecked'}
              disabled={model !== Model.OpenAi}
              type="switch"
              id="custom-switch"
              label={'Image'}
              onChange={() => {
                setCreateImage(!createImage);
              }}
            />
          }
        </div>
      </div>
      {errorMessage ?
        <Alert
          className={'m-2 p-2'}
          variant={'danger'}>
          <div className={'p-2 bg-info'}>
            <strong>Thread: </strong> {thread}
          </div>
          {errorMessage}
        </Alert> : null
      } 
    </React.Fragment>
  )
}

export default AssistMessage;