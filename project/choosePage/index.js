$(document).ready(function(){

    var track_num = 1,car_num = 1;
    //var id = window.location.href.split("?")[1];

    $('#transport').hide();
    $('#pointer').hide();

    $('#track').click(function(){
        $('#transport').show();
        $('#track').hide();
        document.getElementById("background").setAttribute("src","res/background2.png");
    });

    $('#track1').click(function(){track_num = 1;});
    $('#track2').click(function(){track_num = 2;});
    $('#track3').click(function(){track_num = 3;});
    $('#track4').click(function(){track_num = 4;});

    $('#transport').click(function(){
        $('#transport').hide();
        window.sessionStorage.setItem("track_num",track_num);
        window.sessionStorage.setItem("car_num",car_num); 
        //document.location.href = "./v4.final.html";
        document.location.href = "https://luffy.ee.ncku.edu.tw:10086/racer/v4.final.html";
    });

    $('#transport1').click(function(){car_num = 1;});
    $('#transport2').click(function(){car_num = 2;});
    //$('#transport3').click(function(){car_num = 3;});

    /*$('#track1').hover(function(){
        $('#pointer').css('top','125px');
        $('#pointer').css('width','35vw');
        $('#pointer').css('height','7vh');
        document.getElementById("building").setAttribute("src","res/castle.png");
    });

    $('#track2').hover(function(){
        $('#pointer').css('top','188px');
        $('#pointer').css('width','40vw');
        $('#pointer').css('height','8vh');
        document.getElementById("building").setAttribute("src","res/hall.png");
    });

    $('#track3').hover(function(){
        $('#pointer').css('top','250px');
        $('#pointer').css('width','34vw');
        $('#pointer').css('height','7vh');
        document.getElementById("building").setAttribute("src","res/temple.png");
    });

    $('#track4').hover(function(){
        $('#pointer').css('top','313px');
        $('#pointer').css('width','25vw');
        $('#pointer').css('height','5.5vh');
        document.getElementById("building").setAttribute("src","res/park.png");
    });*/

});


