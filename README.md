# open-chat-server-sdk

## This app include the following library:
- crypto-js
- axios

## This app are using the following 3rd party API
- SST (Speech-To-Text) : [naveropenapi](https://apidocs.ncloud.com/ko/ai-naver/clova_speech_recognition/stt/)
- ChatBot : [ChatBot custom api](http://docs.ncloud.com/ko/chatbot/chatbot-3-7.html)

## Node.js (Install)

Requirements:

- Node.js
- npm (Node.js package manager)

```bash
npm install open-chat
```

### Usage
```javascript
import OpenChat from 'OpenChat';

const test = async () => {
  let config = {
    CHATBOT_USER_ID: 'Input CHATBOT_USER_ID ...',
    CHATBOT_TOKEN: 'Input CHATBOT_TOKEN ...',
    CHATBOT_URL: 'Input CHATBOT_URL ...',
    NAVER_CLIENT_ID: 'Input NAVER_CLIENT_ID ...',
    NAVER_SECRET: 'Input NAVER_SECRET ...',
    LANG: 'Kor',
  }
  const openChat = new OpenChat(config);
  let data = await openChat.answerText('input text');
  let data = await openChat.answerVoice('input voice data');
}
```

### How to run unit test
```bash
npm install
npm run test
```
