import React, {useEffect, useMemo, useState} from "react";
import {decideUrl} from "../helpers/utils/assistUtils";
import {ImageSize} from "../helpers/utils/constants";
import {post, postImage} from "../api/httpApi";
import 'react-quill/dist/quill.snow.css';
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import {Model} from "../helpers/utils/constants";
import {FormCheck} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import TextareaAutosize from 'react-textarea-autosize';
import VoiceTranscript from './VoiceTranscript';

const AssistMessage = (
  {
    selectedChat,
    model = Model.OpenAi,
    setThreadParent,
    setCurrent,
    history = [],
    setHistory,
    setImageUrlParent,
    setImageSizeParent,
    setBase64String
  }) => {

  const [assistant, setAssistant] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [question, setQuestion] = useState('');
  const [thread, setThread] = useState(null);
  const [createImage, setCreateImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [base64, setBase64] = useState(null);

 /* // In ChatProvider, add this after useState:
  useEffect(() => {
    // Load messages from localStorage on initial load
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);*/
  
  
  useEffect(() => {
  }, [question, spinner, history, thread, createImage, errorMessage, image, imageSize, base64]);

  function clear() {
    setQuestion(null);
  }

  const setCurrentHistory = (response) => {
    setImage(null);
    setThread(response.thread);
    setImageUrlParent(null);
    setThreadParent(response.thread);
    console.log('current thread: ', response.thread);
    setCurrent(response.content); // callback to the parent for current message
    setHistory([...history, {
      thread: response.thread,
      answer: response.answer,
    }]);
  }

  const handleImageSubmit = async () => {
    try {
      const body = {
        content: {
          question,
          size: imageSize,
          model
        }
      };
      setSpinner(true);

      const response = await postImage(process.env.OPENAI_API_IMAGE_URL, body);
      
      if (response.status === 200) {
        console.log('Image response: ', response.answer);
        setImage(response.answer);
        setBase64(response.answer);
        setBase64String(response.answer);
        
        setImageUrlParent(response.answer);
        setSpinner(false);
        setCurrent(response.answer);
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
        const data = [
          ...history,
          {role: 'user', content: question, thread},
        ];
        setSpinner(true);

        const response = await post(url, data);
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

  async function handleImageSize(event) {
    const size = event.target.value;
    console.log(size);
    if (size) {
      console.log('image size: ', size);
      let x = size.split('x');
      console.log('image width: ', x[0]);
      console.log('image height: ', x[1]);
      setImageSize(size);
      setImageSizeParent(size);
    } else {
      console.error('Something went wrong with image size ', size);
      alert(`Error ${size}`);
    }
  }

  const showInputs = (
    model === Model.Claude
    || model === Model.DeepSeek
    || model === Model.Gemini
    || model === Model.OpenAi);

  return (
    <React.Fragment>
      <Spinner variant={'danger'} animation={'border'} hidden={!spinner}/>
      <TextareaAutosize
        inputMode={'text'}
        cacheMeasurements={true}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}>
        {question}
      </TextareaAutosize>
      <VoiceTranscript setContent={setQuestion} />
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
          {
            <>
              <FormCheck
                key={'enable_image'}// prettier-ignore
                value={createImage === true ? 'checked' : 'unchecked'}
                disabled={showInputs}
                type="switch"
                id="custom-switch"
                label={'Image'}
                onChange={() => {
                  setCreateImage(!createImage);
                }}
              />

              {createImage === true &&
                <div className={'d-flex flex-row'}>
                  {model === 'dall-e-2' ?
                    [ImageSize.small, ImageSize.medium, ImageSize.large].map(size => (
                      <FormCheck
                        className={'m-2'}
                        key={size}
                        value={size}
                        id={'imageSize'}
                        type={'radio'}
                        checked={imageSize === size}
                        onChange={handleImageSize}
                        label={size}
                      />
                    )) : [ImageSize.large, ImageSize.extraWidth, ImageSize.extraHeight].map(size => (
                      <FormCheck
                        className={'m-2'}
                        key={size}
                        value={size}
                        id={'imageSize'}
                        type={'radio'}
                        checked={imageSize === size}
                        onChange={handleImageSize}
                        label={size}
                      />))}
                < /div>
              }

            </>
          }
          {errorMessage ?
            <Alert
              className={'p-2'}
              variant={'danger'}>
              <div className={'p-2 bg-info'}>
                <strong>Thread: </strong> {thread}
              </div>
              {errorMessage}
            </Alert>
            : null
          }
        </div>
      </div>
    </React.Fragment>
  )
}

export default AssistMessage;
