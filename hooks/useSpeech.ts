
import { useCallback } from 'react';

export const useSpeech = () => {
    const synth = window.speechSynthesis;

    const speak = useCallback((text: string) => {
        if (synth.speaking) {
            synth.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.1;
        utterance.pitch = 1;
        
        // Find a suitable voice
        const voices = synth.getVoices();
        let selectedVoice = voices.find(voice => voice.name === 'Google US English');
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang === 'en-US');
        }
        if(selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        synth.speak(utterance);
    }, [synth]);

    const cancel = useCallback(() => {
        if (synth.speaking) {
            synth.cancel();
        }
    }, [synth]);

    return { speak, cancel };
};
