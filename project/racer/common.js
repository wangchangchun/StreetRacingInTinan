//=========================================================================
// minimalist DOM helpers
//=========================================================================
var Dom = {

  get:  function(id)                     { return ((id instanceof HTMLElement) || (id === document)) ? id : document.getElementById(id); },
  set:  function(id, html)               { Dom.get(id).innerHTML = html;                        },
  on:   function(ele, type, fn, capture) { Dom.get(ele).addEventListener(type, fn, capture);    },
  un:   function(ele, type, fn, capture) { Dom.get(ele).removeEventListener(type, fn, capture); },
  show: function(ele, type)              { Dom.get(ele).style.display = (type || 'block');      },
  blur: function(ev)                     { ev.target.blur();                                    },

  addClassName:    function(ele, name)     { Dom.toggleClassName(ele, name, true);  },
  removeClassName: function(ele, name)     { Dom.toggleClassName(ele, name, false); },
  toggleClassName: function(ele, name, on) {
    ele = Dom.get(ele);
    var classes = ele.className.split(' ');
    var n = classes.indexOf(name);
    on = (typeof on == 'undefined') ? (n < 0) : on;
    if (on && (n < 0))
      classes.push(name);
    else if (!on && (n >= 0))
      classes.splice(n, 1);
    ele.className = classes.join(' ');
  },

  storage: window.localStorage || {}

}

//=========================================================================
// general purpose helpers (mostly math)
//=========================================================================

var Util = {

  timestamp:        function()                  { return new Date().getTime();                                    },
  toInt:            function(obj, def)          { if (obj !== null) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return Util.toInt(def, 0); },
  toFloat:          function(obj, def)          { if (obj !== null) { var x = parseFloat(obj);   if (!isNaN(x)) return x; } return Util.toFloat(def, 0.0); },
  limit:            function(value, min, max)   { return Math.max(min, Math.min(value, max));                     },
  randomInt:        function(min, max)          { return Math.round(Util.interpolate(min, max, Math.random()));   },
  randomChoice:     function(options)           { return options[Util.randomInt(0, options.length-1)];            },
  percentRemaining: function(n, total)          { return (n%total)/total;                                         },
  accelerate:       function(v, accel, dt)      { return v + (accel * dt);                                        },
  interpolate:      function(a,b,percent)       { return a + (b-a)*percent                                        },
  easeIn:           function(a,b,percent)       { return a + (b-a)*Math.pow(percent,2);                           },
  easeOut:          function(a,b,percent)       { return a + (b-a)*(1-Math.pow(1-percent,2));                     },
  easeInOut:        function(a,b,percent)       { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        },
  exponentialFog:   function(distance, density) { return 1 / (Math.pow(Math.E, (distance * distance * density))); },

  increase:  function(start, increment, max) { // with looping
    var result = start + increment;
    while (result >= max)
      result -= max;
    while (result < 0)
      result += max;
    return result;
  },

  project: function(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
    p.camera.x     = (p.world.x || 0) - cameraX;
    p.camera.y     = (p.world.y || 0) - cameraY;
    p.camera.z     = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/2) - (p.screen.scale * p.camera.y  * height/2));
    p.screen.w     = Math.round(             (p.screen.scale * roadWidth   * width/2));
  },

  overlap: function(x1, w1, x2, w2, percent) {
    var half = (percent || 1)/2;
    var min1 = x1 - (w1*half);
    var max1 = x1 + (w1*half);
    var min2 = x2 - (w2*half);
    var max2 = x2 + (w2*half);
    return ! ((max1 < min2) || (min1 > max2));
  }

}

//=========================================================================
// POLYFILL for requestAnimationFrame
//=========================================================================

if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                 window.mozRequestAnimationFrame    || 
                                 window.oRequestAnimationFrame      || 
                                 window.msRequestAnimationFrame     || 
                                 function(callback, element) {
                                   window.setTimeout(callback, 1000 / 60);
                                 }
}

