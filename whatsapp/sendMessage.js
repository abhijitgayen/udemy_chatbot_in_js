const axios = require('axios');


// button_list = [
//     {
//         "id": "<LIST_SECTION_2_ROW_1_ID>",
//         "title": "<SECTION_2_ROW_1_TITLE>",
//         "description": "<SECTION_2_ROW_1_DESC>"
//     }
// ]
//// max length be 10

// message_buttons = [
//     {
//         "type": "reply",
//         "reply": {
//             "id": "<UNIQUE_BUTTON_ID_1>",
//             "title": "<BUTTON_TITLE_1>"
//         }
//     }
// ]
//// max length:3

const getSimpleMessageMetaData = (user_mob_number, message_to_send) => {
    var message_type = message_to_send.message_type
    var message_data = message_to_send.message_data

    var  meta_data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": user_mob_number
    }

    switch(message_type) {
        case "button":
            meta_data["type"] = "interactive"
            meta_data["interactive"] = {
                "type": "button",
                "body": {
                    "text": message_data.body
                },
                "action":{
                    "buttons": message_data.message_buttons
                }
            }
        case "list":
            meta_data["type"] = "interactive"
            meta_data["interactive"] = {
                "type": "list",
                "header": {
                    "type": "text",
                    "text": message_data.header
                },
                "body": {
                    "text": message_data.body
                },
                "footer": {
                    "text": message_data.footer
                },
                "action": {
                    "button": message_data.button_text,
                    "sections": [
                        {
                            "title": message_data.button_text,
                            "rows":  message_data.button_list
                        }
                    ]
                }
            }
        case "text":
            meta_data["type"] = "text"
            meta_data["text"] = {
                "preview_url": false,
                "body": message_data.body
            }
        case "image":
            meta_data["type"] = "image",
            meta_data["image"] = {
                "link": message_data.link,
                "caption": message_data.body
            }
        case "document":
            meta_data["type"] = "document",
            meta_data["document"] = {
                "link": message_data.link,
                "caption": message_data.body,
                "filename": message_data.filename
            }
        default:
            meta_data["type"] = "text"
            meta_data["text"] = {
                "preview_url": false,
                "body": message_data?.body
            }
    }

    if (message_data?.message_context_id){
        meta_data["context"] = {
            "message_id": message_data.message_context_id
        }
    }

    return meta_data
}


const sendMessage = async(phone_no_id,user_mob_number,token,message_to_send) => {

    var metaData = getSimpleMessageMetaData(user_mob_number, message_to_send)
    var config = {
        method: 'post',
        url: `https://graph.facebook.com/v17.0/${phone_no_id}/messages`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data : metaData
    };

    axios(config)
    .then(function (response) {
    console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
    console.log(error);
    });
    
}

module.exports ={
    sendMessage
}