import React, {useState, useMemo, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
import {post} from '../Api/httpApi';
import Common from '../Types/Common';
import Navigation from "./Navigation";

const StyledContainer = styled(Container)`
    background-color: lightgreen;
    padding: 2%;
    color: black;
    box-shadow: black 2px 2px 10px;
`;

const SubmitForm = styled(Button)`
    border: outset;
    color: ghostwhite;
`;

const Assist = () => {
	const [question, setQuestion] = useState(null);
	const [answer, setAnswer] = useState(null);
	const [embedding, setEmbedding] = useState(null);
	const [instructions, setInstructions] = useState('');
	const [status, setStatus] = useState('');

	useEffect(() => {
	}, [question])

	useEffect(() => {
		if (answer) {
			console.log(answer)
		}
	}, [answer])

	useEffect(() => {
	}, [instructions])

	useEffect(() => {
	}, [embedding])

	useEffect(() => {
	}, [status]);

	async function SetAnswerAsCallback(response) {
		if (response) {
			setStatus(response.status);
			console.log(response.data);
			setAnswer(response.data[0].message.content);
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const url = Common.AssistUrl;
			const body = {
				question,
				instructions
			};
			console.log('body to send to Assist', body);
			const response = await post(url, body, SetAnswerAsCallback);
			console.log("Response object with metadata", response);
		} catch (err) {
			console.dir(err);
			alert(err);
		}
	};

	const QuestionToAsk = async (event) => {
		if (event && event.target && event.target.value) {
			const question = event.target.value;
			setQuestion(question);
		}
	}

	const InstructionsForAssist = event => {
		if (event && event.target && event.target.value) {
			const instructions = event.target.value;
			setInstructions(instructions);
		}
	}

	const SaveText = async event => {
		if (event) {
			const body = event.target.value;
			const response = await post(Common.AssistSaveText, body, SetAnswerAsCallback);
			console.log('response', response);
			return response;
		}
	}

	return (
		<Container>
			<Navigation/>
			<StyledContainer>
				<h2 className={'mb-3'}>
					Assist
				</h2>
				<Form method='post' onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Control
							as="textarea"
							placeholder="Instructions for Assist"
							className="mb-3"
							onChange={event => InstructionsForAssist(event)}
						/>
						<Form.Control
							as="textarea"
							placeholder="Ask a question"
							className="mb-3"
							rows={5}
							onChange={event => QuestionToAsk(event)}
						/>
					</Form.Group>
					<Form.Group>
						<div style={{'marginTop': '50px'}}>
							<SubmitForm variant='primary' type='submit' onClick={handleSubmit}>
								Submit Question
							</SubmitForm>
						</div>
					</Form.Group>
				</Form>
				{status && (
					<div>
						<Form.Control
							value={answer || 'no response'}
							className="mb-3"
							as="textarea"
							rows={20}
							readOnly={true}
						/>
						<Button onClick={SaveText}>
							Save Text
						</Button>
					</div>
				)
				}
			</StyledContainer>
		</Container>
	);
}

export default Assist;