interface SpeechRecognition {
  [key: string]: any;
}

interface webkitSpeechRecognition {
  [key: string]: any;
}

interface SpeechRecognitionEvent {
  [key: string]: any;
}

interface SpeechRecognitionErrorEvent {
  [key: string]: any;
}

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: webkitSpeechRecognition;
  new(): webkitSpeechRecognition;
};
