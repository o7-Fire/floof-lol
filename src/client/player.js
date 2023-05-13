const playerSpeed = 1;
const petalDistance = 61.1;
class Player{
    constructor(id, init){
        this.id = id;
        this.x = init.x;
        this.y = init.y;
        this.r = 23.5;

        this.maxHp = Math.max(init.hp, init.maxHp);
        this.impulse = {x: 0, y: 0};

        this.room = {x: init.room.x, y: init.room.y};// starting room

        // input
        this.angle = 0;
        this.magnitude = 0;

        this.lastRenderState = this.createRenderState();

        this.hp = init.hp;
        this.renderX = this.x;
        this.renderY = this.y;
        this.renderAngle = this.angle;
        this.renderHp = this.hp;
        this.username = "Player " + init.playerId;
        
        this.petalDistance = init.petalDistance;

        this.petals = init.petals.map(p => new Petal(p));

        this.attacking = init.attacking;
        this.defending = init.defending;

        if(this.id === window.selfId){
            const petalSlotPadding = 10;
            const petalSlotSize = 44.5;

            for(let i = 0; i < this.petals.length; i++){
                equippedPetalSlots[i] = new PetalSlot({
                    type: this.petals[i].petalSlotType,
                    x: petalSlotPadding + petalSlotSize/2,
                    y: (petalSlotPadding + petalSlotSize)*i + petalSlotSize/2 + petalSlotPadding,
                    rarity: this.petals[i].rarity,
                    r: 44.5,
                    isStationary: true
                });
            }
        }
    }
    simulate(dt){
        const xv = Math.cos(this.angle)*this.magnitude*playerSpeed+this.impulse.x;
        const yv = Math.sin(this.angle)*this.magnitude*playerSpeed+this.impulse.y;

        this.x += xv*dt/1000;
        this.y += yv*dt/1000;

        this.impulse.x *= Math.pow(/*this.friction*/0.8, dt * 15);
	    this.impulse.y *= Math.pow(/*this.friction*/0.8, dt * 15);

        if(this.x + this.r > dimensions.x){
            this.x = dimensions.x - this.r;
        } else if(this.x - this.r < 0){
            this.x = this.r;
        }
        if(this.y + this.r > dimensions.y){
            this.y = dimensions.y - this.r;
        } else if(this.y - this.r < 0){
            this.y = this.r;
        }

        for(let i = 0; i < this.petals.length; i++){
            this.petals[i].simulate(this, dt);
        }
    }
    renderUsername(){
        //dog tag
        ctx.fillStyle = '#212219';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.username, this.renderX, this.renderY - this.r - 10);
    }
    renderHP(){
        // hp
        ctx.fillStyle = '#212219'; 
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(this.hp) + "/" + Math.round(this.maxHp) + " HP", this.renderX, this.renderY - this.r + 80);
    }
    render() {
        if (Math.random() > 0.99) {
            send({name: ref.nameInput.value});
        }
        for(let i in this.petals){
            this.petals[i].render();
        }

        ctx.fillStyle = '#ffe763';
        ctx.strokeStyle = '#cebb50';

        this.renderX = interpolate(this.renderX, this.x, 0.1);
        this.renderY = interpolate(this.renderY, this.y, 0.1);

        this.renderAngle = interpolateDirection(this.renderAngle, this.angle, 1/3);
        this.renderHp = interpolate(this.renderHp, this.hp, 0.1);

        ctx.lineWidth = this.r/12;

        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.r, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
        
        // eyes
        ctx.fillStyle = '#212219';
        ctx.beginPath();
        ctx.ellipse(this.renderX - this.r/3.5, this.renderY - this.r*5/23.5, this.r*3/23.5, this.r*6/23.5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.ellipse(this.renderX + this.r/3.5, this.renderY - this.r*5/23.5, this.r*3/23.5, this.r*6/23.5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        //ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)

        this.renderUsername();
        this.renderHP();
        // mouth
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = this.r/15;
        ctx.lineCap = 'round';

        let expressionOffset;// 0 to 1
        if(this.petalDistance > petalDistance){
            // we're attacking
            // petalDistance = 1 at this.petalDistance = petalDistance * 2.15;
            // petalDistance = 0 at this.petalDistance = petalDistance;
            expressionOffset = (this.petalDistance - petalDistance) / 1.15 / petalDistance;
        } else {
            // we're defending; divide by 0.4
            // petalDistance = 1 at this.petalDistance = petalDistance * 0.6;
            // petalDistance = 0 at this.petalDistance = petalDistance
            expressionOffset = (petalDistance - this.petalDistance) / 0.4 / petalDistance;
        }

        ctx.beginPath();
        ctx.moveTo(this.renderX + this.r/4, this.renderY + this.r*9/23.5);
        ctx.quadraticCurveTo(this.renderX, this.renderY + this.r*(14-9*expressionOffset)/23.5, this.renderX - this.r/4, this.renderY + this.r*9/23.5);
        ctx.stroke();

        // eyes: we have a path oval and then white circle and we ctx.clip

        ctx.save();
        // oval clipping path
        ctx.beginPath();
        ctx.ellipse(this.renderX + this.r/3.5, this.renderY - this.r*5/23.5, this.r*2.5/23.5, this.r*5/23.5, 0, 0, Math.PI*2);
        ctx.clip();
        // ctx.closePath();

        // circle
        const eyeOffset = {
            x: Math.cos(this.renderAngle)*this.r*2/23,
            y: Math.sin(this.renderAngle)*this.r*3.5/23
        }
        ctx.fillStyle = '#eeeeee';
        ctx.beginPath();
        ctx.ellipse(this.renderX + this.r/3.5 + eyeOffset.x, this.renderY - this.r*5/23.5 + eyeOffset.y, this.r*3/23.5, this.r*3/23.5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

        ctx.save();
        // oval clipping path
        ctx.beginPath();
        ctx.ellipse(this.renderX - this.r/3.5, this.renderY - this.r*5/23.5, this.r*2.5/23.5, this.r*5/23.5, 0, 0, Math.PI*2);
        ctx.clip();

        ctx.fillStyle = '#eeeeee';
        ctx.beginPath();
        ctx.ellipse(this.renderX - this.r/3.5 + eyeOffset.x, this.renderY - this.r*5/23.5 + eyeOffset.y, this.r*3/23.5, this.r*3/23.5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

        // triangle that makes the player look angry
        const offset = (this.petalDistance - petalDistance*2.15)/35;
        ctx.fillStyle = '#ffe763';
        ctx.beginPath();
        ctx.moveTo(this.renderX - this.r/3.5*2, this.renderY - this.r*14/23.5 + offset);
        ctx.lineTo(this.renderX + this.r/3.5*2, this.renderY - this.r*14/23.5 + offset);
        ctx.lineTo(this.renderX, this.renderY - this.r*5/23.5 + offset);
        ctx.fill();
        ctx.closePath();

    
        // rendering hp
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.roundRect(this.renderX - this.r*1.5, this.renderY + this.r*1.7, this.r*3, this.r*0.35, this.r*0.25);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = '#73de36'
        ctx.beginPath();
        ctx.roundRect(this.renderX - this.r*1.5+1.5, this.renderY + this.r*1.7+1.5, (this.r*3-3)*this.renderHp/this.maxHp, Math.max(0,this.r*0.35-3), this.r*0.25, (this.r*3-3));
        ctx.fill();
        ctx.closePath();

        ctx.lineCap = 'butt';

        this.lastRenderState = this.createRenderState();
    }
    createRenderState(){
        return {
            x: this.x,
            y: this.y,
            hp: this.hp,
            username: this.username,
        }
    }
    updatePack(data){
        for(let key in data){
            if(key === 'petals'){
                for(let i = 0; i < data.petals.length; i++){
                    this.petals[i].updatePack(data.petals[i]);
                }
            } else {
                this[key] = data[key];
            }
        }
        if(this.hp < 0){
            this.hp = 0;
        }
        if(this.hp === undefined){
            this.hp = 100;
        }
    }
}