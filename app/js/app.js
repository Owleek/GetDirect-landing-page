$(function(){

  function buildPswdHtml(){
    $("body").append([
      '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">',
      '  <div class="pswp__bg"></div>',
      '  <div class="pswp__scroll-wrap">',
      '    <div class="pswp__container">',
      '      <div class="pswp__item"></div>',
      '      <div class="pswp__item"></div>',
      '      <div class="pswp__item"></div>',
      '    </div>',
      '    <div class="pswp__ui pswp__ui--hidden">',
      '      <div class="pswp__top-bar">',
      '          <div class="pswp__counter"></div>',
      '          <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>',
      '          <button class="pswp__button pswp__button--share" title="Share"></button>',
      '          <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>',
      '          <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>',
      '          <div class="pswp__preloader">',
      '            <div class="pswp__preloader__icn">',
      '              <div class="pswp__preloader__cut">',
      '                <div class="pswp__preloader__donut"></div>',
      '              </div>',
      '            </div>',
      '          </div>',
      '      </div>',
      '      <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">',
      '        <div class="pswp__share-tooltip"></div> ',
      '      </div>',
      '      <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>',
      '      <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>',
      '      <div class="pswp__caption">',
      '        <div class="pswp__caption__center"></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join(""));
  }


  function getGalleryItems($gallery){
    var items = [];

    $gallery.find("a").each(function(){
      var $anchor = $(this),
          size = $anchor.attr("data-size").split("x"),
          title = $anchor.attr("data-title"),
          item = {
            el: $anchor.get(0),
            src: $anchor.attr("href"),
            w: parseInt(size[0]),
            h: parseInt(size[1])
          };

      if( title ) item.title = title;

      items.push(item);
    });

    return items;
  }


  function openGallery($gallery, index, items, pswpOptions){
    var $pswp = $(".pswp"),
        owl = $gallery.data("owlCarousel"),
        gallery;

    var options = $.extend(true, {
      index: index,

      getThumbBoundsFn: function(index){
        var $thumbnail = $(items[index].el).find("img"),
            offset = $thumbnail.offset();
        return {
          x: offset.left,
          y: offset.top,
          w: $thumbnail.outerWidth()
        };
      }
    }, pswpOptions);

    gallery = new PhotoSwipe($pswp.get(0), PhotoSwipeUI_Default, items, options);
    gallery.init();

    gallery.listen("beforeChange", function(x){
      owl.goTo(this.getCurrentIndex());
    });

    gallery.listen("close", function(){
      this.currItem.initialLayout = options.getThumbBoundsFn(this.getCurrentIndex());
    });
  }


  function initializeGallery($elem, owlOptions, pswpOptions){

    if( $(".pswp").size() === 0 ){
      buildPswdHtml();
    }

    $elem.each(function(i){
      var $gallery = $(this),
          uid = i + 1,
          items = getGalleryItems($gallery),
          options = $.extend(true, {}, pswpOptions);

      $gallery.owlCarousel(owlOptions);

      options.galleryUID = uid;
      $gallery.attr("data-pswp-uid", uid);

      $gallery.find(".owl-item").on("click", function(e){
        if( !$(e.target).is("img") ) return;

        openGallery($gallery, $(this).index(), items.concat(), options);
        return false;
      });
    });
  }

  var owlOptions = {
        itemsCustom: [
        [0, 1],
        [450, 2],
        [1000, 3]
      ],
        responsiveRefreshRate: 0,
        navigation: true
      },
      pswpOptions = {
        bgOpacity: 0.9,
        history: false,
        shareEl: false
      };

  initializeGallery($(".owl-carousel"), owlOptions, pswpOptions);

});