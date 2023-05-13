let lastRenderTime = Date.now();
let renderDt = 0;

window.lastUpdateTime = Date.now();
let updateDt = 0;

let winArrow = new Image();
winArrow.src = './gfx/arrow.png';

function formatNumber(number, reference){
  if (reference > 1e10){
    return Math.floor(number/1e8)/10+"B";
  } else if (reference > 1e9){
    return Math.floor(number/1e7)/100+"B";
  } else if (reference > 1e8){
    return Math.floor(number/1e6)+"M";
  } else if (reference > 1e7){
    return Math.floor(number/1e5)/10+"M";
  } else if (reference > 1e6){
    return Math.floor(number/1e4)/100+"M";
  } else if (reference > 1e5){
    return Math.floor(number/1e3)+"K";
  } else if (reference > 1e4){
    return Math.floor(number/1e2)/10+"K";
  } else if (reference > 1e3){
    return Math.floor(number/1e1)/100+"K";
  }
  else{
    return number;
  }
}
function formatType(type){
    switch(type){
        case 'Rock':
            return 'Rock';
        case 'evilflower':
            return 'Evil Flower';
        case 'diep':
            return 'Diep Tank';
        case 'mopemouse':
            return 'Mope Mouse';
        default:
            console.log('undefined type for formatType: ' + type);
            break;
    }
}
function render(){
    // idea for minimap: always focused on a 4x4 unmoving square, with you inside one
    // level 1-3 or whatever rendered right below and your position is shown inside the map you're in
    renderDt = Date.now()-lastRenderTime;
    lastRenderTime = Date.now();

    updateDt = Date.now()-window.lastUpdateTime;
    window.lastUpdateTime = Date.now();

    petalSlots = petalSlots.filter(p => p.dead === false);

    // simulate players for the dt for rendering smoothness
    if(updateDt < 100){
        for(let id in players){
            players[id].simulate(updateDt);
        }
        for(let i = 0; i < enemies.length; i++){
            enemies[i].simulate(updateDt);
        }
    }

    // filling bg
    ctx.fillStyle = '#1ea661'//'#7eef6d'//'#7eef6d'//'#4d5f56';//'#20a464';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if(!window.me){
        requestAnimationFrame(render);
        return;
    };
    // interpolate camera to me
    const player = window.me();

    camera.x = /*player.x - canvas.width/2*/expLerp(camera.x, player.x - canvas.width/2, 1/8);
    camera.y = /*player.y - canvas.height/2*/expLerp(camera.y, player.y - canvas.height/2, 1/8);

    // ctx.beginPath();
    // ctx.fillStyle = 'red';
    // ctx.arc(canvas.width/2, canvas.height/2, 23.5, 0, Math.PI*2);
    // ctx.fill();
    // ctx.closePath();

    // drawing tiles
    ctx.strokeStyle = '#1b9f5c'//'#66c258'//'#3e42b8'//'#415048';
    ctx.lineWidth = 2;
    const tileOffset = {x: -camera.x%47, y: -camera.y%47};

    for (let x = 0; x < canvas.width; x += 47) {
        ctx.beginPath();
        ctx.moveTo(x+tileOffset.x, 0);
        ctx.lineTo(x+tileOffset.x, canvas.height);
        ctx.stroke();
        ctx.closePath();
    }

    for (let y = 0; y < canvas.height; y += 47) {
        ctx.beginPath();
        ctx.moveTo(0, y+tileOffset.y);
        ctx.lineTo(canvas.width, y+tileOffset.y);
        ctx.stroke();
        ctx.closePath();
    }

    ctx.translate(-camera.x, -camera.y);

    // out of bounds borders
    // we make a large stroke and draw >:)

    ctx.strokeStyle = 'black';
    ctx.globalAlpha = 0.33;
    ctx.lineWidth = 20000;
    ctx.strokeRect(-10000, -10000, dimensions.x + 20000, dimensions.y + 20000);
    ctx.globalAlpha = 1;
    ctx.lineWidth = 3;

    for(let i = 0; i < petalSlots.length; i++){
        petalSlots[i].render();
    }

    // drawing all players
    for(let id in players){
        players[id].render();
    }

     let fightingBoss = false;
    for(let i = 0; i < enemies.length; i++){
        enemies[i].render();
         if (enemies[i].rarity == "boss" && enemies[i].dead != true){
             fightingBoss = true;
         }
    }

    //if(window.won){
        // const arrowSize = {
        //     x: Math.min(200, Math.floor(dimensions.x/3)),
        //     y: Math.min(200, Math.floor(dimensions.y/3)),
        // }
        // ctx.translate(dimensions.x, dimensions.y/2);
        // ctx.drawImage(winArrow,-arrowSize.x,-arrowSize.y/2,arrowSize.x,arrowSize.y);

        // ctx.translate(-dimensions.x/2, dimensions.y/2);

        // ctx.rotate(Math.PI/2);
        // ctx.drawImage(winArrow,-arrowSize.x,-arrowSize.y/2,arrowSize.x,arrowSize.y);
        // ctx.rotate(-Math.PI/2);

        // ctx.translate(-dimensions.x/2, -dimensions.y/2);

        // ctx.rotate(Math.PI);
        // ctx.drawImage(winArrow,-arrowSize.x,-arrowSize.y/2,arrowSize.x,arrowSize.y);
        // ctx.rotate(-Math.PI);

        // ctx.translate(dimensions.x/2, -dimensions.y/2);

        // ctx.rotate(Math.PI*3/2);
        // ctx.drawImage(winArrow,-arrowSize.x,-arrowSize.y/2,arrowSize.x,arrowSize.y);
        // ctx.rotate(-Math.PI*3/2);
        // ctx.translate(-dimensions.x/2, 0);

        // ant hole idea:
        // when the wave is finiished, 2-4 ant holes (each at the edges of the screen) get placed for the different directions
        // they interpolate in size.
        // when you enter one, it
    //}

    ctx.translate(camera.x, camera.y);

    for(let i = 0; i < equippedPetalSlots.length; i++){
        equippedPetalSlots[i].render();
    }

    if (fightingBoss == true){
      //BOSS BAR
      for(let i = 0; i < enemies.length; i++){
      if (enemies[i].rarity == "boss" && enemies[i].type != "bullet" && enemies[i].dead != true && enemies[i].type != undefined){
        /*
        ctx.fillStyle = `white`
        ctx.strokeStyle = "black";
        ctx.lineWidth = 10;
        ctx.font = '400 80px Ubuntu'
        ctx.strokeText(enemies[i].type, window.innerWidth/2, 55);
        ctx.fillText(enemies[i].type, window.innerWidth/2, 55);
        ctx.font = '300 20px Ubuntu'
        ctx.strokeText("Boss", window.innerWidth/2, 100);
        ctx.fillText("Boss", window.innerWidth/2, 100);



        ctx.lineWidth = 18;
        let widthPx = window.innerWidth * 1/2 * enemies[i].hp/enemies[i].maxHp;

        ctx.lineCap = "round";
        ctx.strokeStyle = "black";

        ctx.beginPath();
        ctx.moveTo(window.innerWidth/4, 130);
        ctx.lineTo(window.innerWidth/4 * 3, 130);
        ctx.stroke();

        ctx.lineWidth = 14;
        ctx.strokeStyle = "white";

        ctx.beginPath();
        ctx.moveTo(window.innerWidth/4, 130);
        ctx.lineTo(window.innerWidth/4 + widthPx, 130);
        ctx.stroke();
        */




        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - canvas.width/6, canvas.height/85, canvas.width/3, canvas.height/21, canvas.height/42);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = '#73de36'
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - canvas.width/6 + 3, canvas.height/85 + 3, Math.max(0,canvas.width/3*enemies[i].renderHp/enemies[i].maxHp - 6), canvas.height/21 - 6, canvas.height/42, Math.max(0,canvas.width/3 - 6));

        // ctx.roundRect(this.renderX - this.renderRadius*1.5+1.5, this.renderY + this.renderRadius*1.7+1.5, (this.renderRadius*3-3)*this.renderHp/this.maxHp, Math.max(0,this.renderRadius*0.35-3), this.renderRadius*0.25);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = `white`// not logging...
        ctx.strokeStyle = "#0f0f0f";
        ctx.lineWidth = canvas.height/450;// zoom out
        ctx.font = `400 ${36/window.devicePixelRatio}px Ubuntu`
        ctx.textBaseline = 'middle';

        let reference = enemies[i].maxHp;
        ctx.strokeText(formatType(enemies[i].type)+" Boss: "+formatNumber(enemies[i].renderHp, reference)+"/"+formatNumber(enemies[i].maxHp, reference), window.innerWidth/2, canvas.height/85 + canvas.height / 42);
        ctx.fillText(formatType(enemies[i].type)+" Boss: "+formatNumber(enemies[i].renderHp, reference)+"/"+formatNumber(enemies[i].maxHp, reference), window.innerWidth/2, canvas.height/85 + canvas.height / 42);// why stroke and fill? we dont want numbers lol this isnt some goofy ui idk numbers are fine but i gotta format them to be like K or M or B or etc
        }
      }
    }

    if(window.disconnected){
        if(window.won === true){
            initRenderWin();
        } else {
            ctx.font = '800 30px Ubuntu';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            const disconnectReason = window.disconnectReason;
            ctx.strokeText(disconnectReason, canvas.width/2, canvas.height/2 - 70);
            ctx.fillText(disconnectReason, canvas.width/2, canvas.height/2 - 70);
            
        }
    } 
    
    if(window.mipmap){
        //draw background on top left
        ctx.fillStyle = 'black'; // yoooo
        ctx.fillRect(0, 0, 100, 100);
        for(let i = 0; i < windows.mipmap.length; i++){
            const {x, y, active} = windows.mipmap[i];
            if(active){
                ctx.fillStyle = 'black';
                ctx.fillRect(x, y, 10, 10);
            }

        }
    }
}

