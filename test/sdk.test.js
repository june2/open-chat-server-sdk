const OpenChat = require('../index');
const fs = require('fs-extra');
const filePath = `${__dirname}/test.mp3`;

describe('API', () => {
  let config = {
    CHATBOT_USER_ID: 'CHATBOT_USER_ID...',
    CHATBOT_TOKEN: 'CHATBOT_TOKEN...',
    CHATBOT_URL: 'CHATBOT_URL...',
    NAVER_CLIENT_ID: 'NAVER_CLIENT_ID...',
    NAVER_SECRET: 'NAVER_SECRET...',
    LANG: 'Kor',
  }

  describe('sdk test', () => {
    it('text', async () => {
      try {
        const openChat = new OpenChat(config);
        let data = await openChat.answerText('안녕');
        expect(data.version).toEqual('v2');
      } catch (err) {
        console.log(err);
      }
    });

    it('voice', async () => {
      try {
        let isExists = await fs.exists(filePath);
        if (isExists) {
          const openChat = new OpenChat(config);
          let data = await openChat.answerVoice(fs.readFileSync(filePath));
          expect(data.version).toEqual('v2');
        }
      } catch (err) {
        console.log(err);
      }
    }, 30000);
  });
});