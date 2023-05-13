class Enemy {
    constructor(init){ // YOOOOOOOOOOOOOOOOOO
        switch (init.type){
            case 'rock':
                return new Rock(init);
                break;
            case 'portal'://wwwwwwwwwwwwwww
                return new Portal(init);
                break;
            case 'evilflower':
                return new EvilFlower(init);
                break;
            case 'diep':
                return new Diep(init);
                break;
            case 'bullet':
                return new Bullet(init);
                break;
            case 'mopemouse':
                return new MopeMouse(init);
                break;
            case "peaenemy":
                return new PeaEnemy(init);
                break;
            case "cactus":
                return new Cactus(init);
                break;
            default:
                console.log('enemy type is not defined new enemy enemy.js');
                break;
        }
    }
}

const damageTime = 150;

class Cactus {
    constructor(init){
        this.r = init.r;
        this.initialRadius = this.r;
        this.renderRadius = 1;

        this.rarity = init.rarity;
        this.x = init.x;
        this.y = init.y;

        this.renderX = this.x;
        this.renderY = this.y;

        this.type = 'cactus';

        this.hp = init.hp;
        this.renderHp = init.hp;
        this.maxHp = init.maxHp;

        this.dead = init.dead;
        this.initDead = init.dead;

        this.angle = init.angle;
        this.magnitude = init.magnitude;
        this.renderAngle = init.angle;

        this.lastDamageTime = 0;

        this.renderOscillatorCounter = 0;
    }
    simulate(dt){

    }
    render(damaged=false){
        if(this.initDead === true)return;// to prevent enemies being loaded in after having a death effect upon room enter
        // shrinking dead animation

        this.renderOscillatorCounter += 0.05;
        if(this.renderOscillatorCounter > Math.PI){
            this.renderOscillatorCounter -= Math.PI;
        }

        this.renderRadius = expLerp(this.renderRadius, this.r, 1/8)+Math.sin(this.renderOscillatorCounter)/8;
        this.renderX = interpolate(this.renderX, this.x, 0.1);
        this.renderY = interpolate(this.renderY, this.y, 0.1);
        this.renderAngle = interpolateLinearDirection(this.renderAngle, this.angle, 0.1);
        this.renderHp = interpolate(this.renderHp, this.hp, 0.1);

        if(this.dead === true && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        //ctx.beginPath();

        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            // ctx.fillStyle = 'blue';
            // ctx.strokeStyle = 'black';
        }

        ctx.lineWidth = 5;

        ctx.translate(this.renderX, this.renderY);
        ctx.rotate(this.renderAngle-Math.PI/2);
        ctx.drawImage(cactusImg, -this.renderRadius*1.3, -this.renderRadius*1.3, this.renderRadius*2.6, this.renderRadius*2.6);
        ctx.rotate(-this.renderAngle+Math.PI/2);
        ctx.translate(-this.renderX, -this.renderY);

        if(!damaged && Date.now() - this.lastDamageTime < damageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / damageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        if(this.rarity === 'boss'){
            // rendering hp bar
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = this.r/15;
            ctx.lineCap = 'round';

            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5, this.renderY + this.renderRadius*1.3, this.renderRadius*3, this.renderRadius*0.35, this.renderRadius*0.25);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = '#73de36'
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5+1.5, this.renderY + this.renderRadius*1.3+1.5, (this.renderRadius*3-3)*this.renderHp/this.maxHp, Math.max(0,this.renderRadius*0.35-3), this.renderRadius*0.25, (this.renderRadius*3-3));
            ctx.fill();
            ctx.closePath();

            ctx.lineCap = 'butt';
        }
        
        ctx.globalAlpha = 1;

        // // Hitbox Visualization
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.globalAlpha = 0.3;
        // ctx.arc(this.x, this.y, this.renderRadius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.globalAlpha = 1;
        // ctx.closePath();
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp'){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                }
                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
}

