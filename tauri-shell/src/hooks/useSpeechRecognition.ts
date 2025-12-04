import { useState, useEffect, useRef } from 'react';

export interface UseSpeechRecognitionProps {
    onResult?: (text: string) => void;
    onEnd?: () => void;
}

export const useSpeechRecognition = ({ onResult, onEnd }: UseSpeechRecognitionProps = {}) => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [supported, setSupported] = useState(false);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            setSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false; // Stop after one sentence for now
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (onResult) {
                    // Prefer final, fallback to interim
                    onResult(finalTranscript || interimTranscript);
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setError(event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
                if (onEnd) onEnd();
            };

            recognitionRef.current = recognition;
        } else {
            setSupported(false);
            setError("Speech Recognition not supported in this browser.");
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Failed to start recognition:", e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    return {
        isListening,
        startListening,
        stopListening,
        error,
        supported
    };
};
