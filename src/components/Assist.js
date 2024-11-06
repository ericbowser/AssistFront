import React, {useEffect, useState} from 'react';
import AssistMessage from "./AssistMessage";
import AssistModel from "./AssistModel";
import {Model} from "../utils/constants";
import Markdown from "react-markdown";
import AssistHistory from "./AssistHistory";
import remarkGfm from "remark-gfm";

const Assist = () => {
  /*
    const [element, setElement] = useState(false);
    const [code, setCode] = useState(null);
  */
  const [thread, setThread] = useState(null);
  const [history, setHistory] = useState(null);
  const [current, setCurrent] = useState(null);
  const [model, setModel] = useState(Model.OpenAi);
  const [language, setLanguage] = useState('HTML');


  useEffect(() => {
    if (history && history.length > 0) {
      console.log("history length", history.length);
      console.log("history currrent", history[0]);
      history.forEach((item, index) => {
        console.log(`item and ${index}`, item, index);
      });
    } else {
      console.log("history is empty");
    }
  }, [thread, history, model, language]);

  useEffect(() => {
  }, [current]);

  return (
    <React.Fragment>

      <section className={'main'}>
        <section className={'output-container'}>
          {current && (
              <Markdown
                className={'markdown'}
                language={language}
                remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
              >
                {current}
              </Markdown>
          )}
        </section>
        <section className={'input-container'}>
          <AssistMessage
            setThread={setThread}
            setHistory={setHistory}
            history={history}
            setCurrent={setCurrent}
          />
        </section>
        <section className={'side-bar-right'}>
       {/*   <Button variant={'outline-primary'}
                  onClick={() =>
                    setQuestion('Generate few JavaScript Snippets')}
          >
            A few JavaScript Snippets
          </Button>
          <Button variant={'outline-danger'} onClick={() => setQuestion('Generate few C# snippets')}>
            A few C# Snippets
          </Button>*/}
        </section>
        <section className={'side-bar-left'}>
          <AssistModel
            setModel={setModel}
            model={model}
          />
          {history && history.length > 0 && (
            <AssistHistory history={history}/>
          )
          }
        </section>

      </section>

    </React.Fragment>
  )
};


export default Assist;