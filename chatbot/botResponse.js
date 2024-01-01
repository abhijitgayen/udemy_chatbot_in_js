// load model here
const fs = require('fs');
const { NlpManager } = require('node-nlp');

const data = fs.readFileSync('chatbot/model.nlp', 'utf8');
const manager = new NlpManager();
manager.import(data);

const botResponse = async (user_message) => {
    const response = await manager.process(user_message);
    // console.log(response);
    return_response = {
        "message": response?.answer,
        "intent": response?.intent,
        "score": response?.score,
        "language": response?.language
    }
    return return_response
}

module.exports ={
    botResponse
}