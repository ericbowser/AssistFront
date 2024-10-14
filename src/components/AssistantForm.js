import react from "react";
import Row from "react-bootstrap/Row";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ReactQuill from "react-quill";
import Alert from "react-bootstrap/Alert";
import {Model} from "../utils/constants";
import React from "react";

function AssistForm
(
    setQuestion = () => {},
    setText = () => {},
    question,
    clear,
    clearImage = () => {},
    handleImageSize = () => {},
    askingAi,
    assistant,
    setAssistant,
    action,
    setAction,
    handleSubmit,
    getImageUrl,
    scrollToImage
) {
    return (
        <Form
            className={'p-6 shadow-md shadow-blue-700'}
            method='post'>
            <Form.Group>
                <Button className={'m-2'}
                        variant={'outline-info'}
                        onClick={() => setQuestion('Generate few JavaScript Snippets')}>
                    A few JavaScript Snippets
                </Button>
                <Button variant={'outline-info'}
                        onClick={() => setQuestion('Generate few C# snippets')}>
                    A few C# Snippets
                </Button>
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
    );
}

export default AssistForm;