class Rock {
    constructor(init){
        this.r = init.r;
        this.initialRadius = this.r;
        this.rarity = init.rarity;
        this.x = init.x;
        this.y = init.y;

        this.renderX = this.x;
        this.renderY = this.y;
        this.type = "Rock";

        this.renderRadius = 1;

        this.generateVerticies();

        this.hp = init.hp;
        this.renderHp = init.hp;

        this.dead = init.dead;
        this.initDead = init.dead;

        this.maxHp = init.maxHp;
        this.lastDamageTime = 0;
    }
    simulate(dt){}
    render(damaged=false){
        if(this.initDead === true)return;// to prevent enemies being loaded in after having a death effect upon room enter
        // shrinking dead animation
        if(this.dead === true && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        this.renderRadius = expLerp(this.renderRadius, this.r, 1/8);
        this.renderX = interpolate(this.renderX, this.x, 0.1);
        this.renderY = interpolate(this.renderY, this.y, 0.1);

        ctx.beginPath();

        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            ctx.fillStyle = '#777777';
            ctx.strokeStyle = '#606060';
        }
        ctx.lineWidth = 5;

        ctx.lineCap = 'round';

        ctx.moveTo(this.getVertexX(0), this.getVertexY(0));
        for(let i = 0; i < this.verticies.length; i++){
            ctx.lineTo(this.getVertexX(i), this.getVertexY(i));
        }
        ctx.lineTo(this.getVertexX(0), this.getVertexY(0));
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.lineCap = 'butt';

        // boss hp bar
        if(this.rarity === 'boss'){
            this.renderHp = interpolate(this.renderHp, this.hp, 0.1);

            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5, this.renderY + this.renderRadius*1.7, this.renderRadius*3, this.renderRadius*0.35, this.renderRadius*0.25);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = '#73de36'
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5+1.5, this.renderY + this.renderRadius*1.7+1.5, (this.renderRadius*3-3)*this.renderHp/this.maxHp, Math.max(0,this.renderRadius*0.35-3), this.renderRadius*0.25, (this.renderRadius*3-3));
            ctx.fill();
            ctx.closePath();
        }

        if(!damaged && Date.now() - this.lastDamageTime < damageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / damageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;

        // // Hitbox Visualization
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.globalAlpha = 0.3;
        // ctx.arc(this.x, this.y, this.renderRadius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.globalAlpha = 1;
        // ctx.closePath();
    }
    generateVerticies(){
        this.verticies = [];

        // i is the angle in radians
        let inc = (Math.PI*2)/Math.ceil(Math.sqrt(this.r)+2+Math.random()*2);
        let offset = (this.r+Math.random()*3-1)/5;
        if(this.rarity === 'omnipotent'){
            offset += 10;
        } else if(this.rarity === 'common'){
            offset = 0;
        }
        const angleOffset = Math.random()*Math.PI*2;
        for(let i = angleOffset; i < Math.PI*2+angleOffset; i+= inc){
            // generate a point randomly offset
            this.verticies.push({
                x: Math.cos(i),
                y: Math.sin(i),
                randX: Math.random()*offset/this.r,
                randY: Math.random()*offset/this.r,
            })
        }

        this.maxVertexOffset = offset;

        // sometimes we're offset from the circle. We want to offset the position to make sure we're centered
        this.averageX = 0;
        this.averageY = 0;
        for(let i = 0; i < this.verticies.length; i++){
            this.averageX += this.verticies[i].randX;
            this.averageY += this.verticies[i].randY;
        }
        this.averageX /= this.verticies.length;
        this.averageY /= this.verticies.length;

        for(let i = 0; i < this.verticies.length; i++){
            this.verticies[i].randX -= this.averageX;
            this.verticies[i].randY -= this.averageY;
        }
    }
    getVertexX(i){
        return this.renderX+this.verticies[i].x*this.renderRadius+this.verticies[i].randX*this.renderRadius;
    }
    getVertexY(i){
        return this.renderY+this.verticies[i].y*this.renderRadius+this.verticies[i].randY*this.renderRadius;
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp'){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                }
                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
}

