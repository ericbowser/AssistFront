import React, {useEffect, useState} from 'react';
import AssistMessage from "./AssistMessage";
import AssistModel from "./AssistModel";
import {Model} from "../helpers/utils/constants";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {forEach} from "lodash";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

const Assist = () => {
  const [thread, setThreadParent] = useState(null);
  const [history, setHistory] = useState([]);
  const [model, setModel] = useState(Model.OpenAi);
  const [language, setLanguage] = useState('HTML');
  const [current, setCurrent] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrlParent] = useState(null);
  const [imageSizeParent, setImageSizeParent] = useState(null);
  const [base64String, setBase64String] = useState(null);

  useEffect(() => {
  }, [thread, model, language, selectedChat, imageUrl, imageSizeParent, base64String]);

  useEffect(() => {
    if (current) {
      console.log("current response", current);
    }
    if (history && history.length > 0) {
      forEach(history, (item, index) => {
        console.log(`history item ${index}: `, item, index);
      });
    }
    console.log('History length: ', history.length)
  }, [current, history]);

  async function CopyToClipboard() {
    /*  if (imageUrl) {
          try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
            console.log("Image copied to clipboard!");
          } catch (error) {
            console.error("Error copying image to clipboard:", error);
          }
      } else {*/
    navigator.clipboard.writeText(current).then(() => {
      setCopied(true);
      console.log('Text copied to clipboard');
    });
  }

  function base64ToImage() {
    const src = `data:image/png;base64,${base64String}`;
    console.log('The image source: ', base64String);
    const wh = imageSizeParent.split('x');
    return (
      <Image src={src} width={wh[0]} height={wh[1]} alt={'Image'} />
    )
  }

  return (
    <React.Fragment>
      <section className={'main'}>
        <section className={'side-bar-left'}>
          <AssistModel
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            history={history}
            setModel={setModel}
            model={model}
          />
        </section>
        <section className={'input-container'}>
          <AssistMessage
            model={model}
            history={history}
            setHistory={setHistory}
            setThreadParent={setThreadParent}
            setCurrent={setCurrent}
            selectedChat={selectedChat}
            setImageUrlParent={setImageUrlParent}
            setImageSizeParent={setImageSizeParent}
            setBase64String={setBase64String}
          />
        </section>
        <section className={'output-container'}>
          {current && (
            <>
              <Button onClick={CopyToClipboard}>
                Copy to Clipboard
              </Button>
              {copied &&
                <Alert variant={'light'}>Copied!</Alert>}
              {!base64String ?
                <Markdown
                  className={'markdown'}
                  language={language}
                  remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
                >
                  {current}
                </Markdown>
                :
                <div>
                 {/* <Image
                    src={imageUrl}
                    alt={'Image'}
                  />*/}
                  {base64ToImage()}
                </div>
              }
            </>
          )}
        </section>
      </section>
    </React.Fragment>
  )
};


export default Assist;