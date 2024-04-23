﻿import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
import {post} from '../Api/httpApi';
import Common from '../Types/Common';
import Navigation from "./Navigation";
import Spinner from 'react-bootstrap/Spinner';
import Alert from "react-bootstrap/Alert";
import CodeEditor from '@uiw/react-textarea-code-editor';
import FormGroup from "react-bootstrap/FormGroup";
import {forEach, isEmpty} from 'lodash';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {GridCol1Row1, GridCol2Row1, GridWrapper} from "../styles";
import {Col, Row} from "react-bootstrap";

const StyledContainer = styled(Container)`
    background-color: #ffff;
    color: white;
    padding: 8rem;
    box-shadow: black 5px 30px 30px 5px;
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
    const [code, setCode] = useState([]);

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
        code
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
                forEach(codeString => {
                    console.log(codeString)
                })
                // Remove the backticks and any language specifier from each code block.
                const matched = match[0].replace(/^```\w*\n?|```$/g, '');
                codeString.push(matched);
            }

            setCode(codeString);
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
                    instructions
                };

                console.log('body and content', body, content)
                setSpinner(true);

                const response = await post(url, body, SetAnswerAsCallback);

                console.log('response', response);
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
            console.log("setting content state: ", content);
            setContent(content);
        }
    }

    const InstructionsForAssist = event => {
        if (event?.target?.value) {
            const instructions = event.target.value;
            setInstructions(instructions);
            console.log("setting instructions state: ", instructions)
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
                                style={{boxShadow: 'blue 5px 5px 5px'}}
                                as="textarea"
                                placeholder="Instructions for Assist"
                                className="mb-3"
                                rows={2}
                                onChange={event => InstructionsForAssist(event)}
                            />
                        </Col>
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
                    </Row>
                </Form.Group>
                <Form.Group>
                        <span style={{'marginTop': '50px'}}>
                            <Button variant='primary'
                                    type='submit'
                                    onClick={handleSubmit}
                                    style={{boxShadow: 'blue 5px 5px 5px', margin: '50px 0 30px 0'}}
                            >
                                Submit Question
                            </Button>
                        </span>
                </Form.Group>
            </Form>
            {!spinner && answer && (
                <FormGroup>
                    <Form.Control
                        style={{boxShadow: 'purple 5px 5px 5px'}}
                        value={answer}
                        className="mb-3"
                        as="textarea"
                        rows={20}
                        readOnly={true}
                    />
                    <CodeEditor
                        value={code}
                        language="js"
                        placeholder="Please enter JS code."
                        // onChange={(evn) => setCode(evn.target.value)}
                        padding={5}
                        style={{
                            boxShadow: 'purple 5px 5px 5px',
                            backgroundColor: 'lightcyan',
                            marginBottom: '50px'
                        }}
                        data-color-mode={'light'}
                    />
                    <SyntaxHighlighter language="JavaScript" style={docco}>
                        {code}
                    </SyntaxHighlighter>
                </FormGroup>
            )}
            <span>
                    <Button onClick={SaveText} variant={'primary'}
                            style={{boxShadow: 'purple 5px 5px 5px'}}
                    >
                        Save Text
                    </Button>
                     <Button onClick={SetCodeFromAnswer}
                             variant={'primary'}
                             style={{boxShadow: 'orange 12px 12px 12px', float: 'right'}}
                     >
                        Extract Code From Answer
                    </Button>
                </span>
            {messageSaved &&
                <Alert variant={'success'}>
                    {answer}
                </Alert>
            }
        </Container>
    )
        ;
}

export default Assist;