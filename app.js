const express = require('express');
const app = express();

const path = require('path');
let initial_path = path.join(__dirname, "chatbot");
app.use(express.static(initial_path));
app.use(express.json());


const {botResponse} = require('./chatbot/botResponse')

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/bot_response', (req, res) =>{
    console.log(req.query);
    if (req.query?.message){
        botResponse(req.query.message).then((response) =>{
            res.send(response);
        });
    }
    else{
        res.send('No response sorry Not working')
    }
});

app.post('/bot_response', (req, res) =>{
    const user_message = req.body?.message;
    if(user_message){
        botResponse(user_message).then((response) =>{
            res.send(response);
        });
    }
    else{
        res.send('No response sorry Not working')
    }
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

