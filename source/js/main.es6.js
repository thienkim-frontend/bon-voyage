/*-----------------------------------------
 TABLE OF CONTENT
 1. backToTop
 2. fullWidthCarousel
 3. dataAttrSettingCarousel
 4. groupItemCarousel
 5. lazyloadProduct
 6. countDown
 7. initDropdown for mobile version
 8. smoothScroll
------------------------------------------*/
/*-----------------------------------------
 PLUGIN
 1. jQuery v2.2.5-pre
 2. Bootstrap v4.0.0-beta.2 (https://getbootstrap.com)
 3. Countdown for jQuery v2.1.0 (http://keith-wood.name/countdown.html)
 4. Owl Carousel v2.2.1
 5. popper.js - dependency for Bootstrap v4
 masonry (https://masonry.desandro.com/layout.html)
 imagesLoaded was unbundled from Masonry in version 3.0.0. You'll have to include it separately. 	
------------------------------------------*/
import myTheme from "./modules.es6.js";
!function($) {
    "use strict";
    
    /*-----------------------------------------
    2. fullWidthCarousel
    ------------------------------------------*/
    function fullWidthCarousel(el){
        let $captionEl = $('.slider__caption', el);
        function makeAnimation(){
            var elems= $(".slick-current").find('.slider__caption [data-animation]');
            elems.each(function () {
                var $this = $(this),
                    $animationType = $this.data('animation'),
                    $animationDelay= $this.data('delay');
                $this.addClass(" animated "+ $animationType).css({"animation-delay":$animationDelay}) ;   
            });
        }
        $(el).on('init', function(event, slick){
                makeAnimation();
            })
            .slick({
                arrows: false,
                slidesToShow: 1,
                adaptiveHeight: true,
                lazyLoad: 'progressive',
            }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
                console.log("init1");
                $('.slider__caption [data-animation]').each(function () {
                    var $this = $(this);
                    $this.removeClass(" animated "+ $this.data('animation')).removeAttr('style') ;   
                });
            }).on('afterChange', function(event, slick, currentSlide, nextSlide){
                console.log("init3");
                makeAnimation();
            });
    }

    
    $(document).ready( ()=>{
        "use strict";
        let windowWidth = $(window).width(),
            windowHeight = $(window).height();
        
        $('.header-section .offer-slider').slick({
            autoplay: true,
            arrows: false,
            slidesToShow: 1,
        });
        
        $(".testimonial-slider").length && $('.testimonial-slider').slick({
            arrows: false,
            mobileFirst: true,
            rows: 1,
            slidesPerRow: 1,
            slidesToShow: 1,
            centerMode: true,
            centerPadding: 0,
            responsive: [{
                breakpoint: 767,
                settings: { slidesToShow: 2 }
            }],
            
        });
        
        $('.instagram-slider').length && $('.instagram-slider').slick({
            arrows: false,
            slidesToShow: 13,
            responsive: [{
                breakpoint: 991,
                settings: { slidesToShow: 8 }
            },{
                breakpoint: 767,
                settings: { slidesToShow: 6 }
            }],
            
        });

        $('.partner-slider').length && $('.partner-slider').slick({
            arrows: false,
            dots: true,
            slidesToShow: 6,
            responsive: [{
                breakpoint: 991,
                settings: { slidesToShow: 6 }
            },{
                breakpoint: 767,
                settings: { slidesToShow: 4 }
            }],
            
        });

        $('.todo-slider').length && $('.todo-slider').slick({
            arrows: false,
            dots: true,
            slidesToShow: 6,
            slidesToScroll: 6,
            responsive: [{
                breakpoint: 991,
                settings: { slidesToShow: 3, slidesToScroll: 3,}
            },{
                breakpoint: 767,
                settings: { slidesToShow: 1, slidesToScroll: 1, }
            }],
            
        });

         $('.main-slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true,
            asNavFor: '.thumbnail-slider'
        });
        $('.thumbnail-slider').slick({
            asNavFor: '.main-slider',
            dots: false,
            focusOnSelect: true,
            slidesToScroll: 1,
            slidesToShow: 5,
            responsive: [{
                breakpoint: 767,
                settings: { slidesToShow: 3 }
            }],
        });
        $(".testimonial-slider .rate-bar").length && $(".testimonial-slider .rate-bar").rateYo({
            normalFill: "#A0A0A0",
            ratedFill: "#f4c201",
            rating    : 5,
            spacing   : "5px",
            starWidth: "14px",
            readOnly: true
        });

        $(".tour__item .rate-bar").length && $(".tour__item .rate-bar").rateYo({
            normalFill: "#A0A0A0",
            ratedFill: "rgba(245,96,12,1)",
            rating    : 3.6,
            spacing   : "5px",
            starWidth: "14px",
        });
        
        /*-----------------------------------------
        2. fullWidthCarousel
        ------------------------------------------*/
        function initMasony(el){
            
            function init_colHeight() {
                var $container = $(".gallery__masonry"),
                    $item = $container.find('.gallery__item');
                var columnWidth = Math.round($item.width());

                $item.each(function() {
                    var $this = $(this);
                    if (windowWidth > 480 && $this.hasClass('item--big')) {
                        $this.css({ 'height': columnWidth * 2 + 'px' });
                    }else{
                        $this.css({ 'height': columnWidth + 'px' });
                    }
                });
            }
            if($(el).length && $().masonry){
                var $grid = $(el).masonry({
                    columnWidth: '.gallery__sizer',
                    itemSelector: '.gallery__item',
                    gutter: '.gallery__gutter',
                    // horizontalOrder: true,
                    percentPosition: true
                });
                $grid.imagesLoaded().progress( function() {
                    init_colHeight();
                    $grid.masonry('layout');
                });


            }
        }
        
        fullWidthCarousel("#hero-slider");
        initMasony(".gallery__masonry");
        if(windowWidth < 992){
            $( '#main-menu' ).dlmenu({
                animationClasses : { classin : 'dl-animate-in-1', classout : 'dl-animate-out-1' }
            });
        }
        if(windowWidth > 480){
            
        }
        if($("#map-general").length){
             myTheme.map("map-general");
        }
        $(".navbar-wrapper").length && myTheme.smoothScroll(".navbar-wrapper a");
       
    });
        

    $(window)
        .on( 'resize', ()=>{})
        .on( 'load', ()=>{
            myTheme.handlePreloader();
        })
        .on( 'scroll', ()=>{
        }); 
}(jQuery);





