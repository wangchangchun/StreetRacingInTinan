$(document).ready(function() { 
  const ID = window.sessionStorage.getItem("playId");
  $("#game").hide();
  $("#return").hide();
  $("#waitingRoom").hide();
  document.getElementById("place").setAttribute("src","./images/res/castle.png");
  $('#4').hide();
  $('#2').hide();
  $('#3').hide();
  /*$.ajax({
    url:"./readBtn",
    method:"POST",
    type:"get",
    data:{

    },
    success:(res)=>{
    var sp = res.split(" ");
    for (var i=0;i<sp.length-1;i++){

    $("#roomList").append("<button class='ui purple button'>"+sp[i]+"</button>")
    }
    }
    })*/
  var socket = io();
  $("#out").click(()=>{
    document.location.href= "../gameStart/index.html";

  })
  $("#createOk").click(()=>{
    socket.emit('create',{id:ID,num:$('#numSelect').val(),map:$('#mapSelect').val()});
    console.log($('#mapSelect').val())
      $('#createModal').modal('hide');
    $("#background").html("<img class='img-fuild' id='bg_pic' src='./src/bg.png'>")
      $("#menu").hide();
    $("#waitingRoom").show();
  })
  $("#searchOk").click(()=>{
    socket.emit('search',{id:ID,search:$('#searchInput').val()});
    $("#background").html("<img class='img-fuild' id='bg_pic' src='./src/bg.png'>")
      $("#menu").hide();
    $("#waitingRoom").show();
    $("#multiStart").hide();
    $.ajax({
      url:"./roomData",
      method:"POST",
      type:"post",
      data:{
        roomId:$('#searchInput').val()
      },
      success:(res)=>{
        $("#inRoom").append(res);

      }
    })
  })
  $("#multiStart").click(()=>{
    //alert('start click!')
    socket.emit('startGame',window.sessionStorage.getItem("roomId"))
  })
  socket.on('start',function(data){
    //alert('get start')
    window.sessionStorage.setItem("map",data)
      $("#waitingRoom").hide();
    $("#game").show();
    $("#background").hide();

  })
  socket.on('rivalPosition',function(data){
    window.sessionStorage.setItem("rival",data.position);
    window.sessionStorage.setItem("rivalX",data.playerX);

  })
  socket.on('connectToRoom',function(data) {
    window.sessionStorage.setItem("roomId",data.roomId);
    $("#inRoom").append("<div class =\"memberBlock\"><img src = \"./src/member.png\"> <p>"+data.id+"</p></div>")
  })
  socket.on('disconnect',function(data){
    socket.emit('disconnect',ID)

  })
  $("#sendMsg").click(()=>{
    socket.emit('chat message',{ msg:$('#m').val(),roomId: window.sessionStorage.getItem("roomId")});
    $('#m').val('');
  })
  socket.on('message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
  $("#auto").click(()=>{
    socket.emit('auto',ID)
  })
  $('.dropdown').dropdown();
  $('.cancel').click(()=>{
    $('.modal').modal('hide');
  })
  $('#searchModal').modal('attach events', '#search', 'show');
  $('#createModal').modal('attach events', '#create', 'show');


  function isMobile() {
    try{ document.createEvent("TouchEvent"); return true; }
    catch(e){ return false;}
  }
  if(isMobile())
  {
    document.getElementById("up").style.display="block";
    document.getElementById("down").style.display="block";
    document.getElementById("left").style.display="block";
    document.getElementById("right").style.display="block";
  }
  window.addEventListener("orientationchange",onOrientationchange ,false);
  function onOrientationchange() {
    if (window.orientation === 180 || window.orientation === 0) {
      var locOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || screen.orientation.lock;
      locOrientation('landscape');
    }
  }
  //////////////////////////API///////////////////////////////////
  //=======
  var id = window.sessionStorage.getItem("playId");
  $("#return").click(()=>{
    document.location.href= "../gameStart/index.html";
  })
  var fps            = 60;                      // how many 'update' frames per second
  var step           = 1/fps;                   // how long is each frame (in seconds)
  var width          = 1024;                    // logical canvas width
  var height         = 768;                     // logical canvas height
  var centrifugal    = 0.3;                     // centrifugal force multiplier when going around curves
  var offRoadDecel   = 0.99;                    // speed multiplier when off road (e.g. you lose 2% speed each update frame)
  var skySpeed       = 0.001;                   // background sky layer scroll speed when going around curve (or up hill)
  var hillSpeed      = 0.002;                   // background hill layer scroll speed when going around curve (or up hill)
  var treeSpeed      = 0.003;                   // background tree layer scroll speed when going around curve (or up hill)
  var skyOffset      = 0;                       // current sky scroll offset
  var hillOffset     = 0;                       // current hill scroll offset
  var treeOffset     = 0;                       // current tree scroll offset
  var segments       = [];                      // array of road segments
  var cars           = [];                      // array of cars on the road
  //var stats          = Game.stats('fps');       // mr.doobs FPS counter
  var canvas         = Dom.get('canvas');       // our canvas...
  var ctx            = canvas.getContext('2d'); // ...and its drawing context
  var background     = null;                    // our background image (loaded below)
  var sprites        = null;                    // our spritesheet (loaded below)
  var resolution     = null;                    // scaling factor to provide resolution independence (computed)
  var roadWidth      = 2000;                    // actually half the roads width, easier math if the road spans from -roadWidth to +roadWidth
  var segmentLength  = 200;                     // length of a single segment
  var rumbleLength   = 3;                       // number of segments per red/white rumble strip
  var trackLength    = null;                    // z length of entire track (computed)
  var lanes          = 3;                       // number of lanes
  var fieldOfView    = 100;                     // angle (degrees) for field of view
  var cameraHeight   = 1000;                    // z height of camera
  var cameraDepth    = null;                    // z distance camera is from screen (computed)
  var drawDistance   = 300;                     // number of segments to draw
  var playerX        = 0;                       // player x offset from center of road (-1 to 1 to stay independent of roadWidth)
  var playerZ        = null;                    // player relative z distance from camera (computed)
  var fogDensity     = 5;                       // exponential fog density
  var position       = 0;                       // current camera Z position (add playerZ to get player's absolute Z position)
  var speed          = 0;                       // current speed
  var maxSpeed       = segmentLength/step;      // top speed (ensure we can't move more than 1 segment in a single frame to make collision detection easier)
  var accel          =  maxSpeed/5;             // acceleration rate - tuned until it 'felt' right
  var breaking       = -maxSpeed;               // deceleration rate when braking
  var decel          = -maxSpeed/5;             // 'natural' deceleration rate when neither accelerating, nor braking
  var offRoadDecel   = -maxSpeed/2;             // off road deceleration is somewhere in between
  var offRoadLimit   =  maxSpeed/4;             // limit when off road deceleration no longer applies (e.g. you can always go at least this speed even when off road)
  var totalCars      = 200;                     // total number of cars on the road
  var currentLapTime = 0;                       // current lap time
  var lastLapTime    = null;                    // last lap time
  var rival          = 0;
  var player_sprite = SPRITES.PLAYER_STRAIGHT;
  // for selecting track and car
  var track_num = $('#mapSelect').val();
  console.log(track_num);
  //var car_num = window.sessionStorage.getItem("car_num");
  if(track_num == 1)document.getElementById("place").setAttribute("src","./images/res/castle.png");
  else if(track_num == 2)document.getElementById("place").setAttribute("src","./images/res/hall.png");
  else if(track_num == 3)document.getElementById("place").setAttribute("src","./images/res/temple.png");
  else if(track_num == 4)document.getElementById("place").setAttribute("src","./images/res/park.png");
  var keyLeft        = false;
  var keyRight       = false;
  var keyFaster      = false;
  var keySlower      = false;
  //var id = window.sessionStorage.getItem("playId");
  var gameover       = false;
  var recordSend     = false;
  var hud = {
    speed:            { value: null, dom: Dom.get('speed_value')            },
    current_lap_time: { value: null, dom: Dom.get('current_lap_time_value') },
    last_lap_time:    { value: null, dom: Dom.get('last_lap_time_value')    },
    fast_lap_time:    { value: null, dom: Dom.get('fast_lap_time_value')    },
    position:         { value: null, dom: Dom.get('position_value')},
    rival:            { value: null, dom: Dom.get('rival_value')}
  }
  //=========================================================================
  // UPDATE THE GAME WORLD
  //=========================================================================
  function update(dt) {
    var n, car, carW, sprite, spriteW;
    var playerSegment = findSegment(position+playerZ);
    var playerW       = SPRITES.PLAYER_STRAIGHT.w * SPRITES.SCALE;
    var speedPercent  = speed/maxSpeed;
    var dx            = dt * 2 * speedPercent; // at top speed, should be able to cross from left to right (-1 to 1) in 1 second
    var startPosition = position;
    track_num = window.sessionStorage.getItem("map")
      if(!gameover){
        document.getElementById("introduction").style.display = 'none';
        document.getElementById("destination").style.display = 'none';
      }
      else{
        document.getElementById("introduction").style.display = 'block';  
        document.getElementById("introduction").style.top = '100px';
        document.getElementById("introduction").style.left = '600px';
        document.getElementById("destination").style.display = 'block';
        $("#return").show();
        $('#place').animate({height: "300px",width: "820px",left: "7%",top: "4%"},5000);
      }
    updateCars(dt, playerSegment, playerW);
    position = Util.increase(position, dt * speed, trackLength);
    if (keyLeft && !gameover)
      playerX = playerX - dx;
    else if (keyRight &&!gameover)
      playerX = playerX + dx;
    playerX = playerX - (dx * speedPercent * playerSegment.curve * centrifugal);
    if (keyFaster && !gameover)
      speed = Util.accelerate(speed, accel, dt);
    else if (keySlower && !gameover)
      speed = Util.accelerate(speed, breaking, dt);
    else
      speed = Util.accelerate(speed, decel, dt);
    if ((playerX < -1) || (playerX > 1)) {
      if (speed > offRoadLimit)
        speed = Util.accelerate(speed, offRoadDecel, dt);
      for(n = 0 ; n < playerSegment.sprites.length ; n++) {
        sprite  = playerSegment.sprites[n];
        spriteW = sprite.source.w * SPRITES.SCALE;
        if (Util.overlap(playerX, playerW, sprite.offset + spriteW/2 * (sprite.offset > 0 ? 1 : -1), spriteW)) {
          speed = maxSpeed/5;
          position = Util.increase(playerSegment.p1.world.z, -playerZ, trackLength); // stop in front of sprite (at front of segment)
          break;
        }
      }
    }
    for(n = 0 ; n < playerSegment.cars.length ; n++) {
      car  = playerSegment.cars[n];
      carW = car.sprite.w * SPRITES.SCALE;
      if (speed > car.speed) {
        if (Util.overlap(playerX, playerW, car.offset, carW, 0.8)) {
          speed    = car.speed * (car.speed/speed);
          position = Util.increase(car.z, -playerZ, trackLength);
          break;
        }
      }
    }
    playerX = Util.limit(playerX, -3, 3);     // dont ever let it go too far out of bounds
    speed   = Util.limit(speed, 0, maxSpeed); // or exceed maxSpeed
    skyOffset  = Util.increase(skyOffset,  skySpeed  * playerSegment.curve * (position-startPosition)/segmentLength, 1);
    hillOffset = Util.increase(hillOffset, hillSpeed * playerSegment.curve * (position-startPosition)/segmentLength, 1);
    treeOffset = Util.increase(treeOffset, treeSpeed * playerSegment.curve * (position-startPosition)/segmentLength, 1);
    if(position > trackLength - segmentLength*650){
      gameover = true;
      if(!recordSend){
        $.ajax({
          method: "post",
          url: "./racer/saveRecord",
          data: {
            ID:id ,
            map:track_num,
            THISTIME: currentLapTime
          },
          success: function(data) {
            // $("#ajax_content").text(data)
          }
        })
        recordSend=true;
      }
      if(speed >= 50)speed = speed - 50;
      else speed = 0;
    }
    if (position > playerZ) {
      if (currentLapTime && (startPosition < playerZ)) {
        lastLapTime    = currentLapTime;
        currentLapTime = 0;
        if (lastLapTime <= Util.toFloat(Dom.storage.fast_lap_time)) {
          Dom.storage.fast_lap_time = lastLapTime;
          updateHud('fast_lap_time', formatTime(lastLapTime));
          Dom.addClassName('fast_lap_time', 'fastest');
          Dom.addClassName('last_lap_time', 'fastest');
        }
        else {
          Dom.removeClassName('fast_lap_time', 'fastest');
          Dom.removeClassName('last_lap_time', 'fastest');
        }
        updateHud('last_lap_time', formatTime(lastLapTime));
        Dom.show('last_lap_time');
      }
      else {
        currentLapTime += dt;
      }
    }
    socket.emit('position',{id:ID,roomId: window.sessionStorage.getItem("roomId"),position:position,playerX:playerX})
      updateHud('speed',            5 * Math.round(speed/500));
    updateHud('current_lap_time', formatTime(currentLapTime));
    updateHud('position', position);
    updateHud('rival',window.sessionStorage.getItem("rival"));
  }
  //-------------------------------------------------------------------------
  function updateCars(dt, playerSegment, playerW) {
    var n, car, oldSegment, newSegment;
    for(n = 0 ; n < cars.length ; n++) {
      car         = cars[n];
      oldSegment  = findSegment(car.z);
      car.offset  = car.offset + updateCarOffset(car, oldSegment, playerSegment, playerW);
      car.z       = Util.increase(car.z, dt * car.speed, trackLength);
      car.percent = Util.percentRemaining(car.z, segmentLength); // useful for interpolation during rendering phase
      newSegment  = findSegment(car.z);
      if (oldSegment != newSegment) {
        index = oldSegment.cars.indexOf(car);
        oldSegment.cars.splice(index, 1);
        newSegment.cars.push(car);
      }
    }
  }
  function updateCarOffset(car, carSegment, playerSegment, playerW) {
    var i, j, dir, segment, otherCar, otherCarW, lookahead = 20, carW = car.sprite.w * SPRITES.SCALE;
    // optimization, dont bother steering around other cars when 'out of sight' of the player
    if ((carSegment.index - playerSegment.index) > drawDistance)
      return 0;
    for(i = 1 ; i < lookahead ; i++) {
      segment = segments[(carSegment.index+i)%segments.length];
      if ((segment === playerSegment) && (car.speed > speed) && (Util.overlap(playerX, playerW, car.offset, carW, 1.2))) {
        if (playerX > 0.5)
          dir = -1;
        else if (playerX < -0.5)
          dir = 1;
        else
          dir = (car.offset > playerX) ? 1 : -1;
        return dir * 1/i * (car.speed-speed)/maxSpeed; // the closer the cars (smaller i) and the greated the speed ratio, the larger the offset
      }
      for(j = 0 ; j < segment.cars.length ; j++) {
        otherCar  = segment.cars[j];
        otherCarW = otherCar.sprite.w * SPRITES.SCALE;
        if ((car.speed > otherCar.speed) && Util.overlap(car.offset, carW, otherCar.offset, otherCarW, 1.2)) {
          if (otherCar.offset > 0.5)
            dir = -1;
          else if (otherCar.offset < -0.5)
            dir = 1;
          else
            dir = (car.offset > otherCar.offset) ? 1 : -1;
          return dir * 1/i * (car.speed-otherCar.speed)/maxSpeed;
        }
      }
    }
    if (car.offset < -0.9)
      return 0.1;
    else if (car.offset > 0.9)
      return -0.1;
    else
      return 0;
  }
  //-------------------------------------------------------------------------
  function updateHud(key, value) { // accessing DOM can be slow, so only do it if value has changed
    if (hud[key].value !== value) {
      hud[key].value = value;
      Dom.set(hud[key].dom, value);
    }
  }
  function formatTime(dt) {
    var minutes = Math.floor(dt/60);
    var seconds = Math.floor(dt - (minutes * 60));
    var tenths  = Math.floor(10 * (dt - Math.floor(dt)));
    if (minutes > 0)
      return minutes + "." + (seconds < 10 ? "0" : "") + seconds + "." + tenths;
    else
      return seconds + "." + tenths;
  }
  //=========================================================================
  // RENDER THE GAME WORLD
  //=========================================================================
  function render() {
    var baseSegment   = findSegment(position);
    var basePercent   = Util.percentRemaining(position, segmentLength);
    var playerSegment = findSegment(position+playerZ);
    var playerPercent = Util.percentRemaining(position+playerZ, segmentLength);
    var playerY       = Util.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);

    var position_r = window.sessionStorage.getItem("rival");
    var baseSegment_r = findSegment(position_r);
    //var basePercent_r = Util.percentRemaining(position_r,segmentLength);
    var rivalSegment = findSegment(position_r);
    var rivalPercent = Util.percentRemaining(position_r,segmentLength);
    //var rivalY = Util.interpolate(rivalSegment.p1.world.y,rivalSegment.p2.world.y,rivalPercent);
    var rivalX = window.sessionStorage.getItem("rivalX");

    var maxy          = height;
    var x  = 0;
    var dx = - (baseSegment.curve * basePercent);
    ctx.clearRect(0, 0, width, height);
    Render.background(ctx, background, width, height, BACKGROUND.SKY,   skyOffset,  resolution * skySpeed  * playerY);
    Render.background(ctx, background, width, height, BACKGROUND.HILLS, hillOffset, resolution * hillSpeed * playerY);
    Render.background(ctx, background, width, height, BACKGROUND.TREES, treeOffset, resolution * treeSpeed * playerY);
    var n, i, segment, segment_r, car, sprite, spriteScale, spriteX, spriteY;
    for(n = 0 ; n < drawDistance ; n++) {
      segment        = segments[(baseSegment.index + n) % segments.length]; 
      segment.looped = segment.index < baseSegment.index;
      segment.fog    = Util.exponentialFog(n/drawDistance, fogDensity);
      segment.clip   = maxy;
      Util.project(segment.p1, (playerX * roadWidth) - x,      playerY + cameraHeight, position - (segment.looped ? trackLength : 0), cameraDepth, width, height, roadWidth);
      Util.project(segment.p2, (playerX * roadWidth) - x - dx, playerY + cameraHeight, position - (segment.looped ? trackLength : 0), cameraDepth, width, height, roadWidth);
      x  = x + dx;
      dx = dx + segment.curve;
      if ((segment.p1.camera.z <= cameraDepth)         || // behind us
          (segment.p2.screen.y >= segment.p1.screen.y) || // back face cull
          (segment.p2.screen.y >= maxy))                  // clip by (already rendered) hill
        continue;
      Render.segment(ctx, width, lanes,
          segment.p1.screen.x,
          segment.p1.screen.y,
          segment.p1.screen.w,
          segment.p2.screen.x,
          segment.p2.screen.y,
          segment.p2.screen.w,
          segment.fog,
          segment.color);
      maxy = segment.p1.screen.y;
    }
    for(n = (drawDistance-1) ; n > 0 ; n--) {
      segment = segments[(baseSegment.index + n) % segments.length];
      for(i = 0 ; i < segment.cars.length ; i++) {
        car         = segment.cars[i];
        sprite      = car.sprite;
        spriteScale = Util.interpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.percent);
        spriteX     = Util.interpolate(segment.p1.screen.x,     segment.p2.screen.x,     car.percent) + (spriteScale * car.offset * roadWidth * width/2);
        spriteY     = Util.interpolate(segment.p1.screen.y,     segment.p2.screen.y,     car.percent);
        Render.sprite(ctx, width, height, resolution, roadWidth, sprites, car.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
      }
      for(i = 0 ; i < segment.sprites.length ; i++) {
        sprite      = segment.sprites[i];
        spriteScale = segment.p1.screen.scale/2;
        spriteX     = segment.p1.screen.x + (spriteScale * sprite.offset * roadWidth * width/2);
        spriteY     = segment.p1.screen.y;
        Render.sprite(ctx, width, height, resolution, roadWidth, sprites, sprite.source, spriteScale, spriteX, spriteY, (sprite.offset < 0 ? -1 : 0), -1, segment.clip);
      }
      if (segment == playerSegment) {
        Render.player(ctx, width, height, resolution, roadWidth, sprites, player_sprite, speed/maxSpeed,
            cameraDepth/playerZ,
            width/2,
            (height/2) - (cameraDepth/playerZ * Util.interpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, playerPercent) * height/2),
            speed * (keyLeft ? -1 : keyRight ? 1 : 0),
            playerSegment.p2.world.y - playerSegment.p1.world.y);
      }

      // Render Rival
      if ((segment == rivalSegment) && (position_r - position < 50000)) {
        Render.player(ctx, width, height, resolution, roadWidth, sprites, player_sprite, speed/maxSpeed,
            ((5000*cameraDepth)/(playerZ*(position_r - position))),
            width*((parseFloat(rivalX) + 3.0)/6),
            (height/2) - (((5000*cameraDepth)/(playerZ*(position_r - position))) * Util.interpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, playerPercent) * height/2),
            0,0);
        if(position_r - position < 8000){
          console.log(speed);
          speed = maxSpeed/5;
        }
      }

    }
  }
  function findSegment(z) {
    return segments[Math.floor(z/segmentLength) % segments.length]; 
  }
  //=========================================================================
  // BUILD ROAD GEOMETRY 
  //=========================================================================
  function lastY() { return (segments.length == 0) ? 0 : segments[segments.length-1].p2.world.y; }
  function addSegment(curve, y) {
    var n = segments.length;
    segments.push({
      index: n,
      p1: { world: { y: lastY(), z:  n   *segmentLength }, camera: {}, screen: {} },
      p2: { world: { y: y,       z: (n+1)*segmentLength }, camera: {}, screen: {} },
      curve: curve,
      sprites: [],
      cars: [],
      color: (n > 3740)? COLORS.FINISH : !(Math.floor(n/rumbleLength)%100) ? COLORS.INTERSECTION : !(Math.floor((n - 3)/rumbleLength)%100) ? COLORS.INTERSECTION : !(Math.floor((n - 6)/rumbleLength)%100) ? COLORS.INTERSECTION : !(Math.floor((n + 3)/rumbleLength)%100)? COLORS.INTERSECTION:(Math.floor(n/rumbleLength)%2)? COLORS.LIGHT:COLORS.DARK
    });
  }
  function addSprite(n, sprite, offset) {
    segments[n].sprites.push({ source: sprite, offset: offset });
  }
  function addRoad(enter, hold, leave, curve, y) {
    var startY   = lastY();
    var endY     = startY + (Util.toInt(y, 0) * segmentLength);
    var n, total = enter + hold + leave;
    for(n = 0 ; n < enter ; n++)
      addSegment(Util.easeIn(0, curve, n/enter), Util.easeInOut(startY, endY, n/total));
    for(n = 0 ; n < hold  ; n++)
      addSegment(curve, Util.easeInOut(startY, endY, (enter+n)/total));
    for(n = 0 ; n < leave ; n++)
      addSegment(Util.easeInOut(curve, 0, n/leave), Util.easeInOut(startY, endY, (enter+hold+n)/total));
  }
  var ROAD = {
    LENGTH: { NONE: 0, SHORT:  25, MEDIUM:   50, LONG:  100 },
    HILL:   { NONE: 0, LOW:    20, MEDIUM:   40, HIGH:   60 },
    CURVE:  { NONE: 0, EASY:    2, MEDIUM:    4, HARD:    6 }
  };
  function addStraight(num) {
    num = num || ROAD.LENGTH.MEDIUM;
    addRoad(num, num, num, 0, 0);
  }
  function addHill(num, height) {
    num    = num    || ROAD.LENGTH.MEDIUM;
    height = height || ROAD.HILL.MEDIUM;
    addRoad(num, num, num, 0, height);
  }
  function addCurve(num, curve, height) {
    num    = num    || ROAD.LENGTH.MEDIUM;
    curve  = curve  || ROAD.CURVE.MEDIUM;
    height = height || ROAD.HILL.NONE;
    addRoad(num, num, num, curve, height);
  }
  function addLowRollingHills(num, height) {
    num    = num    || ROAD.LENGTH.SHORT;
    height = height || ROAD.HILL.LOW;
    addRoad(num, num, num,  0,                height/2);
    addRoad(num, num, num,  0,               -height);
    addRoad(num, num, num,  ROAD.CURVE.EASY,  height);
    addRoad(num, num, num,  0,                0);
    addRoad(num, num, num, -ROAD.CURVE.EASY,  height/2);
    addRoad(num, num, num,  0,                0);
  }
  function addSCurves() {
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.EASY,    ROAD.HILL.NONE);
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.MEDIUM,  ROAD.HILL.MEDIUM);
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.EASY,   -ROAD.HILL.LOW);
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.MEDIUM);
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.MEDIUM, -ROAD.HILL.MEDIUM);
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.LOW);
  }
  function addBumps() {
    addRoad(10, 10, 10, 0,  5);
    addRoad(10, 10, 10, 0, -2);
    addRoad(10, 10, 10, 0, -5);
    addRoad(10, 10, 10, 0,  8);
    addRoad(10, 10, 10, 0,  5);
    addRoad(10, 10, 10, 0, -7);
    addRoad(10, 10, 10, 0,  5);
    addRoad(10, 10, 10, 0, -2);
  }
  function addDownhillToEnd(num) {
    num = num || 200;
    addRoad(num, num, num, -ROAD.CURVE.EASY, -lastY()/segmentLength);
  }
  function resetRoad() {
    segments = [];
    if(track_num == 1){
      addStraight(ROAD.LENGTH.MEDIUM);
      addCurve(ROAD.LENGTH.MEDIUM,-ROAD.CURVE.HARD,ROAD.HILL.NONE);
      addCurve(ROAD.LENGTH.MEDIUM,ROAD.CURVE.MEDIUM,ROAD.HILL.NONE);
      addCurve(ROAD.LENGTH.LONG,ROAD.CURVE.MEDIUM,ROAD.HILL.NONE);
      addStraight(ROAD.LENGTH.LONG);
      addCurve(ROAD.LENGTH.MEDIUM,ROAD.CURVE.HARD,ROAD.HILL.NONE);
      addHill(ROAD.LENGTH.MEDIUM,ROAD.HILL.MEDIUM);
      addHill(ROAD.LENGTH.SHORT,-ROAD.HILL.MEDIUM);
      addHill(ROAD.LENGTH.MEDIUM,ROAD.HILL.HIGH);
      addHill(ROAD.LENGTH.MEDIUM,-ROAD.HILL.HIGH);
      addCurve(ROAD.LENGTH.LONG,ROAD.CURVE.HARD,ROAD.HILL.LOW);
      addCurve(ROAD.LENGTH.MEDIUM,ROAD.CURVE.HARD,ROAD.HILL.LOW);
      addSCurves();
      addBumps();
      addBumps();
      addStraight(ROAD.LENGTH.MEDIUM);
    }
    else if(track_num == 2){
      addStraight(ROAD.LENGTH.MEDIUM);
      addCurve(ROAD.LENGTH.SHORT,ROAD.CURVE.HARD,ROAD.HILL.NONE);
      addStraight(ROAD.LENGTH.MEDIUM);
      addHill(ROAD.LENGTH.SHORT,ROAD.HILL.HIGH);
      addSCurves();
      addSCurves();
      addHill(150,-ROAD.HILL.HIGH);
      addCurve(ROAD.LENGTH.SHORT,-ROAD.CURVE.HARD,-ROAD.HILL.MEDIUM);
      addCurve(ROAD.LENGTH.SHORT,ROAD.CURVE.HARD,-ROAD.HILL.MEDIUM);
      addCurve(ROAD.LENGTH.SHORT,ROAD.CURVE.HARD,-ROAD.HILL.MEDIUM);
      addCurve(ROAD.LENGTH.SHORT,-ROAD.CURVE.HARD,-ROAD.HILL.MEDIUM);
      addCurve(ROAD.LENGTH.SHORT,-ROAD.CURVE.HARD,ROAD.HILL.NONE);
      addStraight(ROAD.LENGTH.MEDIUM);
    }
    else if(track_num == 3){
      addStraight(ROAD.LENGTH.MEDIUM);
      addCurve(ROAD.LENGTH.SHORT,-ROAD.CURVE.HARD,ROAD.HILL.NONE);
      addHill(ROAD.LENGTH.MIDIUM,-ROAD.HILL.LOW);
      addCurve(ROAD.LENGTH.SHORT,ROAD.CURVE.MEDIUM,ROAD.HILL.NONE);
      addCurve(ROAD.LENGTH.MEDIUM,-ROAD.CURVE.HARD,ROAD.HILL.NONE);
      addHill(ROAD.LENGTH.LONG,-ROAD.HILL.HIGH);
      addSCurves();
      addStraight(ROAD.LENGTH.SHORT);
      addSCurves();
      addStraight(ROAD.LENGTH.SHORT);
      addCurve(ROAD.LENGTH.SHORT,ROAD.CURVE.HARD,-ROAD.HILL.LOW);
      addBumps();
      addHill(ROAD.LENGTH.LONG,-ROAD.HILL.HIGH);
    }
    else if(track_num == 4){
      addCurve(ROAD.LENGTH.MEDIUM,-ROAD.CURVE.EASY,ROAD.HILL.NONE);
      addSCurves();
      addBumps();
      addBumps();
      addBumps();
      addCurve(ROAD.LENGTH.SHORT,-ROAD.CURVE.EASY,ROAD.HILL.NONE);
      addSCurves();
      addStraight(ROAD.LENGTH.SHORT);
      addCurve(ROAD.LENGTH.SHORT,ROAD.CURVE.EASY,ROAD.HILL.NONE);
      addCurve(ROAD.LENGTH.MEDIUM,-ROAD.CURVE.HARD,ROAD.HILL.NONE);
      addStraight(ROAD.LENGTH.SHORT);
      addCurve(ROAD.LENGTH.MEDIUM,ROAD.CURVE.HARD,ROAD.HILL.NONE);
      addCurve(ROAD.LENGTH.MEDIUM,ROAD.CURVE.HARD,ROAD.HILL.NONE);
      addStraight(ROAD.LENGTH.MEDIUM);
    }
    addDownhillToEnd();
    resetSprites();
    resetCars();
    segments[findSegment(playerZ).index + 2].color = COLORS.START;
    segments[findSegment(playerZ).index + 3].color = COLORS.START;
    for(var n = 0 ; n < rumbleLength ; n++)
      segments[segments.length-1-n].color = COLORS.FINISH;
    trackLength = segments.length * segmentLength;
  }
  function resetSprites() {

    var n;

    if(track_num == 1){

      // for building-left
      for(n = 0;n < 3500;n += 15){

        // Avoid sprites appearing on intersections
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if(n == 60)addSprite(n,SPRITES.MONUMENT_LEFT,-3);
        else if((n >= 500) && (n < 750)){addSprite(n,SPRITES.BUILDING1_LEFT,-5);}
        else if((n >= 750) && (n < 1000)){addSprite(n,SPRITES.BUILDING2_LEFT,-6);}
        else if((n >= 1600) && (n < 1850)){addSprite(n,SPRITES.BUILDING3_LEFT,-6);}

      }

      // for building-right
      for(n = 5;n < 3500;n += 15){

        // Avoid sprites appearing on intersections
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if((n >= 500) && (n < 750)){addSprite(n,SPRITES.BUILDING1_RIGHT,5);}
        else if((n > 750) && (n < 1000)){addSprite(n,SPRITES.BUILDING2_RIGHT,6);}
        else if((n > 1600) && (n < 1850)){addSprite(n,SPRITES.BUILDING3_RIGHT,6);}
        else if(n == 2255)addSprite(n,SPRITES.BUILDING9_RIGHT,3);
        else if(n == 2510)addSprite(n,SPRITES.BUILDING8_RIGHT,3);
        else if(n == 2765)addSprite(n,SPRITES.BUILDING7_RIGHT,3);

      }

      // for trees
      for(n = 0;n < 3500;n += 15){

        // Avoid sprites appearing on intersections 
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if(((n <= 200)) || ((n >= 2200) && (n < 2300)) || ((n >= 2450) && (n <= 2550)) || ((n >= 2700) && (n <= 2800)))continue;
        else if(n < 3200){
          if(n%75 == 0){addSprite(n,SPRITES.TREE5,-2);addSprite(n,SPRITES.TREE5,2);}
          else if(n%60 == 0){addSprite(n,SPRITES.TREE7,-2);addSprite(n,SPRITES.TREE7,2);}
          else if((n%45 == 0) || (n%30 == 0)){addSprite(n,SPRITES.TREE6,-2);addSprite(n,SPRITES.TREE6,2);}
          else if(n%15 == 0){addSprite(n,SPRITES.TREE8,-2);addSprite(n,SPRITES.TREE8,2);}
        }

      }

    }

    else if(track_num == 2){

      // for building-left
      for(n = 0;n < 3500;n += 20){

        // Avoid sprites appearing on intersections
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if((n > 520) && (n < 750)){addSprite(n,SPRITES.BUILDING10_LEFT,-6);}
        else if((n >= 750) && (n < 1000)){addSprite(n,SPRITES.BUILDING11_LEFT,-6);}
        else if((n >= 1500) && (n < 1750)){addSprite(n,SPRITES.BUILDING11_LEFT,-6);}
        else if((n >= 1750) && (n < 2000)){addSprite(n,SPRITES.BUILDING10_LEFT,-6);}
        else if(n == 2260)addSprite(n,SPRITES.BUILDING5,-3);
        else if(n == 2760)addSprite(n,SPRITES.BUILDING4_LEFT,-3);

      }

      // for building-right
      for(n = 5;n < 3500;n += 20){

        // Avoid sprites appearing on intersections
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)%100 == 0) || (Math.floor((n - 6)/rumbleLength)%100) == 0)continue;

        if((n > 520) && (n < 750)){addSprite(n,SPRITES.BUILDING10_RIGHT,6);}
        else if((n >= 750) && (n < 1000)){addSprite(n,SPRITES.BUILDING11_RIGHT,6);}
        else if((n >= 1500) && (n < 1750)){addSprite(n,SPRITES.BUILDING11_RIGHT,6);}
        else if((n >= 1750) && (n < 2000)){addSprite(n,SPRITES.BUILDING10_RIGHT,6);}
        else if(n == 2505)addSprite(n,SPRITES.BUILDING6_RIGHT,3);

      }

      // for trees
      for(n = 0;n < 3500;n += 20){

        // Avoid sprites appearing on intersections 
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if(n < 520){addSprite(n,SPRITES.TREE10,-2);addSprite(n,SPRITES.TREE10,2);}
        else if(n < 2000){
          if(n%100 == 0){addSprite(n,SPRITES.TREE1,-2);addSprite(n,SPRITES.TREE1,2);}
          else if(n%80 == 0){addSprite(n,SPRITES.TREE2,-2);addSprite(n,SPRITES.TREE2,2);}
          else if((n%60 == 0) || (n%40 == 0)){addSprite(n,SPRITES.TREE3,-2);addSprite(n,SPRITES.TREE3,2);}
          else if(n%20 == 0){addSprite(n,SPRITES.TREE4,-2);addSprite(n,SPRITES.TREE4,2);}
        }
        else if(((n >= 2200) && (n < 2300)) || ((n >= 2450) && (n <= 2550)) || ((n >= 2700) && (n <= 2800)))continue;
        else if(n < 3200){addSprite(n,SPRITES.TREE10,-2);addSprite(n,SPRITES.TREE10,2);}

      }

    }

    else if(track_num == 3){


      // for building-left
      for(n = 0;n < 3500;n += 15){

        // Avoid sprites appearing on intersections
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if(n == 105)addSprite(n,SPRITES.BUILDING20,-3);
        else if((n > 1000) && (n <= 1250)){addSprite(n,SPRITES.BUILDING13_LEFT,-6);}
        else if((n > 1500) && (n <= 1750)){addSprite(n,SPRITES.BUILDING13_LEFT,-6);}
        else if((n == 1845) || (n == 2010) || (n == 2145)){addSprite(n,SPRITES.BUILDING19_LEFT,-3);}

      }

      // for building-right
      for(n = 5;n < 3500;n += 15){

        // Avoid sprites appearing on intersections
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if((n > 1000) && (n <= 1250)){addSprite(n,SPRITES.BUILDING13_RIGHT,6);}
        else if((n > 1500) && (n <= 1750)){addSprite(n,SPRITES.BUILDING13_RIGHT,6);}

      }

      // for trees
      for(n = 0;n < 3500;n += 15){

        // Avoid sprites appearing on intersections 
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if((n <= 200) || ((n >= 1750) && (n < 2250)))continue;
        else if(n < 2500){
          if(n%75 == 0){addSprite(n,SPRITES.TREE2,-2);addSprite(n,SPRITES.TREE2,2);}
          else if(n%60 == 0){addSprite(n,SPRITES.TREE11,-2);addSprite(n,SPRITES.TREE11,2);}
          else if((n%45 == 0) || (n%30 == 0)){addSprite(n,SPRITES.TREE6,-2);addSprite(n,SPRITES.TREE6,2);}
          else if(n%15 == 0){addSprite(n,SPRITES.TREE8,-2);addSprite(n,SPRITES.TREE8,2);}
        }

      }

    }

    else if(track_num == 4){


      // for building-left
      for(n = 0;n < 3500;n += 15){

        // Avoid sprites appearing on intersections
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if(n == 60)addSprite(n,SPRITES.BUILDING16,-3);
        else if((n > 1000) && (n <= 1500)){addSprite(n,SPRITES.BUILDING11_LEFT,-6);}
        else if((n >= 2000) && (n < 2250)){addSprite(n,SPRITES.BUILDING18_LEFT,-4);addSprite(n,SPRITES.BUILDING18S_LEFT,-10);}
        else if((n >= 2250) && (n < 2500)){addSprite(n,SPRITES.BUILDING17_LEFT,-4);addSprite(n,SPRITES.BUILDING17S_LEFT,-10);}

      }

      // for building-right
      for(n = 5;n < 3500;n += 15){

        // Avoid sprites appearing on intersections
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if(n == 500){addSprite(n,SPRITES.BUILDING15,3);}
        else if((n > 1000) && (n <= 1500)){addSprite(n,SPRITES.BUILDING11_RIGHT,6);}
        else if((n >= 2000) && (n < 2250)){addSprite(n,SPRITES.BUILDING18_RIGHT,4);addSprite(n,SPRITES.BUILDING18S_RIGHT,10);}
        else if((n >= 2250) && (n < 2500)){addSprite(n,SPRITES.BUILDING17_RIGHT,4);addSprite(n,SPRITES.BUILDING17S_RIGHT,10);}

      }

      // for trees
      for(n = 0;n < 3500;n += 15){

        // Avoid sprites appearing on intersections 
        if((Math.floor(n/rumbleLength)%100 == 0) || (Math.floor((n - 3)/rumbleLength)% 100 == 0) || (Math.floor((n - 6)/rumbleLength)%100 == 0))continue;

        if((n <= 200) || ((n >= 400) && (n < 600)))continue;
        else if(n < 2500){
          if(n%75 == 0){addSprite(n,SPRITES.TREE1,-2);addSprite(n,SPRITES.TREE1,2);}
          else if(n%60 == 0){addSprite(n,SPRITES.TREE3,-2);addSprite(n,SPRITES.TREE3,2);}
          else if((n%45 == 0) || (n%30 == 0)){addSprite(n,SPRITES.TREE9,-2);addSprite(n,SPRITES.TREE9,2);}
          else if(n%15 == 0){addSprite(n,SPRITES.TREE7,-2);addSprite(n,SPRITES.TREE7,2);}
        }
        else if(n < 3200){addSprite(n,SPRITES.TREE12,-2);addSprite(n,SPRITES.TREE12,2);}

      }

    }

  }

  function resetCars() {
  }
  //=========================================================================
  Game.run({
    canvas: canvas, render: render, update: update,  step: step,
    images: ["background", "sprites"],
    keys: [
    { keys: [KEY.LEFT,  KEY.A], mode: 'down', action: function() { keyLeft   = true;  } },
    { keys: [KEY.RIGHT, KEY.D], mode: 'down', action: function() { keyRight  = true;  } },
    { keys: [KEY.UP,    KEY.W], mode: 'down', action: function() { keyFaster = true;  } },
    { keys: [KEY.DOWN,  KEY.S], mode: 'down', action: function() { keySlower = true;  } },
    { keys: [KEY.LEFT,  KEY.A], mode: 'up',   action: function() { keyLeft   = false; } },
    { keys: [KEY.RIGHT, KEY.D], mode: 'up',   action: function() { keyRight  = false; } },
    { keys: [KEY.UP,    KEY.W], mode: 'up',   action: function() { keyFaster = false; } },
    { keys: [KEY.DOWN,  KEY.S], mode: 'up',   action: function() { keySlower = false; } }
    ],
    ready: function(images) {
      background = images[0];
      sprites    = images[1];
      reset();
      Dom.storage.fast_lap_time = Dom.storage.fast_lap_time || 180;
      updateHud('fast_lap_time', formatTime(Util.toFloat(Dom.storage.fast_lap_time)));
    }
  });
  function reset(options) {
    options       = options || {};
    canvas.width  = width  = Util.toInt(options.width,          width);
    canvas.height = height = Util.toInt(options.height,         height);
    lanes                  = Util.toInt(options.lanes,          lanes);
    roadWidth              = Util.toInt(options.roadWidth,      roadWidth);
    cameraHeight           = Util.toInt(options.cameraHeight,   cameraHeight);
    drawDistance           = Util.toInt(options.drawDistance,   drawDistance);
    fogDensity             = Util.toInt(options.fogDensity,     fogDensity);
    fieldOfView            = Util.toInt(options.fieldOfView,    fieldOfView);
    segmentLength          = Util.toInt(options.segmentLength,  segmentLength);
    rumbleLength           = Util.toInt(options.rumbleLength,   rumbleLength);
    cameraDepth            = 1 / Math.tan((fieldOfView/2) * Math.PI/180);
    playerZ                = (cameraHeight * cameraDepth);
    resolution             = height/480;
    //  refreshTweakUI();
    if ((segments.length==0) || (options.segmentLength) || (options.rumbleLength))
      resetRoad(); // only rebuild road when necessary
  };
})
