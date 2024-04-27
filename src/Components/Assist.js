import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
import {post} from '../Api/httpApi';
import Common from '../Types/Common';
import Navigation from "./Navigation";
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from "react-bootstrap/Alert";
import CodeEditor from '@uiw/react-textarea-code-editor';
import FormGroup from "react-bootstrap/FormGroup";
import {forEach} from 'lodash';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {Col, Row, SplitButton} from "react-bootstrap";
import _ from 'lodash';

const StyledContainer = styled(Container)`
    background-color: #ffff;
    color: white;
    padding: 8rem;
    box-shadow: black 5px 3px 3px 5px;
`;

// const Answer = styled(textarea)`
//   font-family: monospace; /* Use a monospace font for code */
//   width: 100%;
//   height: 300px;
//   padding: 10px;
//   margin: 10px 0;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
//   resize: vertical; /* Allow vertical resizing */
//   overflow: auto; /* Allow scrollbar if necessary */
// `;

const Assist = () => {
    const [content, setContent] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [embedding, setEmbedding] = useState(null);
    const [instructions, setInstructions] = useState('');
    const [status, setStatus] = useState('');
    const [messageSaved, setMessageSaved] = useState(false);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState("javascript");

        useEffect(() => {
        }, [
            embedding,
            answer,
            instructions,
            status,
            sessionId,
            spinner,
            content,
            messageSaved,
            code,
            language
        ])

        async function SetAnswerAsCallback(res) {
            setStatus(res.status);
            console.log('response data', res.data);

            if (res.status !== 200) {
                setAnswer(`Server error ${res.status}`);
            }

            if (res.status === 200) {
                if (res.data) {
                    setAnswer(res.data);
                    setSessionId(null);
                    /*
                    setSessionId(response.data.id);
                    */
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
            const url = Common.AssistUrl;
            if (content) {
                const body = {
                    content,
                    instructions: "test"
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
        if (sessionId && answer) {
            const body = {
                answer,
                sessionId: sessionId
            };
            const response = await post(Common.AssistSaveText, body, SaveTextAsCallback);
            console.log('response', response);
            return response;
        } else {
            console.log('no answer or session saved')
        }
    }

    const mapCodeStrings = () => {
        console.log(code.length);
        const mappedCode = _.map(code, (snippet, index) => {
            return (<div>{snippet}</div>);
        });
        return mappedCode;
    }

    return (

        <Container className={'container-sm'}>
            <Navigation/>
            {spinner &&
                <div>
                    <Spinner animation="border" variant="success"
                             style={{boxShadow: 'purple 12px 12px 12px'}}/>
                </div>
            }
            <Form method='post' onSubmit={handleSubmit}>
                <Form.Group>
                    <Row>
                        <Col smd={6}>
                            <Form.Control
                                column sm="1"
                                style={{boxShadow: 'blue 5px 5px 5px'}}
                                as="textarea"
                                placeholder="Ask a question"
                                className="mb-3"
                                rows={2}
                                onChange={event => QuestionToAsk(event)}
                            />
                        </Col>
                        <Col smd={6}>
                            <Form.Control
                                value={instructions || 'test'}
                                style={{boxShadow: 'blue 5px 5px 5px'}}
                                as="textarea"
                                placeholder="Instructions for Assist"
                                className="mb-3"
                                rows={2}
                                onChange={event => InstructionsForAssist(event)}
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group style={{marginBottom: '50px'}}>
                    <Button variant='primary'
                            type='submit'
                            onClick={handleSubmit}
                            style={{boxShadow: 'black 2px 5px 5px', float: 'left', marginRight: '25px'}}
                    >
                        Submit Question
                    </Button>

                    <Button onClick={SetCodeFromAnswer}
                            variant={'primary'}
                            style={{boxShadow: 'black 2px 5px 5px 2px', float: 'right'}}
                    >
                        Extract Code From Answer
                    </Button>
                    <Button onClick={SaveText}
                            variant={'primary'}
                            style={{boxShadow: 'black 2px 5px 5px 2px'}}
                    >
                        Save Text
                    </Button>
                    <SplitButton
                        key={language}
                        id={`dropdown-split-variants-${language}`}
                        variant={'info'}
                        title={language || 'Select language'}
                        style={{boxShadow: 'black 2px 2px 5px 2px', marginLeft: '15px'}}
                    >
                        <Dropdown.Item eventKey="javascript"
                                       onClick={() => setLanguage("javascript")}>javascript</Dropdown.Item>
                        <Dropdown.Item eventKey="html" onClick={() => setLanguage("html")}>html</Dropdown.Item>
                        <Dropdown.Item eventKey="csharp" onClick={() => setLanguage("csharp")}>csharp</Dropdown.Item>
                        <Dropdown.Item eventKey="css" onClick={() => setLanguage("css")}>css</Dropdown.Item>
                    </SplitButton>
                    {messageSaved &&
                        <Alert variant={'success'}>
                            {answer}
                        </Alert>
                    }

                </Form.Group>

            </Form>
            {!spinner && answer && (
                <FormGroup>
                    {/*   <Form.Control
                        style={{boxShadow: 'black 2px 2px 2px 2px'}}
                        value={answer}
                        className="mb-3"
                        as="textarea"
                        rows={20}
                        readOnly={true}
                    />*/}
                    <Row>

                        <Col smd={6}>
                            <CodeEditor
                                value={answer}
                                language={language}
                                placeholder="Please enter code"
                                // onChange={(evn) => setCode(evn.target.value)}
                                padding={5}
                                style={{
                                    boxShadow: 'black 2px 2px 2px 2px',
                                    backgroundColor: 'lightcyan',
                                    marginBottom: '50px'
                                }}
                                data-color-mode={'dark'}
                            />

                        </Col>
                        {code.length > 0 &&
                            <Col smd={"6"}>
                                <SyntaxHighlighter language={language} style={docco}>
                                    {code}
                                </SyntaxHighlighter>
                            </Col>
                        }
                    </Row>
                </FormGroup>
            )}
        </Container>
    )
}

export default Assist;