window.chatOpen = false;


const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
}

if(false)
window.addEventListener('mousemove', (e) => {
	mouse.x = e.x;
    mouse.y = e.y;

    if(connected === true){
        const player = players[selfId];
        const dY = mouse.y - player.y + camera.y;
        const dX = mouse.x - player.x + camera.x;
        //console.log('magnitude', Math.min(300,Math.sqrt(dY**2+dX**2)), 'dY', dY, 'dX', dX, 'angle', Math.atan2(dY, dX));
        send({angle: Math.atan2(dY, dX), magnitude: Math.min(300,Math.sqrt(dY**2+dX**2))});
    }
});


let input = {
    up: false,
    down: false,
    left: false,
    right: false,
}

function trackKeys(event, input) {
    if(document.activeElement === ref.chatInput){
        chatOpen = true;
        ref.chatInput.placeholder = "";
    } else {
        chatOpen = false;
    }
    if (event.repeat && !chatOpen) return event.preventDefault();

    // dealing with chat
    if (event.code === 'Enter') {
        if (chatOpen && event.type === 'keydown') {
            // send chat message
            ref.chatDiv.classList.add('hidden');
            const text = ref.chatInput.value.trim();
            send({chat: text});

            chatOpen = false;
            ref.chatInput.value = '';
            ref.chatInput.blur();
        } else if (event.type === 'keydown') {
            // focus chat
            chatOpen = true;
            ref.chatDiv.classList.remove('hidden');
            ref.chatInput.focus();
        }
        return;
    }
    if (chatOpen) return;



}
const keyState = {};

window.addEventListener('keydown', (e) => {
    keyState[e.code] = true;
    //console.log(e.code, "down");
});

window.addEventListener('keyup', (e) => {
    keyState[e.code] = false;
});

let stopped = true;

window.addEventListener('update', (delta) => {
    
    if (connected === true && !chatOpen) {
        const player = players[selfId];
        let dY = 0;
        let dX = 0;
        if (keyState['ArrowUp'] || keyState['KeyW']) {
          dY -= 1;
        }
        if (keyState['ArrowDown'] || keyState['KeyS']) {
          dY += 1;
        }
        if (keyState['ArrowLeft'] || keyState['KeyA']) {
          dX -= 1;
        }
        if (keyState['ArrowRight'] || keyState['KeyD']) {
          dX += 1;
        }
        
        const magnitude = Math.sqrt(dY ** 2 + dX ** 2) * 300;
        let angle = Math.atan2(dY, dX);
        //console.log('magnitude', magnitude, 'dY', dY, 'dX', dX, 'angle', angle, 'rad', angle * 180 / Math.PI);
        if (magnitude !== 0) {
            stopped = false;
          send({ 
            angle: angle,
            magnitude: magnitude 
          });
        }else if(!stopped){
            stopped = true;
            send({ 
                angle: angle,
                magnitude: magnitude 
              });
        }
      } 
      
}); 


document.body.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    // mouse movement
    mouse.x = touch.pageX;
    mouse.y = touch.pageY;

    if(connected === true){
        const player = players[selfId];
        const dY = mouse.y - player.y + camera.y;
        const dX = mouse.x - player.x + camera.x;
        send({angle: Math.atan2(dY, dX), magnitude: Math.min(300,Math.sqrt(dY**2+dX**2))});
    }
}, false);

ref.canvas.addEventListener('mousedown', (e) => {
	// attacking = true;
    if (e.button === 0) {
        send({attack: true});
    } else if (e.button === 2){
        send({defend: true});
    }
    event.preventDefault();
});

ref.canvas.addEventListener('mouseup', (e) => {
    // attacking = false;
    if (e.button === 0) {
        send({attack: false});
    } else if (e.button === 2){
        send({defend: false});
    }
    event.preventDefault();
});

window.addEventListener("contextmenu", e => e.preventDefault());

let mobileAttackingState = false;
let mobileDefendingState = false;

ref.attackButton.addEventListener('click', (e) => {
    mobileAttackingState = !mobileAttackingState;
    send({attack: mobileAttackingState});
}, false);

ref.defendButton.addEventListener('click', (e) => {
    mobileDefendingState = !mobileDefendingState;
    send({defend: mobileDefendingState});
}, false);