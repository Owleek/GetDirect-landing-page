$(document).ready(function() {
	$('dl.tabsComponent').on('click', 'dt', function() {
		$(this)
			.siblings().removeClass('active').end()
			.next().addClass('active').end()
			.addClass('active')
	});				
});