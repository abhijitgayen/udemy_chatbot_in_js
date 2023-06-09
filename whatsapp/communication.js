const axios = require('axios');


const sendCommunication = async (phon_no_id,token,user_number) => {
    templateMetaData = getTemplateData(user_number)

    var config = {
        method: 'post',
        url: `https://graph.facebook.com/v17.0/${phon_no_id}/messages`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data : templateMetaData
    };
    
    try{
        let resposne = await axios(config)
        if (resposne?.data?.messages[0]?.id){
            return {
                'message':'message was successfully sent',
                'message_id': resposne?.data?.messages[0]?.id,
                'user_mobile_number': resposne?.data?.contacts[0]?.input
            }
        }
        return {
            'message':'failed to send message',
            'error': resposne.data
        }
            
    }
    catch(err) {
        return {
            'message':'failed to send message',
            'error': err
        }
    }
}

const getTemplateData = (user_number) =>{
    var templateMetaData = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": user_number,
        "type": "template",
        "template": {
            "name": "hello_world",
            "language": {
            "code": "en_US"
            }
        }
    });
    return templateMetaData
}

module.exports ={
    sendCommunication
}