let winTimer = 60;
let lastTime = Date.now();
function initRenderWin(){
    let renderWinInterval = setInterval(() => {
        if(winTimer > 0){
            renderWin();

            const p = window.me();
            ctx.translate(-p.x+canvas.width/2, -p.y+canvas.height/2);
            p.render();
            p.magnitude = 0;
            p.impulse = {x: 0, y: 0};
            p.simulate(1000 / 60);
            ctx.translate(p.x-canvas.width/2, p.y-canvas.height/2);
        } else {
            clearInterval(renderWinInterval);
            setInterval(() => {
                ctx.globalAlpha = 0.1;
                // this will look seamless but we still need to render bg and text so that player doesnt have past frames visible
                ctx.fillStyle = '#1ea661';
                ctx.fillRect(0,0,canvas.width,canvas.height);

                ctx.globalAlpha = 1;
                ctx.font = '800 42px Ubuntu';
                ctx.lineWidth = 3;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.textAlign = 'center';
                ctx.strokeText('You Win!', canvas.width/2, canvas.height/2 - 70);
                ctx.fillText('You Win!', canvas.width/2, canvas.height/2 - 70);

                const p = window.me();
                ctx.translate(-p.x+canvas.width/2, -p.y+canvas.height/2);
                p.render();
                p.simulate(1000 / 60);
                ctx.translate(p.x-canvas.width/2, p.y-canvas.height/2);
            }, 1000 / 60)
        }
    }, 1000 / 60)
}

