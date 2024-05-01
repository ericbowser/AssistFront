import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
import {post} from '../Api/httpApi';
import Navigation from "./Navigation";
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from "react-bootstrap/Alert";
import CodeEditor from '@uiw/react-textarea-code-editor';
import FormGroup from "react-bootstrap/FormGroup";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {ButtonGroup, ButtonToolbar, Col, Row, SplitButton, ToggleButtonGroup} from "react-bootstrap";
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
    const [instructions, setInstructions] = useState('');
    const [status, setStatus] = useState('');
    const [messageSaved, setMessageSaved] = useState(false);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState("javascript");

    useEffect(() => {
    }, [answer, instructions, status, sessionId, spinner, content, messageSaved, code, language]);

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
            const url = process.env.ASSIST_URL;
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
            const response = await post(process.env.ASSIST_SAVE, body, SaveTextAsCallback);
            console.log('response', response);
            return response;
        } else {
            console.log('no answer or session saved')
        }
    }

    /*
      const mapCodeStrings = () => {
          console.log(code.length);
          return _.map(code, (snippet, index) => {
              return (<div>{snippet}</div>);
          });
      }
      */

    /*  const callAnkrApi = async () => {
          const res = await balances();
          console.log(res);
      }*/

    return (
        <Container>
            <Navigation/>
            {spinner &&
                <div style={{textAlign: 'center'}}>
                    <Spinner animation="border" variant="success"/>
                </div>
            }
            <Form.Group style={{marginBottom: '15px', textAlign: 'center'}}>
                <ButtonGroup size="sm">
                    <Button variant='primary'
                            type='submit'
                            onClick={handleSubmit}
                            style={{boxShadow: 'black 2px 2px 2px'}}
                    >
                        Submit Question
                    </Button>
                    <Button onClick={SetCodeFromAnswer}
                            variant={'primary'}
                            style={{boxShadow: 'black 2px 2px 2px'}}
                    >
                        Extract Code From Answer
                    </Button>
                    <Button onClick={SaveText}
                            variant={'primary'}
                            style={{boxShadow: 'black 2px 2px 2px'}}
                    >
                        Save Text
                    </Button>
                </ButtonGroup>
                {messageSaved &&
                    <Alert variant={'success'}>
                        {answer}
                    </Alert>
                }
            </Form.Group>
            <Form method='post' onSubmit={handleSubmit}>
                <Form.Group>
                    <Row>
                        <Col smd={6}>
                            <Form.Control
                                style={{boxShadow: 'black 2px 2px 2px'}}
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
                                style={{boxShadow: 'black 2px 2px 2px'}}
                                as="textarea"
                                placeholder="Instructions for Assist"
                                className="mb-3"
                                rows={2}
                                onChange={event => InstructionsForAssist(event)}
                            />
                        </Col>
                    </Row>
                </Form.Group>

            </Form>
            {!spinner && answer && (
                <>
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
                    <FormGroup>
                        <Row>
                            <Col smd={6}>
                                <CodeEditor
                                    value={answer}
                                    language={language}
                                    placeholder="Please enter code"
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
                </>
            )}
        </Container>
    )
}

export default Assist;