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
import {ButtonGroup, Col, Row, SplitButton} from "react-bootstrap";
import VoiceTranscript from "./VoiceTranscript";
import ReactMarkdown from 'react-markdown';
import {SiGmail} from "react-icons/si";
import GenerateImage from '../Api/openAiApi';

const Assist = () => {
    const [content, setContent] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [thread, setThread] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [instructions, setInstructions] = useState('General development questions');
    const [status, setStatus] = useState('');
    const [messageSaved, setMessageSaved] = useState(false);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState("markdown");
    const [imageUrl, setImageUrl] = useState(null);

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
        imageUrl
    ]);

    async function SetAnswerAsCallback(res) {
        setStatus(res.status);
        console.log('response data', res.data);

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

                console.log('body and content', body, content)
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

    const SaveText = async event => {
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
    }

    function clear() {
        setContent(null);
    }

    function clearBoth() {
        setContent(null);
        setInstructions(null);
    }
    
    const getImageUrl = async () => {
        setSpinner(true);
        const imageUrl = await GenerateImage(content);
        console.log(imageUrl);
        if (imageUrl) {
            setImageUrl(imageUrl);
        }
        setSpinner(false);
    }

    return (
        <div className={'container mx-auto '}>
            <Navigation/>
            <Form.Group>
                <VoiceTranscript setContent={setContent}/>
                <Button variant='primary'
                        type='submit'
                        onClick={handleSubmit}
                        style={{boxShadow: 'black 2px 2px 2px'}}
                >
                    Submit Question
                </Button>
                <Button variant='secondary'
                        type='submit'
                        onClick={getImageUrl}
                        style={{boxShadow: 'black 2px 2px 2px'}}
                >
                    Generate Image
                </Button>
                <Button onClick={SetCodeFromAnswer}
                        variant={'info'}
                        style={{boxShadow: 'black 2px 2px 2px'}}
                >
                    Extract Code From Answer
                </Button>
                <Button onClick={SaveText}
                        variant={'danger'}
                        style={{boxShadow: 'black 2px 2px 2px'}}
                >
                    Save Text
                </Button>
                {spinner &&
                    <div style={{textAlign: 'center'}}>
                        <Spinner animation="border" variant="success"/>
                    </div>
                }
                {messageSaved &&
                    <Alert variant={'success'}>
                        {answer}
                    </Alert>
                }
            </Form.Group>
            {thread &&
                <div className={'text-bg-success text-xxl-start'}>Thread: {thread}</div>
            }
            <div>
                <Form className={'flex flex-col md:flex-row gap-4'}
                      method='post'
                      onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control
                            style={{boxShadow: 'black 2px 2px 2px'}}
                            as="textarea"
                            placeholder="Ask a question"
                            className="flex-1 p-2"
                            rows={2}
                            value={content || ''}
                            onChange={event => QuestionToAsk(event)}
                        />
                        <Form.Control
                            value={instructions || ''}
                            style={{boxShadow: 'black 2px 2px 2px'}}
                            as="textarea"
                            placeholder="Instructions for Assist"
                            className="flex-2 p-2"
                            rows={2}
                            onChange={event => InstructionsForAssist(event)}
                        />
                        <Button variant={'success'} onClick={() => clear()}>Clear</Button>
                        <Button variant={'warning'} onClick={() => clearBoth()}>Clear Both</Button>
                    </Form.Group>
                </Form>
            </div>
            {imageUrl &&
                <img src={imageUrl} height={250} width={250} alt={'image'} className={'m-5'}/>
            }
            {!spinner && answer && (
                <>
                    <FormGroup>
                        <Row>
                            <Col smd={6}>
                                <SplitButton
                                    key={language}
                                    id={`dropdown-split-variants-${language}`}
                                    variant={'info'}
                                    title={language || 'Select language'}
                                    style={{boxShadow: 'black 2px 2px 5px 2px', marginLeft: '15px'}}
                                >
                                    <Dropdown.Item eventKey="javascript"
                                                   onClick={() => setLanguage("javascript")}>javascript</Dropdown.Item>
                                    <Dropdown.Item eventKey="html"
                                                   onClick={() => setLanguage("html")}>html</Dropdown.Item>
                                    <Dropdown.Item eventKey="csharp"
                                                   onClick={() => setLanguage("csharp")}>csharp</Dropdown.Item>
                                    <Dropdown.Item eventKey="css" onClick={() => setLanguage("css")}>css</Dropdown.Item>
                                    <Dropdown.Item eventKey="markdown"
                                                   onClick={() => setLanguage("markdown")}>markdown</Dropdown.Item>
                                    <Dropdown.Item eventKey="python"
                                                   onClick={() => setLanguage("python")}>python</Dropdown.Item>
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
                                                boxShadow: 'black 2px 2px 2px 2px',
                                                marginBottom: '50px'
                                            }}
                                            data-color-mode={'light'}
                                        />
                                    )}
                            </Col>
                            {code.length > 0 &&
                                <Col smd={"6"}>
                                    {language === 'markdown' ?
                                        (<ReactMarkdown>{code}</ReactMarkdown>)
                                        : (
                                            <SyntaxHighlighter language={language} style={docco}>
                                                {code}
                                            </SyntaxHighlighter>
                                        )
                                    }
                                </Col>
                            }
                        </Row>
                    </FormGroup>
                </>
            )}
            <footer className="fixed-bottom text-center bg-secondary-subtle">
                <a href="mailto:ericryanbowser@gmail.com">
                    Send Email <SiGmail size={20} className={'cursor-pointer'}/>
                </a>
            </footer>
        </div>
    )
}

export default Assist;