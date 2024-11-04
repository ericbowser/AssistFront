import React, {useState, useEffect} from 'react';
import AssistQuestionForm from "./AssistQuestionForm";
import AssistModel from "./AssistModel";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Assist = () => {
  const [answer, setAnswer] = useState(null);
  const [thread, setThread] = useState(null);
  const [messageSaved, setMessageSaved] = useState(false);
  const [top, setTop] = useState(false);
  const [embedding, setEmbedding] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [code, setCode] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
  }, [spinner, thread, answer, question]);

  return (
    <section className={'main'}>
      <section className={'side-bar-left'}>
        <AssistModel/>
      </section>
      <section className={'input-container'}>
        <AssistQuestionForm
          setSpinner={setSpinner}
          setCode={setCode}
          setThread={setThread}
          setAnswer={setAnswer}
        />
      </section>
      <section className={'output-container'}>
        {answer && (
          <div className={'markdown-container'}>
            <Markdown
              remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
            >
              {answer}
            </Markdown>
          </div>
          )}
      </section>
      <section className={'side-bar-right'}>

      </section>
    </section>
  )
};


export default Assist;