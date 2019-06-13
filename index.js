'use strict';

const HmacSHA256 = require('crypto-js/hmac-sha256');
const EncBase64 = require('crypto-js/enc-base64');
const axios = require('axios');

const OpenChat = class {
  constructor(conifg) {
    if (!conifg.CHATBOT_USER_ID) throw new Error('CHATBOT_USER_ID is necessary ');
    if (!conifg.CHATBOT_TOKEN) throw new Error('CHATBOT_TOKEN is necessary ');
    if (!conifg.CHATBOT_URL) throw new Error('CHATBOT_URL is necessary ');
    if (!conifg.NAVER_CLIENT_ID) throw new Error('NAVER_CLIENT_ID is necessary ');
    if (!conifg.NAVER_SECRET) throw new Error('NAVER_SECRET is necessary ');
    if (!(this instanceof OpenChat)) {
      return new OpenChat(conifg);
    }
    conifg || (conifg = {});
    this._chatbotUserId = conifg.CHATBOT_USER_ID;
    this._chatbotToken = conifg.CHATBOT_TOKEN;
    this._chatbotUrl = conifg.CHATBOT_URL;
    this._naverCientId = conifg.NAVER_CLIENT_ID;
    this._naverSecret = conifg.NAVER_SECRET;
    this._lang = conifg.LANG || 'Kor';
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

  async _getSst(file) {
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

  async answerText(text) {
    return await this._getText(text);
  }

  async answerVoice(file) {
    let { text } = await this._getSst(file);
    return await this._getText(text);
  }

};
module.exports = OpenChat;
