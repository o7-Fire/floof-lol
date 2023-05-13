window.chatOpen = false;
window.camera = { x: 0, y: 0, scale: 1 };
window.selfId = 1;

window.connected = false;
window.disconnected = false;

window.won = false;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');ctx.lineJoin = 'round';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const ref = {
    gui: document.querySelector('.gui'),
    chatDiv: document.querySelector('.chatDiv'),
    chatInput: document.querySelector('.chat'),
    nameInput: document.querySelector(".name"),
    chatMessages: document.querySelector('.chat-div'),
    canvas: canvas,
    mobile: document.querySelector('.mobile'),
    defendButton: document.querySelector('.defendButton'),
    attackButton: document.querySelector('.attackButton'),
};

// USE THIS
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r, maxW=w) {
  // width isn't from a scale of 0-maxWidth. It's on a scale from r*2 to maxWidth.
  // thus, multiply as such
  w *= (maxW-r*2)/maxW;
  w += r*2;
  // if (w < 2 * r) {
  //     // return true;
  //     r = w / 2;

  //     // // basically just render a straight line instead of a curve at the end for hp bar
  //     // // this.moveTo(x+r, y);
  //     // // this.lineTo(x+r, y+h);
  //     // // this.lineTo(x+r, y+h/2);
  //     // this.arc(x+h/2, y+h/2, h/2, Math.PI/2, Math.PI*3/2);
  //     // this.lineTo(x+h/2, y+h);
  //     // // this.arc(x+r, y+r)
  //     // return;
  // }
  if (h < 2 * r) r = h / 2;
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
};

// CanvasRenderingContext2D.prototype.fill = function(a) {
//     return function(a,b) {
//         if(this.globalAlpha !== 1){
//             console.log(this.fillStyle, this.strokeStyle);
//         }
//         a.call(this,a,b);
//     };
// }(CanvasRenderingContext2D.prototype.fill);

// CanvasRenderingContext2D.prototype.roundRect = function(a) {
//     return function(x, y, w, h, r) {
//         // this.globalAlpha = 0.1;
//         a.call(this, x, y, w, h, r);
//     };
// }(CanvasRenderingContext2D.prototype.roundRect);

// window.portalGradient = ctx.createLinearGradient(0, 0, 100, 0);
// window.portalGradient.addColorStop(0, "rgba(247, 207, 47, 0)");
// window.portalGradient.addColorStop(1, "rgba(247, 207, 47, 1)");

const mouseImg = new Image();
mouseImg.src = './gfx/mopemouse.webp';
const peaImg = new Image();
peaImg.src = "./gfx/pea.webp";
const cactusImg = new Image();
cactusImg.src = "./gfx/cactus.webp";

window.mobile = false;

if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    window.mobile = true;
    // hide the chat div
    ref.chatDiv.style.display = 'none';
    ref.attackButton.style.visibility = 'visible';
    ref.defendButton.style.visibility = 'visible';
}