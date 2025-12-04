import { useState, useEffect, useCallback } from 'react';

interface SpeechSynthesisProps {
    onEnd?: () => void;
}

export const useSpeechSynthesis = (props: SpeechSynthesisProps = {}) => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSupported(true);

            const updateVoices = () => {
                setVoices(window.speechSynthesis.getVoices());
            };

            updateVoices();
            window.speechSynthesis.onvoiceschanged = updateVoices;

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, []);

    const speak = useCallback((text: string, voiceIndex: number = 0) => {
        if (!supported) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Select voice (prefer a decent English one if default index 0 is bad)
        // For now, we just use the provided index or default
        if (voices[voiceIndex]) {
            utterance.voice = voices[voiceIndex];
        }

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => {
            setSpeaking(false);
            if (props.onEnd) props.onEnd();
        };
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported, voices, props]);

    const cancel = useCallback(() => {
        if (!supported) return;
        setSpeaking(false);
        window.speechSynthesis.cancel();
    }, [supported]);

    return {
        supported,
        speak,
        cancel,
        speaking,
        voices,
    };
};
