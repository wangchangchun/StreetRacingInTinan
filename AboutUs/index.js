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
				left: "82%",
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
})


