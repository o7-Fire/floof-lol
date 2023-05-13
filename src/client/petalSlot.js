// plan: we have petal slots equipped rendered at the top left of the screen in a line
/*
    #/////////////
    #/////////////
    #/////////////
    #/////////////
    #/////////////
    #///////////// <- slashes are the screen and hashtags are the petal slots
    //////////////
    //////////////
    //////////////
*/

let rarityToFillStyle = {
    common: '#7eef6d',
    unusual: '#ffe65d',
    rare: '#4d52e3',
    epic: '#861fde',
    legendary: '#de1f1f',
    omnipotent: '#969696',
    boss: '#4d5f56',
    supreme: '#5c4a39'
}

let rarityToStrokeStyle = {
    common: '#66c258',
    unusual: '#cfba4b',
    rare: '#3e42b8',
    epic: '#6d19b4',
    legendary: '#b41919',
    omnipotent: '#787878',
    boss: '#404040',
    supreme: '#3d352d'
}

class PetalSlot {
    constructor(init){
        switch(init.type) {
            case 'basicpetalslot':
                return new BasicPetalSlot(init);
                break;
            case 'rockpetalslot':
                return new RockPetalSlot(init);
                break;
            case 'dieppetalslot':
                return new DiepPetalSlot(init);
            case 'bubblepetalslot':
                return new BubblePetalSlot(init);
            case "peapetalslot":
                return new PeaPetalSlot(init);
            case "cactuspetalslot":
                return new CactusPetalSlot(init);
            default:
                console.log('petalSlot type is not defined new petalSlot petalSlot.js');
                break;
        }
    }
}

class CactusPetalSlot {
    constructor(init){
        this.x = init.x;
        this.y = init.y;

        this.r = init.r;

        this.size = this.r;// /Math.sqrt(2);

        this.renderSize = 0;
        this.initialSize = this.size;

        this.rotationOffset = Math.PI/2;

        this.type = 'cactuspetalslot';
        this.rarity = init.rarity;

        this.fillStyle = rarityToFillStyle[this.rarity];
        this.strokeStyle = rarityToStrokeStyle[this.rarity];

        // to give the agar.io in and out effect
        this.renderOscillatorCounter = 0;

        this.deadTimer = null;
        this.dead = false;

        this.oscillateMultiplier = 1;
        if(init.isStationary === true){
            this.oscillateMultiplier = 0;
            this.initialX = this.x;
            this.initialY = this.y;
        }

        this.id = init.id;
    }
    render(){
        if(this.deadTimer !== null){
            ctx.globalAlpha = this.renderSize/this.initialSize;
            this.deadTimer--;
            if(this.deadTimer <= 0){
                this.dead = true;
            }
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,Math.PI,0.22),Math.PI,0.025);//interpolateDirection(this.rotationOffset, 0, 0.3);
            this.r *= 0.9;
            this.size *= 0.9;
        } else {
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,0,0.32),0,0.033);
        }

        this.renderOscillatorCounter += 0.05;
        if(this.renderOscillatorCounter > Math.PI){
            this.renderOscillatorCounter -= Math.PI;
        }

        this.renderSize = interpolate(this.renderSize, this.size, 0.1)+this.oscillateMultiplier*Math.sin(this.renderOscillatorCounter)/8;

        ctx.lineWidth = 4.25;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationOffset);

        ctx.globalAlpha *= 0.5;
        ctx.fillStyle = '#18864e';
        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2-ctx.lineWidth-1,-this.renderSize/2-ctx.lineWidth-1,this.renderSize+ctx.lineWidth*2+2,this.renderSize+ctx.lineWidth*2+2, 5);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 2;

        if(this.rarity === 'supreme'){
            ctx.fillStyle = `hsl(${(Date.now()/12)%360}, 38%, 36%)`;
            ctx.strokeStyle = `hsl(${(Date.now()/12)%360}, 26%, 24%)`;
        } else {
            ctx.fillStyle = this.fillStyle;
            ctx.strokeStyle = this.strokeStyle;
        }


        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2,-this.renderSize/2,this.renderSize,this.renderSize, 6*this.r/canvas.width);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //ctx.miterLimit = 2;
        ctx.font = '800 9px Ubuntu';
        ctx.letterSpacing = "1px";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.fontKerning = "none";

        ctx.strokeText('Cactus', 0, this.renderSize/4+1.5);
        ctx.fillText('Cactus', 0, this.renderSize/4+1.5);

        ctx.drawImage(cactusImg, -this.renderSize*0.3, -this.renderSize*0.3, this.renderSize*0.6, this.renderSize*0.6);
        ctx.rotate(-this.rotationOffset);
        ctx.translate(-this.x, -this.y);

        //ctx.miterLimit = 10;
        ctx.globalAlpha = 1;
    }
}