//=========================================================================
// GAME LOOP helpers
//=========================================================================

var Game = {  // a modified version of the game loop from my previous boulderdash game - see http://codeincomplete.com/posts/2011/10/25/javascript_boulderdash/#gameloop

  run: function(options) {

    Game.loadImages(options.images, function(images) {

      options.ready(images); // tell caller to initialize itself because images are loaded and we're ready to rumble

      Game.setKeyListener(options.keys);

      var canvas = options.canvas,    // canvas render target is provided by caller
          update = options.update,    // method to update game logic is provided by caller
          render = options.render,    // method to render the game is provided by caller
          step   = options.step,      // fixed frame step (1/fps) is specified by caller
          stats  = options.stats,     // stats instance is provided by caller
          now    = null,
          last   = Util.timestamp(),
          dt     = 0,
          gdt    = 0;

      function frame() {
        now = Util.timestamp();
        dt  = Math.min(1, (now - last) / 1000); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
        gdt = gdt + dt;
        while (gdt > step) {
          gdt = gdt - step;
          update(step);
        }
        render();
        //stats.update();
        last = now;
        requestAnimationFrame(frame, canvas);
      }
      frame(); // lets get this party started
//      Game.playMusic();
    });
  },

  //---------------------------------------------------------------------------

  loadImages: function(names, callback) { // load multiple images and callback when ALL images have loaded
    var result = [];
    var count  = names.length;

    var onload = function() {
      if (--count == 0)
        callback(result);
    };

    for(var n = 0 ; n < names.length ; n++) {
      var name = names[n];
      result[n] = document.createElement('img');
      Dom.on(result[n], 'load', onload);
      result[n].src = "images/" + name + ".png";
    }
  },

  //---------------------------------------------------------------------------

  setKeyListener: function(keys) {
    var onkey = function(keyCode, mode) {
      var n, k;
      for(n = 0 ; n < keys.length ; n++) {
        k = keys[n];
        k.mode = k.mode || 'up';
        if ((k.key == keyCode) || (k.keys && (k.keys.indexOf(keyCode) >= 0))) {
          if (k.mode == mode) {
            k.action.call();
          }
        }
      }
    };
    Dom.on(document, 'keydown', function(ev) { onkey(ev.keyCode, 'down'); } );
    Dom.on(document, 'keyup',   function(ev) { onkey(ev.keyCode, 'up');   } );
  },

  //---------------------------------------------------------------------------
/*
  stats: function(parentId, id) { // construct mr.doobs FPS counter - along with friendly good/bad/ok message box

    var result = new Stats();
    result.domElement.id = id || 'stats';
    Dom.get(parentId).appendChild(result.domElement);

    var msg = document.createElement('div');
    msg.style.cssText = "border: 2px solid gray; padding: 5px; margin-top: 5px; text-align: left; font-size: 1.15em; text-align: right;";
    msg.innerHTML = "Your canvas performance is ";
    Dom.get(parentId).appendChild(msg);

    var value = document.createElement('span');
    value.innerHTML = "...";
    msg.appendChild(value);

    setInterval(function() {
      var fps   = result.current();
      var ok    = (fps > 50) ? 'good'  : (fps < 30) ? 'bad' : 'ok';
      var color = (fps > 50) ? 'green' : (fps < 30) ? 'red' : 'gray';
      value.innerHTML       = ok;
      value.style.color     = color;
      msg.style.borderColor = color;
    }, 5000);
    return result;
  },*/

  //---------------------------------------------------------------------------
/*
  playMusic: function() {
    var music = Dom.get('music');
    music.loop = true;
    music.volume = 0.05; // shhhh! annoying music!
    music.muted = (Dom.storage.muted === "true");
    music.play();
    Dom.toggleClassName('mute', 'on', music.muted);
    Dom.on('mute', 'click', function() {
      Dom.storage.muted = music.muted = !music.muted;
      Dom.toggleClassName('mute', 'on', music.muted);
    });
  }

*/
}
//=========================================================================
// canvas rendering helpers
//=========================================================================

