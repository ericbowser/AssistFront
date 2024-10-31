import Row from "react-bootstrap/Row";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import ReactQuill from "react-quill";
import {Model} from "../utils/constants";
import React, {useState, useEffect} from "react";
import GenerateImage from "../api/openAiApi";
import {decideUrl} from "../utils/assistUtils";
import {post} from "../api/httpApi";

const AssistForm = ({
                      askingAi = Model.OpenAi, setAskingAi = () => {
  }
                    }) => {
  const [question, setQuestion] = useState('');
  const [action, setAction] = useState(null);
  const [assistant, setAssistant] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [thread, setThread] = useState(null);
  const [messageSaved, setMessageSaved] = useState(false);
  const [code, setCode] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [text, setText] = useState(false);

  useEffect(() => {
  }, [code, thread, messageSaved, assistant, text]);

  const handleSubmit = async (event) => {
    if (action === 'generateImage') return;
    event.preventDefault();
    try {
      const url = decideUrl(askingAi, assistant);
      if (question) {
        setCode(null);
        const body = {
          content: question
        };

        setSpinner(true);

        console.log('url: ', url);
        console.log('content : ', body.content);
        await post(url, body)
          .then(response => {
            if (response.status === 200) {
              setStatus(response.status);
              setThread(response.thread);
              setAnswer(response.answer);
              setMessageSaved(true);
              setSpinner(false);
            } else if (!response || response.status !== 200) {
              setAnswer(`Server error ${response.status}`);
            }
          });
      }
    } catch
      (err) {
      console.log(err)
      setAnswer(err);
    }
  };

  function clearImage() {
    setImageUrl(null);
  }

  function clear() {
    setQuestion(null);
    setQuestion(null);
    setAskingAi(null);
    setCode(null);
  }




  const QuestionToAsk = async (event) => {
    if (event) {
      setQuestion(event);
      setLanguage('HTML');
    }
  }
  const getImageUrl = async () => {
    setSpinner(true);
    const imageUrl = await GenerateImage(question);
    console.log('image url:', imageUrl);
    if (imageUrl) {
      await setImageUrl(imageUrl);
      setCode('');
    }
    setSpinner(false);
  }

  const handleImageSize = (event) => {
    const size = event.target.value;
    setImageSize(size);
  }

  useEffect(() => {
    if (answer) {
      scrollToElement('MarkDown')
    }
  }, [answer]);

  return (
    <div>
      {spinner && (
        <Spinner
          variant={'danger'}
          className={'text-center m-20'}
          size={100}
        />)
      }
      {spinner && <div className={'text-center p-40'}>
        <Spinner animation="border"
                 variant='dark'
                 size={100}
        />
      </div>}
      {spinner && <div className={'text-center p-40'}>
        <Spinner animation="border"
                 variant='dark'
                 size={100}
        />
      </div>}
      <Form
        className={'p-6 shadow-md shadow-blue-700'}
        method='post'>
        <Form.Group>
          <Button className={'m-2'}
                  variant={'outline-info'}
                  onClick={() => setQuestion('Generate few JavaScript Snippets')}>
            A few JavaScript Snippets
          </Button>
          <Button variant={'outline-info'}
                  onClick={() => setQuestion('Generate few C# snippets')}>
            A few C# Snippets
          </Button>
          <Row className={'mb-3 p-1'}>
            <ReactQuill
              value={question}
              className={'p-3'}
              onChange={event => {
                setText(event);
                QuestionToAsk(event);
              }
              }/>
          </Row>
          <Row className={'py-3'}>
            <Col md={8}>
              <Button
                className={'mr-2'}
                variant={'primary'}
                onClick={() => clear()}>
                Clear Question
              </Button>
              <Button
                className={'mr-2'}
                variant={'secondary'}
                onClick={() => clearImage()}>
                Clear Image
              </Button>
            </Col>
            <Col md={4}>
              <label htmlFor="number-input">Image Size:
                <input
                  onChange={handleImageSize}
                  style={{width: '75px', marginLeft: '15px'}}
                  type="number"
                  id="number-input"
                  placeholder="350"
                />
              </label>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Button id={'submitquestion'}
                      className={'mr-2'}
                      variant='success'
                      disabled={askingAi === null || askingAi === '' || action === 'submitQuestion'}
                      type='submit'
                      onClick={(e) => {
                        setAction('askQuestion');
                        handleSubmit(e).then(() => setAction(null));
                      }}
              >
                Submit Question
              </Button>
              <Button id={'imageUrl'}
                      className={'mr-2'}
                      variant='secondary'
                      onClick={async (e) => {
                        await setAction('generateImage');
                        await getImageUrl(e)
                        await scrollToImage();
                      }}
              >
                Generate Image
              </Button>
            </Col>
            <Col md={6}>
              {askingAi === Model.OpenAi && (
                <div>
                  <span>Turn on Assistant</span>
                  <Form.Check // prettier-ignore
                    value={assistant || false}
                    type="switch"
                    id="custom-switch"
                    onChange={() => {
                      setAssistant('checked')
                    }}
                  >

                  </Form.Check>
                </div>
              )}
            </Col>
          </Row>
        </Form.Group>
      </Form>
    </div>
  );
}

export default AssistForm;