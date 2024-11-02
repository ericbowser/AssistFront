import React, {useState, useEffect} from 'react';
import AssistQuestionForm from "./AssistQuestionForm";
import AssistModel from "./AssistModel";

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
    <section className={'main text-2xl text-black font-extrabold'}>
      <section className={'side-bar'}>
        <AssistModel/>
      </section>
      <div className={'input-container'}>
      <AssistQuestionForm
        setSpinner={setSpinner}
        setCode={setCode}
        setThread={setThread}
        setAnswer={setAnswer}
      />
      </div>
      {answer && (
        <section className={'output-container'}>
          <textarea>{answer}</textarea>
        </section>
      )}
    </section>
  )
};


export default Assist;