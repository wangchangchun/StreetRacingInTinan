$(document).ready(function(){


    $('#pic2').show().animate({
      left:"3%",
      top:"18%"
    },1000);
    $('#pic1').show().animate({
      top:"3%",
      left: "18%"
    },1000);
    $("#SRT_ch").show(1300).animate({
      top:"10%",
      left: "50%"
    },300)
    $("#SRT").show(1600).animate({
      top:"25%",
      left: "50%"
    },300)
    $("#lattice").show(1900).animate({
      top:"50%",
      left: "50%"
    },300)
    $("#about_us").show(2100).animate({
      top:"90%",
      left: "45%"
    },300)
    $("#mem_intro").hide();

	$("#about_us").click(function(){
		$("html, body").scrollTop(733);
		$("#about_us_intro").show().animate({
			top: "110%",
			left: "7%"
		},300)
		$("#line").show(1300).animate({
			top: "116%",
			left: "7%"
		},500)
		$("#intro").show(1500).animate({
			top: "120%",
			left: "7%"
		},300)
		$("#icon").show(1800).animate({
			top: "170%",
			right: "18%"
		},300)
	})

	$(window).on("scroll", function(){
		if($(window).scrollTop()+$(window).height()>=1400&&$(window).scrollTop()+$(window).height()<=1500){
			$("#about_us_intro").show().animate({
				top: "110%",
				left: "7%"
			},300)
			$("#line").show(1300).animate({
				top: "116%",
				left: "7%"
			},500)
			$("#intro").show(1500).animate({
				top: "120%",
				left: "7%"
			},300)
			$("#icon").show(1800).animate({
				top: "170%",
				left: "76%",
				height:"12vh",
				width:"6vw"
			},300)
		};
	})
	//click MEMBER
	$("#icon").click(function(){
		$("html,body").scrollTop(1466);
		$(this).animate({
			top:"233%",
			left:"3%",
			height:"24vh",
			width:"12vw"
		},300)
	})
	$("#back_to_top").click(function(){
		$("html,body").scrollTop(0);
	})

  // Click member icon
  var on_click;
  $("#mem_1").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      height: "50vh",
      width: "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "個人介紹1";
    $("#mem_intro").show(300);
    on_click = 1;
  })

  $("#mem_2").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      height: "50vh",
      width: "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "個人介紹2";
    $("#mem_intro").show(300);
    on_click = 2;
  })

  $("#mem_3").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      height: "50vh",
      width: "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "個人介紹3";
    $("#mem_intro").show(300);
    on_click = 3;
  })
    
  $("#mem_4").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      height: "50vh",
      width: "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "個人介紹4";
    $("#mem_intro").show(300);
    on_click = 4;
  })
  
  $("#mem_5").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      height: "50vh",
      width: "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "個人介紹5";
    $("#mem_intro").show(300);
    on_click = 5;
  })

  $("#mem_6").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      height: "50vh",
      width: "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "個人介紹6";
    $("#mem_intro").show(300);
    on_click = 6;
  })

  $("#mem_7").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      height: "50vh",
      width: "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "個人介紹7";
    $("#mem_intro").show(300);
    on_click = 7;
  })
  
  function Recover(){
    
    if(on_click == 1){
      $("#mem_1").animate({
        top: "75%",
        left: "20%",
        height: "12vh",
        width: "6vw"
      },100)
    }
    else if(on_click == 2){
      $("#mem_2").animate({
        top: "75%",
        left: "30%",
        height: "12vh",
        width: "6vw"
      },100)
    }    
    else if(on_click == 3){
      $("#mem_3").animate({
        top: "75%",
        left: "40%",
        height: "12vh",
        width: "6vw"
      },100)
    }
    else if(on_click == 4){
      $("#mem_4").animate({
        top: "75%",
        left: "50%",
        height: "12vh",
        width: "6vw"
      },100)
    }
    else if(on_click == 5){
      $("#mem_5").animate({
        top: "75%",
        left: "60%",
        height: "12vh",
        width: "6vw"
      },100)
    }
    else if(on_click == 6){
      $("#mem_6").animate({
        top: "75%",
        left: "70%",
        height: "12vh",
        width: "6vw"
      },100)
    }
    else if(on_click == 7){
      $("#mem_7").animate({
        top: "75%",
        left: "80%",
        height: "12vh",
        width: "6vw"
      },100)
    }
  }

  // Hover member icon
  $(".member").hover(
      function(){
          $(this).css('height',(this.height + 10) + "px");
          $(this).css('width',(this.width + 5) + "px");
      },
      function(){
          $(this).css('height',(this.height - 10) + "px");
          $(this).css('width',(this.width - 5) + "px");
      }
  );

})


