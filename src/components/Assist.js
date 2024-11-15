import React, {useEffect, useState} from 'react';
import AssistMessage from "./AssistMessage";
import AssistModel from "./AssistModel";
import {Model} from "../utils/constants";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {forEach} from "lodash";
import AssistImage from "./AssistImage";

const Assist = () => {
  const [thread, setThread] = useState(null);
  const [history, setHistory] = useState([]);
  const [model, setModel] = useState(Model.OpenAi);
  const [language, setLanguage] = useState('HTML');
  const [current, setCurrent] = useState(null);

  useEffect(() => {
  }, [thread, model, language]);

  useEffect(() => {
    if (current) {
      console.log("current response", current);
    }
    if (history && history.length > 0) {
      forEach(history, (item, index) => {
        console.log(`history item ${index}: `, item, index);
      });
    }
  }, [current, history]);

  return (
    <React.Fragment>
      <section className={'main '}>
        <section className={'output-container p-10'}>
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
            model={model}
            history={history}
            setHistory={setHistory}
            setCurrent={setCurrent}
            setThread={setThread}
          />
        </section>
        <section className={'side-bar-left'}>
          <AssistModel
            history={history}
            setModel={setModel}
            model={model}
          />
        </section>
        <section className={'side-bar-right'}>
          <AssistImage>

          </AssistImage>
        </section>
      </section>
    </React.Fragment>
  )
};


export default Assist;