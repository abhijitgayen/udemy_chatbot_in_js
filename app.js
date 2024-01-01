const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
let initial_path = path.join(__dirname, "chatbot");

const app = express();
app.use(bodyParser.json());
app.use(express.static(initial_path));
app.use(express.json());


const {botResponse} = require('./chatbot/botResponse')

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



