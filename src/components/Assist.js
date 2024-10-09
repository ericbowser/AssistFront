import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {post} from '../api/httpApi';
import Navigation from "./Navigation";
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from "react-bootstrap/Alert";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
    far
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {Col, Row, SplitButton} from "react-bootstrap";
import ReactMarkdown from 'react-markdown';
import GenerateImage from '../api/openAiApi';
import {Lang, Model} from '../Utils/Constants';
import copy from 'copy-to-clipboard';
import {Element, onsolucroller, scroller} from 'react-scroll';
import {Image} from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Offcanvas from "react-bootstrap/Offcanvas"; // import styles

const Assist = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [askingAi, setAskingAi] = useState(Model.OpenAi);
    const [thread, setThread] = useState(null);
    const [embedding, setEmbedding] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [instructions, setInstructions] = useState('General development questions');
    const [status, setStatus] = useState('');
    const [messageSaved, setMessageSaved] = useState(false);
    const [code, setCode] = useState(null);
    const [language, setLanguage] = useState("markdown");
    const [imageUrl, setImageUrl] = useState(null);
    const [imageSize, setImageSize] = useState(350);
    const [action, setAction] = useState(null);
    const [assistant, setAssistant] = useState(false);
    const [text, setText] = useState(false);
    const [top, setTop] = useState(false);

    const scrollToElement = (element = '') => {
        scroller.scrollTo(element, {
            duration: 500,
            delay: 0,
            smooth: 'easeInOutQuart'
        });
    };

    const scrollToImage = () => {
        scroller.scrollTo('ImageUrl', {
            duration: 500,
            delay: 0,
            smooth: 'easeInOutQuart'
        });
    };

    useEffect(() => {
        if (answer) {
            scrollToElement('MarkDown')
        }
    }, [answer]);

    useEffect(() => {
        if (code) {
            scrollToElement('CodeBlock');
        }
    }, [code, spinner]);

    useEffect(() => {
        if (top) {
            scrollToElement('Top');
        }
    }, [top]);

    useEffect(() => {
    }, [
        status,
        thread,
        answer,
        question,
        messageSaved,
        language,
        imageSize,
        imageUrl,
        askingAi,
        action,
        embedding,
        assistant,
        text
    ]);

    function copyToClipBoard(text = "test") {
        copy(text);

    }

    async function SetAnswerAsCallback(res) {
        setStatus(res.status);
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

            scrollToElement('CodeBlock');
        }
    }

    function decideUrl() {
        switch (askingAi) {
            case Model.Claude:
                console.log('ClaudeAssist Url: ', process.env.CLAUDE_ASSIST_URL);
                return 'http://localhost:32636/askClaude';
            case Model.OpenAi:
                const assistUrl = assistant === 'checked'
                    ? 'http://localhost:32636/askAssist'
                    : 'http://localhost:32636/askChat';
                console.log('url', assistUrl);
                return assistUrl;
            case Model.Gemini:
                console.log('Gemini Url: ', process.env.GEMINI_ASSIST_URL);
                return process.env.GEMINI_ASSIST_URL;
            default:
                console.log('Default: ', process.env.OPENAI_ASSIST_URL);
                return process.env.OPENAI_ASSIST_URL;
        }
    }

    const handleSubmit = async (event) => {
        if (action === 'generateImage') return;
        event.preventDefault();
        try {
            const url = decideUrl();
            if (question) {
                setCode(null);
                const body = {
                    content: question
                };

                setSpinner(true);

                console.log('url: ', url);
                console.log('content : ', body.content);
                await post(url, body)
                    .then(response => {
                        if (response.status === 200) {
                            console.log('response thread: ', response.thread);
                            console.log('response answer: ', response.answer);
                            console.log('response vectors: ', response.vectors);
                            /*
                                                        setEmbedding(response.vectors);
                            */
                            setStatus(response.status);
                            setThread(response.thread);
                            setAnswer(response.answer);
                            setMessageSaved(true);
                            setSpinner(false);
                        }
                    });
            } else if (!response || response.status !== 200) {
                setAnswer(`Server error ${response.status}`);
            }

        } catch
            (err) {
            console.log(err)
            setAnswer(err);
        }
    };

    const MarkupText = async (event) => {
        if (event) {
            setText(event);
        }
    }
    const QuestionToAsk = async (event) => {
        if (event) {
            setQuestion(event);
            setLanguage('HTML');
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
        setQuestion(null);
        setQuestion(null);
        setAskingAi(null);
        setCode(null);
    }

    function clearImage() {
        setImageUrl(null);
    }

    const getImageUrl = async () => {
        setSpinner(true);
        const imageUrl = await GenerateImage(question);
        console.log('image url:', imageUrl);
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

    const saveEmbedding = async () => {
        if (embedding.length > 0) {
            const data = {
                embedding,
                prompt: content
            }
            await post(process.env.ASSIST_EMBED, data);
        }
    }

    const handleModelChange = async (model = '') => {
        console.log('setting model to ', model);
        setAskingAi(model);
    }

    return (
        <div className={'container-md h-screen'}>
            <Offcanvas>
                
            </Offcanvas>
            <div>
                <Navigation/>
            </div>
            <Alert title={'SelectModel'} variant={'info'}>Select a Model Before Asking a Question</Alert>
            <div className={'h-auto'}>
                <Element id={'Top'}/>
                {spinner && (
                    <Spinner
                        variant={'danger'}
                        className={'text-center m-20'}
                        size={100}
                    />
                )
                }
                <Form.Group>
                    <Row>
                        <Col md={'4'}>
                            <SplitButton
                                className={'w-35 text-right h-fit'}
                                key={askingAi || null}
                                id={`dropdown-split-variants-${askingAi}`}
                                variant={'info'}
                                title={'Select Model'}
                            >
                                {[Model.Gemini, Model.Claude, Model.OpenAi].map((model, index) => {
                                        console.log(model);
                                        return (
                                            <Dropdown.Item
                                                key={`${index}${model}`}
                                                eventKey={model}
                                                title={model}
                                                onClick={() => setAskingAi(model)}>
                                                {model}
                                            </Dropdown.Item>
                                        )
                                    }
                                )}
                            </SplitButton>
                        </Col>
                        <Col md={'2'}>

                            <Button className={'mr-2'}
                                    onClick={saveEmbedding}
                                    variant={'dark'}
                            >
                                Save Embedding
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
                {thread &&
                    <Alert className={'my-2'}>Thread: {thread}</Alert>
                }
                {imageUrl &&
                    <Alert className={'m-2'}>
                        {imageUrl}
                    </Alert>
                }
                <Form
                    className={'p-6 shadow-md shadow-blue-700'}
                    method='post'>
                    <Form.Group>
                        <Row className={'mb-3 p-1'}>
                            <ReactQuill
                                value={question}
                                className={'p-3'}
                                onChange={event => {
                                    setText(event);
                                    QuestionToAsk(event);
                                }
                                }/>
                        </Row>
                        <Row className={'py-3'}>
                            {/*
                            <Col md={'7'} className={'p-2'}>
                                <div>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Ask Question"
                                        rows={4}
                                        value={question || ''}
                                        disabled={askingAi === null || askingAi === ''}
                                        onChange={event => QuestionToAsk(event)}
                                    />
                                </div>
                            </Col>
*/}
                            {/*
                            <Col className={'p-2'}>
                                <div>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Instructions"
                                        rows={4}
                                        value={question || ''}
                                        onChange={event => InstructionsForAssist(event)}
                                    />
                                </div>
                            </Col>
*/}
                        </Row>
                        <Row className={'py-3'}>
                            <Col md={8}>
                                <Button
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
                            </Col>
                            <Col md={4}>
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
                            {askingAi && (
                                <div className={'w-75 h-20 my-2'}>
                                    <Alert title={'Model Enabled'}
                                           variant={'success'}>{`Currently ${askingAi} is enabled`}</Alert>
                                </div>
                            )}
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Button id={'submitquestion'}
                                        className={'mr-2'}
                                        variant='success'
                                        disabled={askingAi === null || askingAi === '' || action === 'submitQuestion'}
                                        type='submit'
                                        onClick={(e) => {
                                            setAction('askQuestion');
                                            handleSubmit(e).then(() => setAction(null));
                                        }}
                                >
                                    Submit Question
                                </Button>
                                <Button id={'imageUrl'}
                                        className={'mr-2'}
                                        variant='secondary'
                                        onClick={async (e) => {
                                            await setAction('generateImage');
                                            await getImageUrl(e)
                                            await scrollToImage();
                                        }}
                                >
                                    Generate Image
                                </Button>
                            </Col>
                            <Col md={6}>
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
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </div>
            {
                spinner &&
                <div style={{textAlign: 'center'}}>
                    <Spinner animation="border" variant='light'/>
                </div>
            }
            <Element id={'ImageUrl'}>
                {imageUrl &&
                    <Image src={imageUrl || ''}
                           alt="Generated by OpenAI"
                           width={imageSize}
                           className={'my-24'}
                    />
                }
            </Element>
            {
                !spinner && answer && (
                    <Row className={'text-white bolder'}>
                        <Col md={3}>
                            <p>Specify a language to parse code snippets:</p>
                        </Col>
                        <Col md={5}>
                            <SplitButton
                                key={language}
                                id={`dropdown-split-variants-${language}`}
                                variant={'success'}
                                title={language || 'Select language'}
                            >
                                {Lang.map((language, index) => (
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
                        <Col md={'4'}>
                            <Button className={'mx-9'}
                                    id={'setCode'}
                                    onClick={setCodeFromAnswer}
                                    variant={'primary'}
                            >
                                Extract Code From Answer
                            </Button>
                        </Col>
                        {answer && (
                            <div className={'mt-96'}>

                                <Element id={'MarkDown'}>
                                    <Col>
                                        <div className={'text-black text-xl bold mt-20 py-22'}>
                                            <Button
                                                className={'mr-2'}
                                                variant={'light'}
                                                onClick={() => copy(answer || undefined)}>
                                                Copy to Clipboard
                                            </Button>
                                            <ReactMarkdown>
                                                {answer}
                                            </ReactMarkdown>
                                        </div>
                                    </Col>
                                </Element>

                            </div>
                        )}
                    </Row>

                )
            }
            {
                question && code &&
                <Element id={'CodeBlock'}>

                    <Row className={' m-1'}>
                        <Button onClick={() => setTop(true)}>
                            Top
                        </Button>
                        <Col>
                            <SyntaxHighlighter
                                language={language}
                                style={far}>
                                {code}
                            </SyntaxHighlighter>
                        </Col>
                    </Row>

                </Element>
            }
            <footer
                className="justify-center items-center text-center navbar-gradient flex flex-col position-relative w-auto">
                <div className="container mx-auto text-center">
                    <p className="text-sm"><span>© 2024 E.R.B <a>https://erb-think.com/</a>. All rights reserved.</span>
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Assist;