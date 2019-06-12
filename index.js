'use strict';

const HmacSHA256 = require('crypto-js/hmac-sha256');
const EncBase64 = require('crypto-js/enc-base64');
const axios = require('axios');

const OpenChat = class {
  constructor(options) {
    if (!(this instanceof OpenChat)) {
      return new OpenChat(options);
    }
    options || (options = {});
    this._chatbotUserId = options.CHATBOT_USER_ID;
    this._chatbotToken = options.CHATBOT_TOKEN;
    this._chatbotUrl = options.CHATBOT_URL;
    this._naverCientId = options.NAVER_CLIENT_ID;
    this._naverSecret = options.NAVER_SECRET;
    this._lang = options.LANG || 'Kor';
  }

  async _getText(text) {
    try {
      let body = {
        version: 'v2',
        userId: this._chatbotUserId,
        timestamp: new Date().getTime(),
        bubbles: [
          {
            type: 'text',
            data: {
              description: text
            }
          }
        ],
        event: 'send'
      }
      let data = JSON.stringify(body);
      let apiToken = this._chatbotToken;
      let token = HmacSHA256(data, apiToken).toString(EncBase64);
      const url = this._chatbotUrl;
      const option = {
        url: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'cache-control': 'no-cache',
          'X-NCP-CHATBOT_SIGNATURE': token
        },
        data: data
      };
      let res = await axios(option);
      if (res.data) res.data.text = text;
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  _getSst(file) {
    try {
      const clientId = this._naverCientId;
      const clientSecret = this._naverSecret;
      const language = this._lang;
      const url = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=${language}`;
      const option = {
        url: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-NCP-APIGW-API-KEY-ID': clientId,
          'X-NCP-APIGW-API-KEY': clientSecret
        },
        data: file
      };
      let res = await axios(option);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async answerText() {
    return await this._getText(text);
  }

  async answerVoice(file) {
    let { text } = await sst(file);    
    return await this._getText(text);
  }

};
module.exports = OpenChat;
