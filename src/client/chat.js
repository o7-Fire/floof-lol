const chatDiv = document.querySelector('.chat-div');


function appendChatMessage(msg){
    const chatMessage = document.createElement('div');
    //color support time
    //chatMessage.innerHTML = msg; //DANGEROUS DO NOT USE

    if(chatMessage.innerHTML.setHTML){//sanitized
        chatMessage.setHTML(colorize(msg));
    }else{
        chatMessage.innerText = msg;
    }
    
    chatMessage.className = "chat-message";
    chatDiv.prepend(chatMessage);
    
}
window.addEventListener('onConnected', function(e){
    //we just connected, so we need to get rid of the history
    chatDiv.innerHTML = '';
    appendChatMessage('Connected to server');
});
window.addEventListener('onDisconnected', function(e){
    appendChatMessage('Disconnected from server');
});

window.addEventListener('onPlayerJoin', function(e){
    appendChatMessage(`${e.player.playerId} joined the game`);
});
window.addEventListener('onPlayerLeave', function(e){
    appendChatMessage(`${e.player.playerId} left the game`);
});


//check if properly formatted
//only make new span if another color is found
//[#hex] message [color] message2 [notvalid message [or this] message2] message3
//<span style="color: #hex">message</span> <span style="color: color">message2 [notvalid message [or this] message2] message3</span>

function colorize(msg){
    let str = '';
    let color = '';
    let colorFlag = false;
    for(let i = 0; i < msg.length; i++){
        if(msg[i] === '['){
            colorFlag = true;
            color = '';
        }else if(msg[i] === ']'){
            colorFlag = false;
            str += `<span style="color: ${color}">`;
        }else if(colorFlag){
            color += msg[i];
        }else{
            str += msg[i];
        }
    }
    return str;
}
// UNUSED
const chars = ['a','b','c','$'];
function generateChatMsg(){
    let str = '';
    for(let i = 0; i < 10; i++){
        str += chars[Math.floor(chars.length*Math.random())];
    }
    return str;
}

function testMessage(){
    appendChatMessage(`[#ff0000]${generateChatMsg()} [#00ff00]${generateChatMsg()} [#0000ff]${generateChatMsg()}`);
    setTimeout(testMessage, 1000);
}