let filledAmount = 0;
function renderWin(){
    // fade in a rectangle
    ctx.fillStyle = '#1ea661';
    ctx.globalAlpha = (1/(1-filledAmount)) / winTimer;// we just layer things on top of eachother so at the end it will be 1
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.globalAlpha = 1;
    ctx.font = '800 42px Ubuntu';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.strokeText('You Win!', canvas.width/2, canvas.height/2 - 70);
    ctx.fillText('You Win!', canvas.width/2, canvas.height/2 - 70);

    filledAmount += 1/winTimer;

    winTimer--;
}

function interpolate(start, end, time) {
    return start * (1 - time) + end * time;
}

// if amount is 1/8, then we get 1/8 closer to the target every frame
function expLerp(start, end, amount){
    const difference = end-start;
    return start + difference*amount;
}

function interpolateDirection(d1, d2, angleIncrement) {
    let dir;
    let dif = d1-d2;
    let angleDif = Math.atan2(Math.sin(dif), Math.cos(dif));
    if (Math.abs(angleDif) >= angleIncrement*clamp(0,10000,Math.abs(angleDif)**0.6*0.55)) {
        if (angleDif < 0) {
            dir = 1;
        } else {
            dir = -1;
        }
    } else {
        // we're close enough to snap
        return d1 ? interpolateLinearDirection(d1, d2, 0.1) : d2;
    }
    return d1 + dir*angleIncrement*clamp(0,10000,Math.abs(angleDif)**0.6*0.55);
}

function interpolateFixedDirection(d1, d2, angleIncrement) {
    let dir;
    let dif = d1-d2;
    let angleDif = Math.atan2(Math.sin(dif), Math.cos(dif));
    if (Math.abs(angleDif) >= angleIncrement) {
        if (angleDif < 0) {
            dir = 1;
        } else {
            dir = -1;
        }
    } else {
        return d1 ? interpolateLinearDirection(d1, d2, 0.1) : d2;
    }
    return d1 + dir*angleIncrement;
}

// function interpolateLinearDirection(d1, d2, angleIncrement) {
//     let dir;
//     let dif = d1-d2;
//     let angleDif = Math.atan2(Math.sin(dif), Math.cos(dif));
//     if (angleDif < 0) {
//         dir = 1;
//     } else {
//         dir = -1;
//     }
//     return d1 + dir*angleIncrement*Math.abs(angleDif);
// }

function shortAngleDist(a0,a1) {
    var max = Math.PI*2;
    var da = (a1 - a0) % max;
    return 2*da % max - da;
}

function interpolateLinearDirection(a0,a1,t) {
    return a0 + shortAngleDist(a0,a1)*t;
}

function clamp(min,max,x){
    return(Math.min(max,Math.max(min,x)));
}