import React, { useState } from 'react';

const VoiceAssistant = () => {
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = (event:any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      // Handle user command based on transcript
    };
    recognition.start();
  };

  return (
    <div>
      <button onClick={startListening}>Start Listening</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default VoiceAssistant;