import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {post} from '../api/httpApi';
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
import GenerateImage from '../api/openAiApi';
import LANG from '../docs/languages';
import copy from 'copy-to-clipboard';
import {Element, scroller} from 'react-scroll';
import {setContext} from "@sentry/react";

const Assist = () => {
    const [openAiQuestion, setOpenAiQuestion] = useState('');
    const [claudeQuestion, setClaudeQuestion] = useState('');
    const [askingAi, setAskingAi] = useState(null);
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

    const scrollToElement = () => {
        scroller.scrollTo('GeneratedImage', {
            duration: 500,
            delay: 0,
            smooth: 'easeInOutQuart'
        });
    };

    useEffect(() => {
        if (code) {
            scrollToElement();
        }
    }, [answer, spinner, code]);

    useEffect(() => {
    }, [
        instructions,
        status,
        thread,
        openAiQuestion,
        claudeQuestion,
        messageSaved,
        language,
        imageSize,
        imageUrl,
        askingAi
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

    const setCodeFromAnswer = () => {
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
            scrollToElement();
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
            const url = 'http://localhost:32636/askAssist';
            if (openAiQuestion || claudeQuestion) {
                const body = {
                    content: openAiQuestion || claudeQuestion,
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

    const QuestionToAskOpenAi = async (event) => {
        if (event?.target?.value) {
            const content = event.target.value;
            setOpenAiQuestion(content);
            setAskingAi('OpenAi');
        }
    }
    const QuestionToAskClaude = async (event) => {
        if (event?.target?.value) {
            const content = event.target.value;
            setClaudeQuestion(content);
            setAskingAi('Claude');
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
        setOpenAiQuestion(null);
        setClaudeQuestion(null);
        setAskingAi(null);
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
            await setImageUrl(imageUrl);
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
        <div className={'text-black container'}>
            <div>
                <Navigation/>
            </div>
            <Form.Group>
                <VoiceTranscript setContent={setClaudeQuestion}/>
                {/*
                <VoiceTranscript setContent={setContent}/>
*/}
                <Button id={'submitquestion'}
                        variant='outline-success'
                        type='submit'
                        onClick={e => handleSubmit(e)}
                >
                    Submit Question
                </Button>
                <Button variant='outline-secondary'
                        type='submit'
                        onClick={getImageUrl}
                >
                    Generate Image
                </Button>
                <Button onClick={setCodeFromAnswer}
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
                    <Row>
                        <Col md={4}>
                            <Form.Control
                                as="textarea"
                                placeholder="Ask OpenAI"
                                rows={4}
                                disabled={askingAi === 'Claude'}
                                value={openAiQuestion || ''}
                                onChange={event => QuestionToAskOpenAi(event)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                as="textarea"
                                placeholder="Ask Claude"
                                rows={4}
                                disabled={askingAi === 'OpenAi'}
                                value={claudeQuestion || ''}
                                onChange={event => QuestionToAskClaude(event)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                value={instructions || ''}
                                as="textarea"
                                placeholder="Instructions for Assist"
                                rows={4}
                                onChange={event => InstructionsForAssist(event)}
                            />

                        </Col>
                    </Row>
                    <Row className={'py-3'}>
                        <Col md={10}>
                            <Button variant={'outline-dark'} onClick={() => clear()}>Clear Question</Button>
                            <Button variant={'outline-dark'} onClick={() => clearImage()}>Clear Image</Button>
                            <Button
                                className={'text-black'}
                                variant={'outline-light'}
                                onClick={() => copy(answer || '')}>
                                Copy to Clipboard
                            </Button>
                        </Col>
                        <Col md={2}>
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
                    className={'m-150'}
                />
            }
            {!spinner && answer && (
                <div className={'text-md-start bold border-black shadow-sm bg-white rounded px-8 inset text-black'}>
                    <Row className={'py-4'}>
                        <Col md={5} >
                            <p>Specify a language to parse code snippets:</p>
                        </Col>
                        <Col md={7}>
                            <SplitButton
                                key={language}
                                id={`dropdown-split-variants-${language}`}
                                variant={'success'}
                                title={language || 'Select language'}
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
                        </Col>
                    </Row>

                    {language === 'markdown' ?
                        (
                            <ReactMarkdown>{answer}</ReactMarkdown>
                        )
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
                    <Element name="GeneratedImage" className="element">
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
                    </Element>
                </div>
            )}
            <footer className="mt-8 fixed-bottom text-center bg-secondary-subtle">
                Send Email <SiGmail size={20} className={'cursor-pointer'}/>
            </footer>
        </div>
    )
}

export default Assist;