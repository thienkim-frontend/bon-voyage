let myTheme = {};

myTheme.handlePreloader = ()=>{
    if($("#loading-wrapper").length){
        $("#loading-wrapper").delay(200).fadeOut(500);
    }
}
/*-----------------------------------------
1. backToTop
------------------------------------------*/
myTheme.backToTop = ()=> {
    let offset = 800,
        $back_to_top = $('#back-top > a');
    
    $(window).scroll(function(){
        if( $(this).scrollTop() > offset ) { 
            $back_to_top.fadeIn();
        }else{
            $back_to_top.fadeOut();
        }
    });
    
    $back_to_top.on('click', (event)=>{
        console.log("d");
        event.preventDefault();
        $("html, body").animate({scrollTop : 0}, 1000 , "swing");
        
    });
}
/*-----------------------------------------
8. smoothScroll
------------------------------------------*/
myTheme.smoothScroll = (el)=>{
    $(el).on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");
        var target = this.hash;
        var marginTarget = parseInt($(target).css("margin-top"), 10);;
        var posTop = $(target).offset().top;
        $('html, body').stop().animate({
            'scrollTop': ( posTop - marginTarget)
        }, 500, 'swing');
    });
}
/*-----------------------------------------
9. navAnimation for desktop & ipad
------------------------------------------*/
myTheme.navAnimation = (el)=>{
    let $el = $(el),
        trigger = $el.find('.side-menu-btn'),
        menuItems = $el.find('.nav-mainHeader').find('li');

    if ($el.length) {
        menuItems.each(function() {
            var $this = $(this);
            $this.css({
                '-webkit-transition-delay': $this.index() / 15 + 's',
                '-moz-transition-delay': $this.index() / 15 + 's',
                'transition-delay': $this.index() / 15 + 's'
            });
        });
        trigger.on('click', (event)=> {
            event.preventDefault();
            $('body').toggleClass('menu-activated');
        });
    };
}

myTheme.map = (el)=>{
    var locations = [
        ["",40.9628758,-74.1329207],
    ];
    // Setup the different icons and shadows
    var iconURLPrefix = 'images';
    var icons = ['images/marker_pin_1.png'];
    var icons_length = icons.length;
    var shadow = {
        anchor: new google.maps.Point(37.8043637,-74.14487347),
        url: iconURLPrefix + 'msmarker.shadow.png'
    };

    var myOptions = {
        center: new google.maps.LatLng(41.1311292,-74.3673254),
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        streetViewControl: true,
        panControl: true,
        scrollwheel: false,
        draggable: true,
        zoom: 10
    };

    var map = new google.maps.Map(document.getElementById(el), myOptions);
    var infowindow = new google.maps.InfoWindow({
        locations: locations,
        maxWidth: 350
    });
    var marker;
    var markers = new Array();
    var iconCounter = 0;

    // Add the markers and infowindows to the map
    for (var i = 0; i < locations.length; i++) {  
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            icon : icons[iconCounter],
            shadow: shadow
        });
        markers.push(marker);

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
            }
        })(marker, i));
        
        iconCounter++;
        // We only have a limited number of possible icon colors, so we may have to restart the counter
        if(iconCounter >= icons_length){
            iconCounter = 0;
        }
    }
	
}
export default myTheme;