class PeaPetalSlot {
    constructor(init){
        this.x = init.x;
        this.y = init.y;

        this.r = init.r;

        this.size = this.r;// /Math.sqrt(2);

        this.renderSize = 0;
        this.initialSize = this.size;

        this.rotationOffset = Math.PI/2;

        this.type = 'peapetalslot';
        this.rarity = init.rarity;

        this.fillStyle = rarityToFillStyle[this.rarity];
        this.strokeStyle = rarityToStrokeStyle[this.rarity];

        // to give the agar.io in and out effect
        this.renderOscillatorCounter = 0;

        this.deadTimer = null;
        this.dead = false;

        this.oscillateMultiplier = 1;
        if(init.isStationary === true){
            this.oscillateMultiplier = 0;
            this.initialX = this.x;
            this.initialY = this.y;
        }

        this.id = init.id;
    }
    render(){
        if(this.deadTimer !== null){
            ctx.globalAlpha = this.renderSize/this.initialSize;
            this.deadTimer--;
            if(this.deadTimer <= 0){
                this.dead = true;
            }
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,Math.PI,0.22),Math.PI,0.025);//interpolateDirection(this.rotationOffset, 0, 0.3);
            this.r *= 0.9;
            this.size *= 0.9;
        } else {
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,0,0.32),0,0.033);
        }

        this.renderOscillatorCounter += 0.05;
        if(this.renderOscillatorCounter > Math.PI){
            this.renderOscillatorCounter -= Math.PI;
        }

        this.renderSize = interpolate(this.renderSize, this.size, 0.1)+this.oscillateMultiplier*Math.sin(this.renderOscillatorCounter)/8;

        ctx.lineWidth = 4.25;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationOffset);

        ctx.globalAlpha *= 0.5;
        ctx.fillStyle = '#18864e';
        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2-ctx.lineWidth-1,-this.renderSize/2-ctx.lineWidth-1,this.renderSize+ctx.lineWidth*2+2,this.renderSize+ctx.lineWidth*2+2, 5);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 2;

        if(this.rarity === 'supreme'){
            ctx.fillStyle = `hsl(${(Date.now()/12)%360}, 38%, 36%)`;
            ctx.strokeStyle = `hsl(${(Date.now()/12)%360}, 26%, 24%)`;
        } else {
            ctx.fillStyle = this.fillStyle;
            ctx.strokeStyle = this.strokeStyle;
        }


        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2,-this.renderSize/2,this.renderSize,this.renderSize, 6*this.r/canvas.width);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //ctx.miterLimit = 2;
        ctx.font = '800 9px Ubuntu';
        ctx.letterSpacing = "1px";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.fontKerning = "none";

        ctx.strokeText('Pea', 0, this.renderSize/4+1.5);
        ctx.fillText('Pea', 0, this.renderSize/4+1.5);

        ctx.drawImage(peaImg, -this.renderSize*0.3, -this.renderSize*0.3, this.renderSize*0.6, this.renderSize*0.6);
        ctx.rotate(-this.rotationOffset);
        ctx.translate(-this.x, -this.y);

        //ctx.miterLimit = 10;
        ctx.globalAlpha = 1;
    }
}