var Render = {

  polygon: function(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  },

  //---------------------------------------------------------------------------

  segment: function(ctx, width, lanes, x1, y1, w1, x2, y2, w2, fog, color) {

    var r1 = Render.rumbleWidth(w1, lanes),
        r2 = Render.rumbleWidth(w2, lanes),
        l1 = Render.laneMarkerWidth(w1, lanes),
        l2 = Render.laneMarkerWidth(w2, lanes),
        lanew1, lanew2, lanex1, lanex2, lane;
   

    // Set the color of background
    ctx.fillStyle = color.grass;
    ctx.fillRect(0, y2, width, y1 - y2);
    

    Render.polygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
    Render.polygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
    Render.polygon(ctx, x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, color.road);
    
    if (color.lane) {
      lanew1 = w1*2/lanes;
      lanew2 = w2*2/lanes;
      lanex1 = x1 - w1 + lanew1;
      lanex2 = x2 - w2 + lanew2;
      for(lane = 1 ; lane < lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
        Render.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
    }
    
    Render.fog(ctx, 0, y1, width, y2-y1, fog);
  },

  //---------------------------------------------------------------------------

  background: function(ctx, background, width, height, layer, rotation, offset) {

    rotation = rotation || 0;
    offset   = offset   || 0;

    var imageW = layer.w/2;
    var imageH = layer.h;

    var sourceX = layer.x + Math.floor(layer.w * rotation);
    var sourceY = layer.y
    var sourceW = Math.min(imageW, layer.x+layer.w-sourceX);
    var sourceH = imageH;
    
    var destX = 0;
    var destY = offset;
    var destW = Math.floor(width * (sourceW/imageW));
    var destH = height;

    ctx.drawImage(background, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
    if (sourceW < imageW)
      ctx.drawImage(background, layer.x, sourceY, imageW-sourceW, sourceH, destW-1, destY, width-destW, destH);
  },

  //---------------------------------------------------------------------------

  sprite: function(ctx, width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY) {

                    //  scale for projection AND relative to roadWidth (for tweakUI)
    var destW  = (sprite.w * scale * width/2) * (SPRITES.SCALE * roadWidth)*2;
    var destH  = (sprite.h * scale * width/2) * (SPRITES.SCALE * roadWidth)*2;

    destX = destX + (destW * (offsetX || 0));
    destY = destY + (destH * (offsetY || 0));

    var clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;
    if (clipH < destH)
      ctx.drawImage(sprites, sprite.x, sprite.y, sprite.w, sprite.h - (sprite.h*clipH/destH), destX, destY, destW, destH - clipH);

  },

  //---------------------------------------------------------------------------

  player: function(ctx, width, height, resolution, roadWidth, sprites, sprite, speedPercent, scale, destX, destY, steer, updown) {

    var bounce = (1.5 * Math.random() * speedPercent * resolution) * Util.randomChoice([-1,1]);
    /*var sprite;
    if (steer < 0)
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_LEFT : SPRITES.PLAYER_LEFT;
    else if (steer > 0)
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_RIGHT : SPRITES.PLAYER_RIGHT;
    else
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_STRAIGHT : SPRITES.PLAYER_STRAIGHT;
*/
    Render.sprite(ctx, width/4, height/4, resolution, roadWidth, sprites, sprite, scale, destX, destY + bounce, -0.5, -1);
  },

  //---------------------------------------------------------------------------

  fog: function(ctx, x, y, width, height, fog) {
    if (fog < 1) {
      ctx.globalAlpha = (1-fog)
      ctx.fillStyle = COLORS.FOG;
      ctx.fillRect(x, y, width, height);
      ctx.globalAlpha = 1;
    }
  },

  rumbleWidth:     function(projectedRoadWidth, lanes) { return projectedRoadWidth/Math.max(6,  2*lanes); },
  laneMarkerWidth: function(projectedRoadWidth, lanes) { return projectedRoadWidth/Math.max(32, 8*lanes); }

}

//=============================================================================
// RACING GAME CONSTANTS
//=============================================================================

var KEY = {
  LEFT:  37,
  UP:    38,
  RIGHT: 39,
  DOWN:  40,
  A:     65,
  D:     68,
  S:     83,
  W:     87
};


// Set COLORS
var COLORS = {
  SKY:  '#00FFFF',
  TREE: '#CC6600',
  FOG:  '#CC6600',
  INTERSECTION: {road: '#696969', grass: '#696969', rumble: '#696969'},
  LIGHT:  { road: '#696969', grass: '#663300', rumble: '#696969', lane: '#CCCCCC'},
  DARK:   { road: '#696969', grass: '#663300', rumble: '#696969'},
  START:  { road: 'white',   grass: 'white', rumble: 'white'},
  FINISH: { road: '#FFF8DC',   grass: '#663300', rumble: '#663300'},
  RIVER:  { road: '#00FFFF', grass: '#00FFFF', rumble: '#F0FFFF'}
};


var BACKGROUND = {
  HILLS: { x:   5, y: 1510  , w: 2665, h: 600 },
  SKY:   { x:   0, y: 5, w: 2665, h: 1500 },
  TREES: { x:   5, y: 1510, w: 2665, h: 600 }
};

var SPRITES = {
  TREE1:                  { x: 0, y: 0, w: 200, h: 250},
  TREE2:                  { x: 0, y: 275, w: 200, h: 225},
  TREE3:                  { x: 0, y: 525, w: 200, h: 250},
  TREE4:                  { x: 0, y: 800, w: 200, h: 250},
  TREE5:                  { x: 225, y: 0, w: 275, h: 225},
  TREE6:                  { x: 275, y: 250, w: 200, h: 275},
  TREE7:                  { x: 225, y: 550, w: 250, h: 225},
  TREE8:                  { x: 225, y: 800, w: 250, h: 250},
  TREE9:                  { x: 0, y: 1075, w: 300, h: 365},
  TREE10:                 { x: 35, y: 1465, w: 325, h: 300},
  TREE11:                 { x: 325, y: 1095, w: 325, h: 350},
  TREE12:                 { x: 375, y: 1450, w: 275, h: 300},
  BUILDING1_RIGHT:        { x: 510, y: 25, w: 275, h: 225},
  BUILDING1_LEFT:         { x: 800, y: 25, w: 275, h: 225},
  BUILDING2_RIGHT:        { x: 475, y: 275, w: 300, h: 440},
  BUILDING2_LEFT:         { x: 800, y: 275, w: 300, h: 440},
  BUILDING3_RIGHT:        { x: 500, y: 720, w: 275, h: 315},
  BUILDING3_LEFT:         { x: 800, y: 720, w: 275, h: 315},
  BUILDING4_LEFT:         { x: 0, y: 1815, w: 550, h: 710},
  BUILDING5:              { x: 0, y: 2575, w: 575, h: 475},
  BUILDING6_RIGHT:        { x: 0, y: 3100, w: 535, h: 310},
  BUILDING7_RIGHT:        { x: 0, y: 3400, w: 535, h: 375},
  BUILDING8_RIGHT:        { x: 0, y: 3810, w: 535, h: 455},
  BUILDING9_RIGHT:        { x: 0, y: 4265, w: 535, h: 440},
  BUILDING10_RIGHT:       { x: 550, y: 1725, w: 475, h: 425},
  BUILDING10_LEFT:        { x: 1025, y: 1725, w: 475, h: 425},
  BUILDING11_RIGHT:       { x: 575, y: 2175, w: 425, h: 365},
  BUILDING11_LEFT:        { x: 1025, y: 2175, w: 425, h: 365},
  BUILDING12_RIGHT:       { x: 615, y: 2550, w: 400, h: 390},
  BUILDING12_LEFT:        { x: 1040, y: 2550, w: 400, h: 390},
  BUILDING13_RIGHT:       { x: 650, y: 2940, w: 350, h: 275},
  BUILDING13_LEFT:        { x: 1025, y: 2940, w: 350, h: 275},
  BUILDING14_RIGHT:       { x: 620, y: 3275, w: 400, h: 200},
  BUILDING14_LEFT:        { x: 1025, y: 3275, w: 400, h: 200},
  BUILDING15:             { x: 560, y: 3500, w: 500, h: 400},
  BUILDING16:             { x: 1110, y: 3500, w: 350, h: 375},
  BUILDING17_RIGHT:       { x: 525, y: 3950, w: 475, h: 200},
  BUILDING17_LEFT:        { x: 1025, y: 3950, w: 475, h: 200},
  BUILDING17S_RIGHT:      { x: 750, y: 4150, w: 250, h: 140},
  BUILDING17S_LEFT:       { x: 1025, y: 4150, w: 250, h: 140},
  BUILDING18_RIGHT:       { x: 575, y: 4300, w: 450, h: 200},
  BUILDING18_LEFT:        { x: 1025, y: 4300, w: 450, h: 200},
  BUILDING18S_RIGHT:      { x: 825, y: 4525, w: 175, h: 125},
  BUILDING18S_LEFT:       { x: 1025, y: 4525, w: 200, h: 125},
  BUILDING19_LEFT:        { x: 500, y: 4700, w: 350, h: 325},
  BUILDING20:             { x: 1050, y: 4700, w: 475, h: 325},
  MONUMENT_LEFT:          { x: 1175, y: 25, w: 150, h: 200},
  PLAYER_UPHILL_LEFT:     { x: 2300, y: 950, w:  280, h:   225 },
  PLAYER_UPHILL_STRAIGHT: { x: 2300, y: 950, w:  280, h:   225 },
  PLAYER_UPHILL_RIGHT:    { x: 2300, y: 950, w: 280, h:   225 },
  PLAYER_LEFT:            { x:  1240, y:  450, w:  180, h:   115 },
  PLAYER_STRAIGHT:        { x: 1100, y: 455, w:  140, h:   105 },
  PLAYER_RIGHT:           { x:  1240, y:  560, w:  180, h:   120 },
  RIVAL_STRAIGHT:         { x: 310, y: 4725, w: 140, h: 105},
  SHIP_STRAIGHT:          { x: 710, y: 1580, w: 180, h: 145},
  HORSE_STRAIGHT:         { x: 160, y: 4760, w: 100, h: 220},
  TEST:{x:1100,y:455,w:140,h:105}
};

SPRITES.SCALE = 0.35 * (1/SPRITES.PLAYER_STRAIGHT.w)*2 // the reference sprite width should be 1/3rd the (half-)roadWidth
//SPRITES.SCALE = 0.3*(1/80)

SPRITES.BILLBOARDS = [SPRITES.BILLBOARD01, SPRITES.BILLBOARD02, SPRITES.BILLBOARD03, SPRITES.BILLBOARD04, SPRITES.BILLBOARD05, SPRITES.BILLBOARD06, SPRITES.BILLBOARD07, SPRITES.BILLBOARD08, SPRITES.BILLBOARD09];
SPRITES.PLANTS     = [SPRITES.TREE1, SPRITES.TREE2, SPRITES.TREE3, SPRITES.TREE4, SPRITES.TREE5, SPRITES.TREE6, SPRITES.TREE7, SPRITES.TREE8, SPRITES.TREE9, SPRITES.TREE10, SPRITES.TREE11, SPRITES.TREE12, SPRITES.TREE13, SPRITES.TREE14, SPRITES.TREE15];
SPRITES.CARS       = [SPRITES.CAR01, SPRITES.CAR02, SPRITES.CAR03, SPRITES.CAR04, SPRITES.SEMI, SPRITES.TRUCK];

$(document).ready(function(){
	setTimeout(function(){
		$("#bg").css("opacity","0");
	},3000)
})