$(document).ready(function() {
	// $('.owl-carousel').owlCarousel({
    //     loop:true,
    //     margin:20,
    //     dots:false,
    //     nav:true,
    //     responsive:{
    //         0:{
    //             items:1
    //         },
    //         600:{
    //             items:2
    //         },
    //         1000:{
    //             items:3
    //         }
    //     }
    // });
	$('dl.tabsComponent').on('click', 'dt', function() {
		$(this)

			.next().toggleClass('active').end()
			.toggleClass('active')
    });
});