class BasicPetalSlot {
    constructor(init){
        this.x = init.x;
        this.y = init.y;

        this.r = init.r;

        this.size = this.r;// /Math.sqrt(2);

        this.renderSize = 0;
        this.initialSize = this.size;

        this.rotationOffset = Math.PI/2;

        this.type = 'basicpetalslot';
        this.rarity = init.rarity;

        this.fillStyle = rarityToFillStyle[this.rarity];
        this.strokeStyle = rarityToStrokeStyle[this.rarity];

        // to give the agar.io in and out effect
        this.renderOscillatorCounter = 0;

        this.deadTimer = null;
        this.dead = false;

        this.oscillateMultiplier = 1;
        if(init.isStationary === true){
            this.oscillateMultiplier = 0;
            this.initialX = this.x;
            this.initialY = this.y;
        }

        this.id = init.id;
    }
    render(){
        if(this.deadTimer !== null){
            ctx.globalAlpha = this.renderSize/this.initialSize;
            this.deadTimer--;
            if(this.deadTimer <= 0){
                this.dead = true;
            }
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,Math.PI,0.22),Math.PI,0.025);//interpolateDirection(this.rotationOffset, 0, 0.3);
            this.r *= 0.9;
            this.size *= 0.9;
        } else {
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,0,0.32),0,0.033);
        }

        this.renderOscillatorCounter += 0.05;
        if(this.renderOscillatorCounter > Math.PI){
            this.renderOscillatorCounter -= Math.PI;
        }

        this.renderSize = interpolate(this.renderSize, this.size, 0.1)+this.oscillateMultiplier*Math.sin(this.renderOscillatorCounter)/8;

        ctx.lineWidth = 4.25;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationOffset);

        ctx.globalAlpha *= 0.5;
        ctx.fillStyle = '#18864e';
        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2-ctx.lineWidth-1,-this.renderSize/2-ctx.lineWidth-1,this.renderSize+ctx.lineWidth*2+2,this.renderSize+ctx.lineWidth*2+2, 5);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 2;

        if(this.rarity === 'supreme'){
            ctx.fillStyle = `hsl(${(Date.now()/12)%360}, 38%, 36%)`;
            ctx.strokeStyle = `hsl(${(Date.now()/12)%360}, 26%, 24%)`;
        } else {
            ctx.fillStyle = this.fillStyle;
            ctx.strokeStyle = this.strokeStyle;
        }


        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2,-this.renderSize/2,this.renderSize,this.renderSize, 6*this.r/canvas.width);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //ctx.miterLimit = 2;
        ctx.font = '800 9px Ubuntu';
        ctx.letterSpacing = "1px";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.fontKerning = "none";

        ctx.strokeText('Basic', 0, this.renderSize/4+1.5);
        ctx.fillText('Basic', 0, this.renderSize/4+1.5);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#cfcfcf';

        ctx.beginPath();
        ctx.arc(0, -this.renderSize/10, 7.5, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.rotate(-this.rotationOffset);
        ctx.translate(-this.x, -this.y);

        //ctx.miterLimit = 10;
        ctx.globalAlpha = 1;
    }
}

class RockPetalSlot {
    constructor(init){
        this.x = init.x;
        this.y = init.y;

        this.initialX = init.initialX;
        this.initialY = init.initialY;

        this.r = init.r;
        this.size = this.r;// /Math.sqrt(2);

        this.renderSize = 0;
        this.initialSize = this.r;

        this.rotationOffset = Math.PI*3;

        this.type = 'rockpetalslot';
        this.rarity = init.rarity;

        this.fillStyle = rarityToFillStyle[this.rarity];
        this.strokeStyle = rarityToStrokeStyle[this.rarity];

        // to give the agar.io in and out effect
        this.renderOscillatorCounter = 0;

        this.generateVerticies();

        this.deadTimer = null;
        this.dead = false;

        this.oscillateMultiplier = 1;
        if(init.isStationary === true){
            this.oscillateMultiplier = 0;
            this.initialX = this.x;
            this.initialY = this.y;
        }

        this.id = init.id;
    }
    render(){
        if(this.deadTimer !== null){
            ctx.globalAlpha = (this.renderSize/this.initialSize)**2;
            this.deadTimer--;
            if(this.deadTimer <= 0){
                this.dead = true;
            }
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,Math.PI,0.22),Math.PI,0.025);//interpolateDirection(this.rotationOffset, 0, 0.3);
            this.r *= 0.9;
            this.size *= 0.9;
        } else {
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,0,0.32),0,0.033);
        }

        this.renderX = interpolate(this.x, this.initialX, 0.1);
        this.renderY = interpolate(this.y, this.initialY, 0.1);

        this.renderOscillatorCounter += 0.05;
        if(this.renderOscillatorCounter > Math.PI){
            this.renderOscillatorCounter -= Math.PI;
        }

        this.renderSize = interpolate(this.renderSize, this.size, 0.1)+this.oscillateMultiplier*Math.sin(this.renderOscillatorCounter)/8;

        ctx.lineWidth = 4.25;

        ctx.translate(this.renderX, this.renderY);
        ctx.rotate(this.rotationOffset);

        ctx.globalAlpha *= 0.5;
        ctx.fillStyle = '#18864e';
        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2-ctx.lineWidth-1,-this.renderSize/2-ctx.lineWidth-1,this.renderSize+ctx.lineWidth*2+2,this.renderSize+ctx.lineWidth*2+2, 5);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 2;

        if(this.rarity === 'supreme'){
            ctx.fillStyle = `hsl(${(Date.now()/12)%360}, 38%, 36%)`;
            ctx.strokeStyle = `hsl(${(Date.now()/12)%360}, 26%, 24%)`;
        } else {
            ctx.fillStyle = this.fillStyle;
            ctx.strokeStyle = this.strokeStyle;
        }

        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2,-this.renderSize/2,this.renderSize,this.renderSize, 6*this.r/canvas.width);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.font = '800 9px Ubuntu';
        ctx.letterSpacing = "1px";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.fontKerning = "none";

        ctx.strokeText('Rock', 0, this.renderSize/4+1.5);
        ctx.fillText('Rock', 0, this.renderSize/4+1.5);

        ctx.fillStyle = '#777777';
        ctx.strokeStyle = '#606060';

        ctx.lineWidth = 4;

        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(this.getVertexX(0), this.getVertexY(0));
        for(let i = 0; i < this.verticies.length; i++){
            ctx.lineTo(this.getVertexX(i), this.getVertexY(i));
        }
        ctx.lineTo(this.getVertexX(0), this.getVertexY(0));

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.lineCap = 'butt';

        ctx.rotate(-this.rotationOffset);
        ctx.translate(-this.renderX, -this.renderY);

        ctx.globalAlpha = 1;
    }
    generateVerticies(){
        this.verticies = [];

        // i is the angle in radians
        for(let i = 0; i < Math.PI*2; i+= Math.PI*2/5){
            // generate a point randomly offset
            this.verticies.push({
                x: Math.cos(i),
                y: Math.sin(i),
            })
        }
    }
    getVertexX(i){
        return this.verticies[i].x*this.renderSize/8;
    }
    getVertexY(i){
        return this.verticies[i].y*this.renderSize/8 - this.renderSize/10;
    }
}