class Portal {
    constructor(init){
        this.r = init.r;
        this.rarity = init.rarity;
        this.x = init.x;
        this.y = init.y;

        this.renderX = this.x;
        this.renderY = this.y;

        this.renderRadius = 1;

        this.hp = init.hp;

        this.golden = init.golden ?? false;
        // console.log(init.golden);
    }
    simulate(dt){}
    render(){
        this.renderRadius = expLerp(this.renderRadius, this.r, 1/8);
        this.renderX = interpolate(this.renderX, this.x, 0.1);
        this.renderY = interpolate(this.renderY, this.y, 0.1);

        // 200, 130, 60

        ctx.fillStyle = '#b58500';
        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.renderRadius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = '#946d00';
        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.renderRadius*.65, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = '#6b4f00';
        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.renderRadius*0.3, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        // boss portal entrance
        if(this.golden !== false){
            // spawn glint particles in the future?
            ctx.globalAlpha = 0.45;
            if(this.golden === 'diamond'){
                ctx.fillStyle = '#b9f2ff';
                ctx.globalAlpha = 0.6;
            } else {
                ctx.fillStyle = '#ffd700';
            }

            ctx.beginPath();
            ctx.arc(this.renderX, this.renderY, this.renderRadius, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1;
        }
    }
    simulate(dt) {}
    updatePack(data){
        for(let key in data){
            this[key] = data[key];
        }
    }
}

class EvilFlower {
    constructor(init){
        this.r = init.r;
        this.initialRadius = this.r;
        this.renderRadius = 1;

        this.rarity = init.rarity;
        this.x = init.x;
        this.y = init.y;

        this.renderX = this.x;
        this.renderY = this.y;

        this.type = 'evilflower';

        this.hp = init.hp;
        this.renderHp = init.hp;

        this.dead = init.dead;
        this.initDead = init.dead;

        this.petals = init.petals.map(p => new Petal(p));

        // this.petalSlots = this.petals.length;

        this.angle = init.angle;
        this.magnitude = init.magnitude;

        this.petalDistance = init.petalDistance;
        this.desiredPetalDistance = this.petalDistance;
        this.basePetalDistance = init.basePetalDistance;

        this.attacking = init.attacking;
        this.defending = init.defending;

        this.lastDamageTime = 0;

        this.maxHp = init.maxHp;

        if(this.rarity === 'boss'){
            this.recoilTimer = init.recoilTimer;
            this.maxRecoilTimer = init.maxRecoilTimer;
        }
    }
    simulate(dt){
        if(this.rarity === 'boss'){
            const basePetalDistance = this.petalDistance;
            for(let i = 0; i < this.petals.length; i++){
                if(i % 2 === 0){
                    this.petalDistance = basePetalDistance / 1.5;
                } else {
                    this.petalDistance = basePetalDistance;
                }
                this.petals[i].simulate(this, renderDt);
            }
            this.petalDistance = basePetalDistance;

            this.recoilTimer -= dt;
            if(this.recoilTimer < 0){
                this.recoilTimer = this.maxRecoilTimer;
            }
        } else {
            for(let i = 0; i < this.petals.length; i++){
                this.petals[i].simulate(this, renderDt);
            }
        }
    }
    render(damaged=false){
        if(this.initDead === true)return;// to prevent enemies being loaded in after having a death effect upon room enter
        // shrinking dead animation

        this.renderRadius = expLerp(this.renderRadius, this.r, 1/8);

        if(this.rarity === 'boss'){
            this.renderX = interpolate(this.renderX, this.x, 0.08);
            this.renderY = interpolate(this.renderY, this.y, 0.08);
        } else {
            this.renderX = interpolate(this.renderX, this.x, 0.1);
            this.renderY = interpolate(this.renderY, this.y, 0.1);
        }


        if(this.dead === true && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        } else {
            const lastGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 1;
            for(let i in this.petals){
                this.petals[i].render();
            }
            ctx.globalAlpha = lastGlobalAlpha;
        }

        ctx.beginPath();

        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            ctx.fillStyle = '#ff6363';
            ctx.strokeStyle = '#ce4f4f';
        }
        const playerBodyColor = ctx.fillStyle;

        ctx.lineWidth = 5;

        // ctx.beginPath();
        // ctx.arc(this.renderX, this.renderY, this.renderRadius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();

        // PLAYER RENDER BEGINS HERE

        this.renderAngle = interpolateDirection(this.renderAngle, this.angle, 1/3);
        this.renderHp = interpolate(this.renderHp, this.hp, 0.1);

