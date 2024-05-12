import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {createSpeechlySpeechRecognition} from '@speechly/speech-recognition-polyfill';
import React, {useEffect, useState} from "react";

function VoiceTranscript({setContent}) {
    const [voiceTranscript, setVoiceTranscript] = useState(null);

    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            setVoiceTranscript(transcript);
            setContent(transcript);
        }
    }, [transcript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const startListening = async () => {
        await SpeechRecognition.startListening();
    }

    const stopListening = async () => {
        await SpeechRecognition.stopListening();
    }

    const reset = () => {
        setVoiceTranscript(null);
    }

    return (
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={startListening}>Start</button>
            <button onClick={stopListening}>Stop</button>
            <button onClick={reset}>Reset</button>
        </div>
    )
}

export default VoiceTranscript;