class DiepPetalSlot {
    constructor(init){
        this.x = init.x;
        this.y = init.y;

        this.r = init.r;

        this.size = this.r;// /Math.sqrt(2);

        this.renderSize = 0;
        this.initialSize = this.size;

        this.rotationOffset = Math.PI/2;

        this.type = 'dieppetalslot';
        this.rarity = init.rarity;

        this.fillStyle = rarityToFillStyle[this.rarity];
        this.strokeStyle = rarityToStrokeStyle[this.rarity];

        // to give the agar.io in and out effect
        this.renderOscillatorCounter = 0;

        this.deadTimer = null;
        this.dead = false;

        this.oscillateMultiplier = 1;
        if(init.isStationary === true){
            this.oscillateMultiplier = 0;
            this.initialX = this.x;
            this.initialY = this.y;
        }

        this.id = init.id;

        this.tankAngle = -Math.PI/2//Math.random()*Math.PI*2;//-Math.PI*0.88;
    }
    render(){
        if(this.deadTimer !== null){
            ctx.globalAlpha = this.renderSize/this.initialSize;
            this.deadTimer--;
            if(this.deadTimer <= 0){
                this.dead = true;
            }
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,Math.PI,0.22),Math.PI,0.025);//interpolateDirection(this.rotationOffset, 0, 0.3);
            this.r *= 0.9;
            this.size *= 0.9;
        } else {
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,0,0.32),0,0.033);
        }

        this.renderOscillatorCounter += 0.05;
        if(this.renderOscillatorCounter > Math.PI){
            this.renderOscillatorCounter -= Math.PI;
        }

        this.renderSize = interpolate(this.renderSize, this.size, 0.1)+this.oscillateMultiplier*Math.sin(this.renderOscillatorCounter)/8;

        ctx.lineWidth = 4.25;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationOffset);

        ctx.globalAlpha *= 0.5;
        ctx.fillStyle = '#18864e';
        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2-ctx.lineWidth-1,-this.renderSize/2-ctx.lineWidth-1,this.renderSize+ctx.lineWidth*2+2,this.renderSize+ctx.lineWidth*2+2, 5);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 2;

        if(this.rarity === 'supreme'){
            ctx.fillStyle = `hsl(${(Date.now()/12)%360}, 38%, 36%)`;
            ctx.strokeStyle = `hsl(${(Date.now()/12)%360}, 26%, 24%)`;
        } else {
            ctx.fillStyle = this.fillStyle;
            ctx.strokeStyle = this.strokeStyle;
        }

        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2,-this.renderSize/2,this.renderSize,this.renderSize, 6*this.r/canvas.width);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //ctx.miterLimit = 2;
        ctx.font = '800 9px Ubuntu';
        ctx.letterSpacing = "1px";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.fontKerning = "none";

        ctx.strokeText('Tank', 0, this.renderSize/4+1.5);
        ctx.fillText('Tank', 0, this.renderSize/4+1.5);

        ctx.lineWidth = 3;//?

        // tank barrel
        ctx.fillStyle = '#989898';
        ctx.strokeStyle = '#737373';

        ctx.translate(-this.renderSize/10, -this.renderSize/10);

        ctx.rotate(this.tankAngle);
        ctx.beginPath();
        ctx.roundRect(-7.5/2.2, 0, 7.5/1.1, 7.5*1.8, 1);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.rotate(-this.tankAngle);

        // tank body
        ctx.fillStyle = '#00b0df';
        ctx.strokeStyle = '#0085a9';

        ctx.beginPath();
        ctx.arc(0, 0, 7.5, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.translate(this.renderSize/10, this.renderSize/10);

        ctx.rotate(-this.rotationOffset);
        ctx.translate(-this.x, -this.y);

        //ctx.miterLimit = 10;
        ctx.globalAlpha = 1;
    }
}

