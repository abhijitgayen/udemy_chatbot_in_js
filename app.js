const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require("dotenv").config();

const token = process.env.TOKEN
const myToken = process.env.MYTOKEN;
const phone_no_id = process.env.PHONE_NO_ID;


const path = require('path');
let initial_path = path.join(__dirname, "chatbot");

const app = express();
app.use(bodyParser.json());
app.use(express.static(initial_path));
app.use(express.json());


const {botResponse} = require('./chatbot/botResponse')
const {sendMessage} = require('./whatsapp/sendMessage.js')
const {sendCommunication} = require('./whatsapp/communication.js')

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/bot_response', (req, res) =>{
    const user_message = req.body?.message;
    if(user_message){
        botResponse(user_message).then((response) =>{
            res.send(response);
        });
    }
    else{
        res.send({
            "message": 'i am able to give answer at this time'
        })
    }
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
//send template message to whatsapp
app.post('/send_template_message', async(req,res)=>{
    const coming_body = req.body
    if (coming_body?.user_mobile_no){
        let user_mobile_no =coming_body.user_mobile_no
        let response = await sendCommunication(phone_no_id,token,user_mobile_no)
        res.send(response)
    }
    else{
        res.send('send me correct paload message')
    }    
})

// whatsapp webhooks
app.get('/webhooks', (req, res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    if (mode && token) {
        if (mode === "subscribe" && token === myToken) {
          res.status(200).send(challange);
        } else {
          res.status(403);
        }
    }
})
// get messsage from whatsapp
app.post('/webhooks', (req, res) => {
    let body_param = req.body;

    if (body_param?.object){
        let message_entry = body_param?.entry
        let message_changes = message_entry[0]?.changes
        let message_metadata = message_changes[0]?.value?.metadata
        let message_contacts = message_changes[0]?.value?.contacts
        let messages = message_changes[0]?.value?.messages
        
        let user_message = messages[0]?.text?.body
        let user_message_type = messages[0]?.type
        if (user_message){
            botResponse(user_message).then((response) =>{
                var message_to_send = {
                    'message_type':'text',
                    'message_data': {
                        'body' : response.message
                    }
                }
                sendMessage(phone_no_id,'917044136740',token,message_to_send)
                // need to send message to whatsapp again
            });
        }
        console.log('messages',messages);
        res.sendStatus(200);
    }
    else{
        res.sendStatus(404);
    }

})



