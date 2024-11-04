import Spinner from 'react-bootstrap/Spinner';
import {Model} from "../utils/constants";
import React, {useState, useEffect} from "react";
import {decideUrl} from "../utils/assistUtils";
import {post} from "../api/httpApi";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';


const AssistQuestionForm = ({
                              askingAi = Model.OpenAi,
                              setLanguage,
                              setAnswer,
                              setThread,
                              setSpinner,
                            }) => {

  const [question, setQuestion] = useState('');
  const [assistant, setAssistant] = useState(false);
  const [messageSaved, setMessageSaved] = useState(false);
  const [text, setText] = useState(false);

  useEffect(() => {
  }, [messageSaved, assistant, text]);


  /*
    function clear() {
      setQuestion(null);
      setQuestion(null);
      setAskingAi(null);
      setCode(null);
    }
  */

  const QuestionToAsk = async (event) => {
    if (event) {
      setQuestion(event);
      setLanguage('HTML');
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = decideUrl(askingAi, assistant);
      if (question) {
/*
        setCode(null);
*/
        const body = {
          content: question
        };

        setSpinner(true);

        console.log('url: ', url);
        console.log('content : ', body.content);
        await post(url, body)
          .then(response => {
            if (response.status === 200) {
              console.log('answer', response.answer);
              setThread(response.thread);
              setAnswer(response.answer);
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

  return (
    <React.Fragment>
      <form
        className={'p-6 shadow-md shadow-blue-700'}
        method='post'>
        {/*  <Button className={'m-2'}
                variant={'outline-info'}
                onClick={() =>
                  setQuestion('Generate few JavaScript Snippets')}
        >
          A few JavaScript Snippets
        </Button>*/}
        {/*   <Button variant={'outline-info'}
                  onClick={() => setQuestion('Generate few C# snippets')}>
            A few C# Snippets
          </Button>*/}
        <ReactQuill
          className={'ql-container'}
          value={question}
          theme={'snow'}
          onChange={event => {
              setQuestion(event);
            }
          }/>
        <button id={'submitquestion'}
                className={'m-2 p-2 bg-blue-500 text-white'}
                disabled={askingAi === null || askingAi === ''}
                type='submit'
                onClick={(e) => {
                  handleSubmit(e);
                }}
        >
          Submit Question
        </button>
        {/*      <Button
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

        {/*
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
*/}
      </form>
    </React.Fragment>
  );
}

export default AssistQuestionForm;