class BubblePetalSlot {
    constructor(init){
        this.x = init.x;
        this.y = init.y;

        this.r = init.r;

        this.size = this.r;// /Math.sqrt(2);

        this.renderSize = 0;
        this.initialSize = this.size;

        this.rotationOffset = Math.PI/2;

        this.type = 'bubblepetalslot';
        this.rarity = init.rarity;

        this.fillStyle = rarityToFillStyle[this.rarity];
        this.strokeStyle = rarityToStrokeStyle[this.rarity];

        // to give the agar.io in and out effect
        this.renderOscillatorCounter = 0;

        this.deadTimer = null;
        this.dead = false;

        this.oscillateMultiplier = 1;
        if(init.isStationary === true){
            this.oscillateMultiplier = 0;
            this.initialX = this.x;
            this.initialY = this.y;
        }

        this.id = init.id;
    }
    render(){
        if(this.deadTimer !== null){
            ctx.globalAlpha = this.renderSize/this.initialSize;
            this.deadTimer--;
            if(this.deadTimer <= 0){
                this.dead = true;
            }
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,Math.PI,0.22),Math.PI,0.025);//interpolateDirection(this.rotationOffset, 0, 0.3);
            this.r *= 0.9;
            this.size *= 0.9;
        } else {
            this.rotationOffset = interpolateDirection(interpolateDirection(this.rotationOffset,0,0.32),0,0.033);
        }

        this.renderOscillatorCounter += 0.05;
        if(this.renderOscillatorCounter > Math.PI){
            this.renderOscillatorCounter -= Math.PI;
        }

        this.renderSize = interpolate(this.renderSize, this.size, 0.1)+this.oscillateMultiplier*Math.sin(this.renderOscillatorCounter)/8;

        ctx.lineWidth = 4.25;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationOffset);

        ctx.globalAlpha *= 0.5;
        ctx.fillStyle = '#18864e';
        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2-ctx.lineWidth-1,-this.renderSize/2-ctx.lineWidth-1,this.renderSize+ctx.lineWidth*2+2,this.renderSize+ctx.lineWidth*2+2, 5);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 2;

        if(this.rarity === 'supreme'){
            ctx.fillStyle = `hsl(${(Date.now()/12)%360}, 38%, 36%)`;
            ctx.strokeStyle = `hsl(${(Date.now()/12)%360}, 26%, 24%)`;
        } else {
            ctx.fillStyle = this.fillStyle;
            ctx.strokeStyle = this.strokeStyle;
        }

        ctx.beginPath();
        ctx.roundRect(-this.renderSize/2,-this.renderSize/2,this.renderSize,this.renderSize, 6*this.r/canvas.width);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //ctx.miterLimit = 2;
        ctx.font = '800 9px Ubuntu';
        ctx.letterSpacing = "1px";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.fontKerning = "none";

        ctx.strokeText('Bubble', 0, this.renderSize/4+1.5);
        ctx.fillText('Bubble', 0, this.renderSize/4+1.5);

        ctx.fillStyle = '#eeeeee';
        ctx.strokeStyle = '#f0f0f0';

        ctx.beginPath();
        ctx.arc(0, -this.renderSize/10, 7.5, 0, Math.PI*2);
        ctx.globalAlpha = 0.306942;
        ctx.fill();
        ctx.globalAlpha = 0.8;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        // shift up 1/2 of the bubble to the top and right
        ctx.arc(this.renderSize/20*1.2, -this.renderSize/20*1.2-this.renderSize/10, 2, 0, Math.PI*2);
        ctx.globalAlpha = 0.4;
        ctx.fill();
        ctx.closePath();

        ctx.rotate(-this.rotationOffset);
        ctx.translate(-this.x, -this.y);

        //ctx.miterLimit = 10;
        ctx.globalAlpha = 1;
    }
}

// light petal rendering on petalSlot
// ctx.beginPath();
// ctx.arc(0, -this.renderSize/8, 6, 0, Math.PI*2);
// ctx.fill();
// ctx.stroke();
// ctx.closePath();