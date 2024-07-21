import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import React, {useEffect, useState} from "react";
import '../output.css';

// Check if SpeechRecognition is supported

function VoiceTranscript({setContent}) {
    const [voiceTranscript, setVoiceTranscript] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        let timer;
        if (isListening) {
            SpeechRecognition.startListening({continuous: true});
            timer = setTimeout(() => {
                SpeechRecognition.stopListening();
                setIsListening(false);
            }, 25000);  // Convert seconds to milliseconds
        }

        return () => {
            clearTimeout(timer);
            SpeechRecognition.stopListening();
        }
    }, [isListening]);

    useEffect(() => {
        console.log(transcript)
        if (transcript && isListening) {
            setVoiceTranscript(transcript);
            setContent(transcript);
        }
    }, [transcript, voiceTranscript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const startListening = async () => {
        setIsListening(true);
    }

    const stopListening = async () => {
        setVoiceTranscript(null);
        setIsListening(false);
    }

    const reset = async () => {
        await setVoiceTranscript(null);
    }

    return (
        <div className={'py-5'}>
            <div className={'font-serif font-semibold'}>
                Microphone: {listening
                ? <p className={'paragraph-transcript-on'}>on</p>
                : <p className={'paragraph-transcript-off'}>off</p>}
            </div>
            <button className={'button-style'} type="button" onClick={startListening}>
                Start
            </button>
            <button className={'button-style m-3'} type={'button'} onClick={stopListening}>
                Stop
            </button>
            <button className={'button-style m-3'} type="button" onClick={reset}>
                Reset
            </button>
        </div>
    )
}

export default VoiceTranscript;