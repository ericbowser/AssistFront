import React, {useEffect, useState} from 'react';
import remarkGfm from "remark-gfm";
import SplitButton from "react-bootstrap/SplitButton";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import {Lang} from "../utils/constants";

const AssistMarkdown = ({answer, scrollToElement, setCode}) => {
  const [language, setLanguage] = useState("markdown");

  function setCodeFromAnswer() {
    if (answer) {
      const codeBlockRegex = /```([\s\S]*?)```/g;
      let codeString = [];
      let match = '';

      while ((match = codeBlockRegex.exec(answer)) !== null) {
        // Remove the backticks and any language specifier from each code block.
        const matched = match[0].replace(/^```\w*\n?|```$/g, '');
        codeString.push(matched);
      }

      setCode(codeString.join(''));

      scrollToElement('CodeBlock');
    }
  }

  return (
    <section>
      <p>Specify a language to parse code snippets:</p>
      <SplitButton
        key={language}
        id={`dropdown-split-variants-${language}`}
        variant={'success'}
        title={language || 'Select language'}
      >
        {Lang.map((language, index) => (<Dropdown.Item
          key={`${index}${language}`}
          eventKey={language}
          onClick={() => setLanguage(language)}>
          {language}
        </Dropdown.Item>))}
      </SplitButton>
      <Button className={'button-style'}
              id={'setCode'}
              onClick={setCodeFromAnswer}
      >
        Extract Code From Answer
      </Button>
      {answer &&
        (
          <Element id={'MarkDown'}>
            <div className={'bg-gray-700'}>
              <Button
                className={'m-10'}
                variant={'primary'}
                onClick={() => copy(answer || undefined)}>
                Copy to Clipboard
              </Button>
              <Markdown
                language={language}
                className={'text-white text-xl color-white overflow-x-auto block p-10'}
                remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
              >
                {answer}
              </Markdown>
            </div>
          </Element>
        )}
    </section>
  );
}

export default AssistMarkdown;