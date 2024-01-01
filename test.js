const {botResponse} = require('./chatbot/botResponse')


console.log("Now you are testing chatbot. IF YOU WANT TO EXIT FROM TEST JUST ENTER 'exit'")

// Listen for 'data' event on 'stdin' stream
process.stdin.on('data', (data) => {
    // Data is a Buffer, so convert it to a string 
    // trim leading/trailing whitespace
    const input = data.toString().trim();
    
    
    // Process the input
    console.log(`You: ${input}`);

    // Exit the process
    if (input.toLowerCase() === 'exit'){
        console.log('Bot: Ok see You Soon');
        process.exit();
    }

    // get bot response 
    botResponse(input).then((bot_response) => {
        console.log(`Bot: ${bot_response?.message}`);
    })

  });
  
  // Write a prompt to the terminal
  console.log("Let Start Chat With Bot. Enter You Message: ");