        ctx.lineWidth = this.r/12;

        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.renderRadius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // eyes
        ctx.fillStyle = '#212219';
        ctx.beginPath();
        ctx.ellipse(this.renderX - this.r/3.5, this.renderY - this.r*5/23.5, this.renderRadius*3/23.5, this.renderRadius*6/23.5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.ellipse(this.renderX + this.r/3.5, this.renderY - this.renderRadius*5/23.5, this.renderRadius*3/23.5, this.renderRadius*6/23.5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        //ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)

        // mouth
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = this.r/15;
        ctx.lineCap = 'round';

        let expressionOffset;// 0 to 1
        if(this.petalDistance > this.basePetalDistance){
            // we're attacking
            // petalDistance = 1 at this.petalDistance = petalDistance * 2.15;
            // petalDistance = 0 at this.petalDistance = petalDistance;
            expressionOffset = (this.petalDistance - this.basePetalDistance) / 1.15 / this.basePetalDistance;
        } else {
            // we're defending; divide by 0.4
            // petalDistance = 1 at this.petalDistance = petalDistance * 0.6;
            // petalDistance = 0 at this.petalDistance = petalDistance
            expressionOffset = (this.basePetalDistance - this.petalDistance) / 0.4 / this.basePetalDistance;
        }

        ctx.beginPath();
        ctx.moveTo(this.renderX + this.r/4, this.renderY + this.renderRadius*9/23.5);
        ctx.quadraticCurveTo(this.renderX, this.renderY + this.renderRadius*(14-9*expressionOffset)/23.5, this.renderX - this.renderRadius/4, this.renderY + this.renderRadius*9/23.5);
        ctx.stroke();

        // eyes: we have a path oval and then white circle and we ctx.clip

        ctx.save();
        // oval clipping path
        ctx.beginPath();
        ctx.ellipse(this.renderX + this.r/3.5, this.renderY - this.renderRadius*5/23.5, this.renderRadius*2.5/23.5, this.renderRadius*5/23.5, 0, 0, Math.PI*2);
        ctx.clip();
        // ctx.closePath();

        // circle
        const eyeOffset = {
            x: Math.cos(this.renderAngle)*this.renderRadius*2/23,
            y: Math.sin(this.renderAngle)*this.renderRadius*3.5/23
        }
        ctx.fillStyle = '#eeeeee';
        ctx.beginPath();
        ctx.ellipse(this.renderX + this.r/3.5 + eyeOffset.x, this.renderY - this.renderRadius*5/23.5 + eyeOffset.y, this.renderRadius*3/23.5, this.renderRadius*3/23.5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

        ctx.save();
        // oval clipping path
        ctx.beginPath();
        ctx.ellipse(this.renderX - this.r/3.5, this.renderY - this.renderRadius*5/23.5, this.renderRadius*2.5/23.5, this.renderRadius*5/23.5, 0, 0, Math.PI*2);
        ctx.clip();

        ctx.fillStyle = '#eeeeee';
        ctx.beginPath();
        ctx.ellipse(this.renderX - this.r/3.5 + eyeOffset.x, this.renderY - this.renderRadius*5/23.5 + eyeOffset.y, this.renderRadius*3/23.5, this.renderRadius*3/23.5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

        // triangle that makes the player look angry
        const offset = (this.petalDistance - this.basePetalDistance*2.15) / 24;
        // ctx.fillStyle = '#ff6363';
        // we need to match the color of the player to blend in

        if(ctx.globalAlpha > 0.95){
            ctx.fillStyle = playerBodyColor;

            ctx.beginPath();
            ctx.moveTo(this.renderX - this.renderRadius/3.5*2, this.renderY - this.renderRadius*14/23.5 + offset);
            ctx.lineTo(this.renderX + this.renderRadius/3.5*2, this.renderY - this.renderRadius*14/23.5 + offset);
            ctx.lineTo(this.renderX, this.renderY - this.renderRadius*5/23.5 + offset);
            ctx.fill();
            ctx.closePath();
        }

        // rendering hp
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.roundRect(this.renderX - this.renderRadius*1.5, this.renderY + this.renderRadius*1.7, this.renderRadius*3, this.renderRadius*0.35, this.renderRadius*0.25);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = '#73de36';
        ctx.beginPath();
        ctx.roundRect(this.renderX - this.renderRadius*1.5+1.5, this.renderY + this.renderRadius*1.7+1.5, (this.renderRadius*3-3)*this.renderHp/this.maxHp, Math.max(0,this.renderRadius*0.35-3), this.renderRadius*0.25, (this.renderRadius*3-3));
        ctx.fill();
        ctx.closePath();

        ctx.lineCap = 'butt';
        // PLAYER RENDER ENDS HERE

        if(this.rarity === 'boss' && damaged == false && this.recoilTimer <= 2000 && this.dead === false){
            ctx.globalAlpha = 0.6*(2000-this.recoilTimer)/2000;

            ctx.lineWidth = this.r/15;

            // // same as diep blue attack shifted +67 hue
            ctx.fillStyle = '#7b1fde';
            ctx.strokeStyle = '#6419b5';

            // // diep red?
            // ctx.fillStyle = '#de1f1f';
            // ctx.strokeStyle = '#b41919';



            ctx.beginPath();
            ctx.arc(this.renderX, this.renderY, this.renderRadius, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            ctx.globalAlpha = 1;
        }

        if(!damaged && Date.now() - this.lastDamageTime < damageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / damageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;

        // // Hitbox Visualization
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.globalAlpha = 0.3;
        // ctx.arc(this.x, this.y, this.renderRadius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.globalAlpha = 1;
        // ctx.closePath();
    }
    updatePack(data){
        for(let key in data){
            if(key === 'petals'){
                for(let i = 0; i < data.petals.length; i++){
                    this.petals[i].updatePack(data.petals[i]);
                }
            } else if(key === 'hp'){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                }
                this.hp = data.hp;
            } else if(key === 'dead' && this.recievedDead !== true && this.rarity === 'boss') {
                this.recievedDead = true;
                // we're dead;
                for(let i = 0; i < data.petals.length; i++){
                    this.petals[i].hp = -1E99;
                    this.petals[i].lastDamageTime = Date.now();
                    this.petals[i].lastDeadTime = Date.now();
                }
            } else {
                this[key] = data[key];
            }
        }
    }
}

class Diep {
    constructor(init){
        this.r = init.r;
        this.initialRadius = this.r;
        this.renderRadius = 1;

        this.rarity = init.rarity;
        this.x = init.x;
        this.y = init.y;

        this.renderX = this.x;
        this.renderY = this.y;

        this.type = 'diep';

        this.hp = init.hp;
        this.renderHp = init.hp;

        this.maxHp = init.maxHp;
        this.dead = init.dead;
        this.initDead = init.dead;

        this.angle = init.angle;
        this.renderAngle = init.angle;
        this.magnitude = init.magnitude;

        this.lastDamageTime = 0;

        this.redTimer = -1;
        this.timerColor = 'red';
        // this.redTimerSpeed = 0;

        this.isRock = init.isRock;
    }
    simulate(dt){
        this.redTimer -= dt //* this.redTimerSpeed / 1000;
    }
    render(damaged=false){
        if(this.initDead === true)return;// to prevent enemies being loaded in after having a death effect upon room enter
        // shrinking dead animation

        this.renderRadius = expLerp(this.renderRadius, this.r, 1/8);
        this.renderX = interpolate(this.renderX, this.x, 0.1);
        this.renderY = interpolate(this.renderY, this.y, 0.1);
        this.renderAngle = interpolateLinearDirection(this.renderAngle, this.angle, 0.06);
        this.renderHp = interpolate(this.renderHp, this.hp, 0.1);

        if(this.dead === true && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        ctx.beginPath();

        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            ctx.fillStyle = '#989898';
            ctx.strokeStyle = '#737373';
        }

        if(this.rarity === 'common'){
            ctx.lineWidth = 4;
        } else if (this.rarity === 'unusual'){
            ctx.lineWidth = 5;
        } else if (this.rarity === 'rare'){
            ctx.lineWidth = 6;
        } else {
            ctx.lineWidth = 7;
        }


        ctx.translate(this.renderX, this.renderY);
        ctx.rotate(this.renderAngle-Math.PI/2);

        // gun
        if(damaged === false){
            if(this.rarity === 'boss'){
                // octo tank
                for(let i = 0; i < 8; i++){
                    ctx.rotate(Math.PI*2/8*i);

                    ctx.beginPath();
                    ctx.roundRect(-this.renderRadius/2.2, 0, this.renderRadius/1.1, this.renderRadius*1.8, 3);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.rotate(-Math.PI*2/8*i);
                }
                if(this.redTimer > 0){
                    const lastFillStyle = ctx.fillStyle;
                    const lastStrokeStyle = ctx.strokeStyle;

                    if(this.timerColor === 'red'){
                        ctx.globalAlpha = 1 - this.redTimer / 3000;

                        ctx.fillStyle = '#de1f1f';
                        ctx.strokeStyle = '#b41919';
                        for(let i = 0; i < 8; i++){
                            ctx.rotate(Math.PI*2/8*i);

                            ctx.beginPath();
                            ctx.roundRect(-this.renderRadius/2.2, 0, this.renderRadius/1.1, this.renderRadius*1.8, 3);
                            ctx.fill();
                            ctx.stroke();
                            ctx.closePath();

                            ctx.rotate(-Math.PI*2/8*i);
                        }
                    } else if(this.timerColor === 'blue'){
                        ctx.globalAlpha = (1 - this.redTimer / 600) * 0.75;
                        ctx.fillStyle = '#1f98de';
                        ctx.strokeStyle = '#197cb5';
                        for(let i = 0; i < 8; i++){
                            ctx.rotate(Math.PI*2/8*i);

                            ctx.beginPath();
                            ctx.roundRect(-this.renderRadius/2.2, 0, this.renderRadius/1.1, this.renderRadius*1.8, 3);
                            ctx.fill();
                            ctx.stroke();
                            ctx.closePath();

                            ctx.rotate(-Math.PI*2/8*i);
                        }
                    } else {// 1st attack; green
                        ctx.globalAlpha = (1 - this.redTimer / 1400) * 0.8;
                        ctx.fillStyle = '#62de1f';
                        ctx.strokeStyle = '#50b519';
                        for(let i = 0; i < 8; i++){
                            if(i !== (this.timerColor) % 8 && i !== (this.timerColor + 4) % 8)continue;
                            ctx.rotate(Math.PI*2/8*i);

                            ctx.beginPath();
                            ctx.roundRect(-this.renderRadius/2.2, 0, this.renderRadius/1.1, this.renderRadius*1.8, 3);
                            ctx.fill();
                            ctx.stroke();
                            ctx.closePath();

                            ctx.rotate(-Math.PI*2/8*i);
                        }
                    }


                    ctx.fillStyle = lastFillStyle;
                    ctx.strokeStyle = lastStrokeStyle;
                    ctx.globalAlpha = 1;
                }
            } else {
                // normal tank
                ctx.beginPath();
                ctx.roundRect(-this.renderRadius/2.2, 0, this.renderRadius/1.1, this.renderRadius*1.8, this.rarity === 'common' ? 1 : 3);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
        }

        // body
        if(ctx.fillStyle === '#989898'){
            if(this.isRock === true){
                ctx.fillStyle = '#777777';
                ctx.strokeStyle = '#606060';
            } else {
                ctx.fillStyle = '#00b0df';
                ctx.strokeStyle = '#0085a9';
            }
        }
        ctx.beginPath();
        ctx.arc(0, 0, this.renderRadius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.rotate(-this.renderAngle+Math.PI/2);
        ctx.translate(-this.renderX, -this.renderY);

        // boss hp bar
        if(this.rarity === 'boss'){
            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5, this.renderY + this.renderRadius*1.7, this.renderRadius*3, this.renderRadius*0.35, this.renderRadius*0.25);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = '#73de36'
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5+1.5, this.renderY + this.renderRadius*1.7+1.5, (this.renderRadius*3-3)*this.renderHp/this.maxHp, Math.max(0,this.renderRadius*0.35-3), this.renderRadius*0.25, (this.renderRadius*3-3));
            ctx.fill();
            ctx.closePath();
        }

        if(!damaged && Date.now() - this.lastDamageTime < damageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / damageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;

        // // Hitbox Visualization
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.globalAlpha = 0.3;
        // ctx.arc(this.x, this.y, this.renderRadius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.globalAlpha = 1;
        // ctx.closePath();
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp'){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                }
                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
}

class Bullet {
    constructor(init){
        this.x = init.x;
        this.y = init.y;

        this.xv = init.xv;
        this.yv = init.yv;

        this.r = init.r;
        this.initialRadius = this.r;
        this.renderRadius = 1;

        this.rarity = init.rarity;

        this.type = 'bullet';

        this.dead = init.dead;
        this.initDead = init.dead;

        this.renderX = this.x;
        this.renderY = this.y;

        this.lastDamageTime = 0;

        this.isRock = init.isRock;
        if(this.isRock === true){
            this.generateVerticies();
        }
    }
    generateVerticies(){
        this.verticies = [];

        // i is the angle in radians
        let inc = (Math.PI*2)/Math.ceil(Math.sqrt(this.r)+2+Math.random()*2);
        let offset = (this.r+Math.random()*3-1)/5;
        if(this.rarity === 'omnipotent'){
            offset += 10;
        } else if(this.rarity === 'common'){
            offset = 0;
        }
        const angleOffset = Math.random()*Math.PI*2;
        for(let i = angleOffset; i < Math.PI*2+angleOffset; i+= inc){
            // generate a point randomly offset
            this.verticies.push({
                x: Math.cos(i),
                y: Math.sin(i),
                randX: Math.random()*offset/this.r,
                randY: Math.random()*offset/this.r,
            })
        }

        this.maxVertexOffset = offset;

        // sometimes we're offset from the circle. We want to offset the position to make sure we're centered
        this.averageX = 0;
        this.averageY = 0;
        for(let i = 0; i < this.verticies.length; i++){
            this.averageX += this.verticies[i].randX;
            this.averageY += this.verticies[i].randY;
        }
        this.averageX /= this.verticies.length;
        this.averageY /= this.verticies.length;

        for(let i = 0; i < this.verticies.length; i++){
            this.verticies[i].randX -= this.averageX;
            this.verticies[i].randY -= this.averageY;
        }
    }
    getVertexX(i){
        return this.renderX+this.verticies[i].x*this.renderRadius+this.verticies[i].randX*this.renderRadius;
    }
    getVertexY(i){
        return this.renderY+this.verticies[i].y*this.renderRadius+this.verticies[i].randY*this.renderRadius;
    }
    simulate(dt){}
    render(damaged=false){
        if(this.initDead === true)return;// to prevent enemies being loaded in after having a death effect upon room enter
        // shrinking dead animation

        this.renderRadius = expLerp(this.renderRadius, this.r, 1/8);
        this.renderX = interpolate(this.renderX, this.x, 0.1);
        this.renderY = interpolate(this.renderY, this.y, 0.1);

        if(this.dead === true && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        ctx.beginPath();

        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            if(this.isRock === true){
                ctx.fillStyle = '#777777';
                ctx.strokeStyle = '#606060';
            } else {
                ctx.fillStyle = '#00b2e1';
                ctx.strokeStyle = '#0085a8';
            }
        }

        ctx.lineWidth = 5;

        if(this.isRock === true){
            ctx.lineCap = 'round';

            ctx.moveTo(this.getVertexX(0), this.getVertexY(0));
            for(let i = 0; i < this.verticies.length; i++){
                ctx.lineTo(this.getVertexX(i), this.getVertexY(i));
            }
            ctx.lineTo(this.getVertexX(0), this.getVertexY(0));
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.lineCap = 'butt';
        } else {
            ctx.beginPath();
            ctx.arc(this.renderX, this.renderY, this.renderRadius, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        if(!damaged && Date.now() - this.lastDamageTime < damageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / damageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;

        // // Hitbox Visualization
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.globalAlpha = 0.3;
        // ctx.arc(this.x, this.y, this.renderRadius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.globalAlpha = 1;
        // ctx.closePath();
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp'){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                }
                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
}

class MopeMouse {
    constructor(init){
        this.r = init.r;
        this.initialRadius = this.r;
        this.renderRadius = 1;

        this.rarity = init.rarity;
        this.x = init.x;
        this.y = init.y;

        this.renderX = this.x;
        this.renderY = this.y;

        this.type = 'mopemouse';

        this.hp = init.hp;
        this.renderHp = init.hp;
        this.maxHp = init.maxHp;

        this.dead = init.dead;
        this.initDead = init.dead;

        this.angle = init.angle;
        this.magnitude = init.magnitude;
        this.renderAngle = init.angle;

        this.lastDamageTime = 0;

        this.renderOscillatorCounter = 0;
    }
    simulate(dt){

    }
    render(damaged=false){
        if(this.initDead === true)return;// to prevent enemies being loaded in after having a death effect upon room enter
        // shrinking dead animation

        this.renderOscillatorCounter += 0.05;
        if(this.renderOscillatorCounter > Math.PI){
            this.renderOscillatorCounter -= Math.PI;
        }

        this.renderRadius = expLerp(this.renderRadius, this.r, 1/8)+Math.sin(this.renderOscillatorCounter)/8;
        this.renderX = interpolate(this.renderX, this.x, 0.1);
        this.renderY = interpolate(this.renderY, this.y, 0.1);
        this.renderAngle = interpolateLinearDirection(this.renderAngle, this.angle, 0.1);
        this.renderHp = interpolate(this.renderHp, this.hp, 0.1);

        if(this.dead === true && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        ctx.beginPath();

        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            // ctx.fillStyle = 'blue';
            // ctx.strokeStyle = 'black';
        }

        ctx.lineWidth = 5;

        // ctx.beginPath();
        // ctx.arc(this.renderX, this.renderY, this.renderRadius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();
        ctx.translate(this.renderX, this.renderY);
        ctx.rotate(this.renderAngle-Math.PI/2);
        ctx.beginPath();
        ctx.fillStyle = '#0f8e3f';
        ctx.arc(0,0,this.renderRadius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.drawImage(mouseImg, -this.renderRadius*1.3, -this.renderRadius*1.3, this.renderRadius*2.6, this.renderRadius*2.6);
        ctx.rotate(-this.renderAngle+Math.PI/2);
        ctx.translate(-this.renderX, -this.renderY);

        if(!damaged && Date.now() - this.lastDamageTime < damageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / damageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        if(this.rarity === 'boss'){
            // rendering hp bar
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = this.r/15;
            ctx.lineCap = 'round';

            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5, this.renderY + this.renderRadius*1.3, this.renderRadius*3, this.renderRadius*0.35, this.renderRadius*0.25);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = '#73de36'
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5+1.5, this.renderY + this.renderRadius*1.3+1.5, (this.renderRadius*3-3)*this.renderHp/this.maxHp, Math.max(0,this.renderRadius*0.35-3), this.renderRadius*0.25, (this.renderRadius*3-3));
            ctx.fill();
            ctx.closePath();

            ctx.lineCap = 'butt';
        }

        ctx.globalAlpha = 1;

        // // Hitbox Visualization
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.globalAlpha = 0.3;
        // ctx.arc(this.x, this.y, this.renderRadius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.globalAlpha = 1;
        // ctx.closePath();
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp'){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                }
                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
}

class PeaEnemy {
    constructor(init){
        this.r = init.r;
        this.initialRadius = this.r;
        this.renderRadius = 1;

        this.rarity = init.rarity;
        this.x = init.x;
        this.y = init.y;

        this.renderX = this.x;
        this.renderY = this.y;

        this.type = 'peaenemy';

        this.hp = init.hp;
        this.renderHp = init.hp;
        this.maxHp = init.maxHp;

        this.dead = init.dead;
        this.initDead = init.dead;

        this.angle = init.angle;
        this.magnitude = init.magnitude;
        this.renderAngle = init.angle;

        this.lastDamageTime = 0;

        this.renderOscillatorCounter = 0;
    }
    simulate(dt){

    }
    render(damaged=false){
        if(this.initDead === true)return;// to prevent enemies being loaded in after having a death effect upon room enter
        // shrinking dead animation

        this.renderOscillatorCounter += 0.05;
        if(this.renderOscillatorCounter > Math.PI){
            this.renderOscillatorCounter -= Math.PI;
        }

        this.renderRadius = expLerp(this.renderRadius, this.r, 1/8)+Math.sin(this.renderOscillatorCounter)/8;
        this.renderX = interpolate(this.renderX, this.x, 0.1);
        this.renderY = interpolate(this.renderY, this.y, 0.1);
        this.renderAngle = interpolateLinearDirection(this.renderAngle, this.angle, 0.1);
        this.renderHp = interpolate(this.renderHp, this.hp, 0.1);

        if(this.dead === true && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        //ctx.beginPath();

        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            // ctx.fillStyle = 'blue';
            // ctx.strokeStyle = 'black';
        }

        ctx.lineWidth = 5;

        ctx.translate(this.renderX, this.renderY);
        ctx.rotate(this.renderAngle-Math.PI/2);
        ctx.drawImage(peaImg, -this.renderRadius*1.3, -this.renderRadius*1.3, this.renderRadius*2.6, this.renderRadius*2.6);
        ctx.rotate(-this.renderAngle+Math.PI/2);
        ctx.translate(-this.renderX, -this.renderY);

        if(!damaged && Date.now() - this.lastDamageTime < damageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / damageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        if(this.rarity === 'boss'){
            // rendering hp bar
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = this.r/15;
            ctx.lineCap = 'round';

            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5, this.renderY + this.renderRadius*1.3, this.renderRadius*3, this.renderRadius*0.35, this.renderRadius*0.25);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = '#73de36'
            ctx.beginPath();
            ctx.roundRect(this.renderX - this.renderRadius*1.5+1.5, this.renderY + this.renderRadius*1.3+1.5, (this.renderRadius*3-3)*this.renderHp/this.maxHp, Math.max(0,this.renderRadius*0.35-3), this.renderRadius*0.25, (this.renderRadius*3-3));
            ctx.fill();
            ctx.closePath();

            ctx.lineCap = 'butt';
        }
        
        ctx.globalAlpha = 1;

        // // Hitbox Visualization
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.globalAlpha = 0.3;
        // ctx.arc(this.x, this.y, this.renderRadius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.globalAlpha = 1;
        // ctx.closePath();
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp'){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                }
                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
}