import {Model} from "../utils/constants";
import React, {useEffect, useState} from "react";
import {decideUrl} from "../utils/assistUtils";
import {post} from "../api/httpApi";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import {Col, Row} from "react-bootstrap";


const AssistMessage = ({
                              askingAi = Model.OpenAi,
                              setLanguage,
                              setHistory = [{}],
                              history = [{}],
                              setThread,
                              setCurrent,
                            }) => {

  const [assistant, setAssistant] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
  }, [assistant, question, spinner, answer]);


    function clear() {
      setQuestion(null);
    }

  const QuestionToAsk = async (event) => {
    if (event) {
      setQuestion(event);
      setLanguage('HTML');
    }
  }

  const setCurrentHistory = (response) => {
    setThread(response.thread);
    setAnswer(response.answer); // append to the array of answers
    setCurrent(response.answer); // callback to the parent for current message
    setHistory([{...history, response}]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = decideUrl(askingAi, assistant);
      if (question && url) {
/*
        setCode(null);
*/

        // what does the body look like for passing in history for the next response?
        const body = {
          content: {
            question: question,
/*
            history: history
*/
          }
        };

        setSpinner(true);

        console.log('url: ', url);
        console.log('content : ', body.content);
        const response = await post(url, body);
        if (response.status === 200) {
          console.log('answer', response.answer);
          setThread(response.thread);
          setAnswer(response.answer); // append to the array of answers/*
          setCurrentHistory(response);
          setSpinner(false);
        } else if (!response || response.status !== 200) {
          setAnswer(`Server error ${response.status}`);
        }
        console.log('response', data);
      }
    } catch
      (err) {
      console.log(err)
      setAnswer(err);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col md={'10'}>
          <ReactQuill
            value={question}
            theme={'snow'}
            onChange={event => {
              setQuestion(event);
            }
            }/>
        </Col>
        <Col md={'2'}>
          <Button id={'submitquestion'}
                  disabled={askingAi === null || askingAi === ''}
                  type='submit'
                  variant={'primary'}
                  title={'Submit'}
                  onClick={(e) => {
                    setSpinner(true);
                    handleSubmit(e);
                    if (answer) {
                      setHistory({...history, answer});
                    }
                  }}
          >
            Submit
          </Button>
        </Col>
      </Row>
{/*
      <button
            className={'mr-2'}
            onClick={() => clear()}>
            Clear Question
      </button>
      <button
            className={'mr-2'}
            onClick={() => clearImage()}>
            Clear Image
      </button>
*/}

       {/*   {askingAi === Model.OpenAi && (
            <div>
              <span>Turn on Assistant</span>
              <check // prettier-ignore
                value={assistant || false}
                type="switch"
                id="custom-switch"
                onChange={() => {
                  setAssistant('checked')
                }}
              >
              </check>
                </div>
          )}*/}
      <Spinner variant={'primary'} animation={'border'} hidden={!spinner}/>
    </React.Fragment>
  );
}

export default AssistMessage;