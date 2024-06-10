import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {post} from '../Api/httpApi';
import Navigation from "./Navigation";
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from "react-bootstrap/Alert";
import CodeEditor from '@uiw/react-textarea-code-editor';
import FormGroup from "react-bootstrap/FormGroup";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {Col, Row, SplitButton} from "react-bootstrap";
import VoiceTranscript from "./VoiceTranscript";
import ReactMarkdown from 'react-markdown';
import {SiGmail} from "react-icons/si";
import GenerateImage from '../Api/openAiApi';
import LANG from '../../docs/languages';
import copy from 'copy-to-clipboard';


const Assist = () => {
    const [content, setContent] = useState('');
    const [answer, setAnswer] = useState(null);
    const [thread, setThread] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [instructions, setInstructions] = useState('General development questions');
    const [status, setStatus] = useState('');
    const [messageSaved, setMessageSaved] = useState(false);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState("markdown");
    const [imageUrl, setImageUrl] = useState(null);
    const [imageSize, setImageSize] = useState(350);

    useEffect(() => {
    }, [
        answer,
        instructions,
        status,
        thread,
        spinner,
        content,
        messageSaved,
        code,
        language,
        imageUrl,
        imageSize
    ]);

    function copyToClipBoard(text = "test") {
        copy(text);

    }

    async function SetAnswerAsCallback(res) {
        setStatus(res.status);

        if (res.status !== 200) {
            setAnswer(`Server error ${res.status}`);
        }

        if (res.status === 200) {
            if (res.data) {
                setAnswer(res.data);
            }
            if (res.thread) {
                setThread(res.thread);
            }

            setSpinner(false);
        }
    }

    const SetCodeFromAnswer = () => {
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
        }
    }

    async function SaveTextAsCallback(response) {
        if (response.status === 200) {
            setStatus(response.status);
            setMessageSaved(true);
            setSpinner(false);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = process.env.ASSIST_URL;
            if (content) {
                const body = {
                    content,
                    instructions
                };

                setSpinner(true);

                await post(url, body, SetAnswerAsCallback);
            }

            setSpinner(false);
        } catch (err) {
            console.log(err)
            setAnswer(err);
        }
    };

    const QuestionToAsk = async (event) => {
        if (event?.target?.value) {
            const content = event.target.value;
            setContent(content);
        }
    }

    const InstructionsForAssist = event => {
        if (event?.target?.value) {
            const instructions = event.target.value;
            setInstructions(instructions);
        }
    }

    /*  const SaveText = async event => {
          event.preventDefault();
          if (thread && answer) {
              const body = {
                  answer,
                  thread
              };
              const response = await post(process.env.ASSIST_SAVE, body, SaveTextAsCallback);
              console.log('response', response);
              return response;
          } else {
              console.log('no answer or session saved')
          }
      }*/

    function clear() {
        setContent(null);
    }

    /*  function clearBoth() {
          setContent(null);
          setInstructions(null);
      }*/
    function clearImage() {
        setImageUrl(null);
    }

    const getImageUrl = async () => {
        setSpinner(true);
        const imageUrl = await GenerateImage(content);
        if (imageUrl) {
            setImageUrl(imageUrl);
            setCode('');
        }
        setSpinner(false);
    }

    const handleImageSize = (event) => {
        const size = event.target.value;
        setImageSize(size);
    }

    const saveImageUrl = async () => {
        if (imageUrl) {
            const data = {
                imageUrl,
                prompt: content
            }
            await post(process.env.ASSIST_SAVE, data);
        }
    }

    return (
        <div className={'container'}>
            <div className={'text-center'}>
                <Navigation/>
            </div>
            <Form.Group className={'py-3'}>
                <VoiceTranscript setContent={setContent}/>
                <Button variant='outline-success'
                        type='submit'
                        onClick={handleSubmit}
                >
                    Submit Question
                </Button>
                <Button variant='outline-secondary'
                        type='submit'
                        onClick={getImageUrl}
                >
                    Generate Image
                </Button>
                <Button onClick={SetCodeFromAnswer}
                        variant={'outline-primary'}
                >
                    Extract Code From Answer
                </Button>
                <Button onClick={saveImageUrl}
                        variant={'outline-dark'}
                >
                    Save Image Url
                </Button>

                {messageSaved &&
                    <Alert variant={'success'}>
                        {answer}
                    </Alert>
                }
            </Form.Group>
            {thread &&
                <div className={'text-bg-success text-xxl-start'}>Thread: {thread}</div>
            }
            {imageUrl &&
                <div className={'text-bg-success text-xxl-start'}>
                    {imageUrl}
                </div>
            }
            <Form
                method='post'
                onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        placeholder="Ask a question"
                        rows={2}
                        value={content || ''}
                        onChange={event => QuestionToAsk(event)}
                    />
                    <Form.Control
                        value={instructions || ''}
                        as="textarea"
                        placeholder="Instructions for Assist"
                        rows={2}
                        onChange={event => InstructionsForAssist(event)}
                    />
                    <div className={'py-3'}>
                        <Button variant={'outline-dark'} onClick={() => clear()}>Clear Question</Button>
                        <Button variant={'outline-dark'} onClick={() => clearImage()}>Clear Image</Button>
                        <Button
                            className={'text-black'}
                            variant={'outline-light'}
                            onClick={() => copy(answer || '')}>
                            Copy to Clipboard
                        </Button>
                        <div className={'float-right'}>
                            <label htmlFor="number-input">Image Size:
                                <input
                                    onChange={handleImageSize}
                                    style={{width: '75px', marginLeft: '15px'}}
                                    type="number"
                                    id="number-input"
                                    placeholder="350"
                                />
                            </label>
                        </div>
                    </div>
                </Form.Group>
            </Form>
            {spinner &&
                <div style={{textAlign: 'center'}}>
                    <Spinner animation="border" variant='dark'/>
                </div>
            }
            {imageUrl &&
                <img
                    src={imageUrl}
                    alt="Generated by OpenAI"
                    width={imageSize}
                    className={'py-5'}
                />
            }
            {!spinner && answer && (
                <FormGroup style={{paddingBottom: '200px'}} className={'flex'}>
                    <SplitButton
                        key={language}
                        id={`dropdown-split-variants-${language}`}
                        variant={'info'}
                        title={language || 'Select language'}
                        style={{boxShadow: 'black 2px 2px 5px 2px', marginLeft: '15px'}}
                    >
                        {LANG.map((language, index) => (
                                <Dropdown.Item
                                    key={`${index}${language}`}
                                    eventKey={language}
                                    onClick={() => setLanguage(language)}>
                                    {language}
                                </Dropdown.Item>
                            )
                        )}
                    </SplitButton>

                    {language === 'markdown' ?
                        (<ReactMarkdown>{answer}</ReactMarkdown>)
                        :
                        (<CodeEditor
                                value={answer}
                                language={language}
                                placeholder="Please enter code"
                                padding={5}
                                style={{
                                    marginBottom: '50px',
                                    textWrap: 'wrap'
                                }}
                                data-color-mode={'light'}
                            />
                        )}
                    {language === 'markdown' ? (
                        <div>
                            <ReactMarkdown>{code}</ReactMarkdown>
                        </div>
                    ) : (
                        <SyntaxHighlighter language={language} style={docco}>
                            {code}
                        </SyntaxHighlighter>
                    )
                    }
                </FormGroup>
            )}
            <footer className="fixed-bottom text-center bg-secondary-subtle py-11 pt-10">
                Send Email <SiGmail size={20} className={'cursor-pointer'}/>
            </footer>
        </div>
    )
}

export default Assist;