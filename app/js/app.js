$(function(){

  function buildPswdHtml(){

  $('dl.tabsComponent').on('click', 'dt', function() {
        $(this)
            .toggleClass('active')
            .next('dd').toggleClass('active')

    });

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
        owl = $gallery.data("owl.carousel"),
        gallery;
    var options = $.extend(true, {
      index: index,
      getThumbBoundsFn: function(index) {
        var $thumbnail = $(items[index].el).find("img");
        $gallery.find(".owl-item.active").each(function(i, item) {
          if ($(items[index].el).attr("item-index") == $(item).find("a").attr("item-index")) {
            $thumbnail = $(item).find("img");
          }
        });
        var offset = $thumbnail.offset();

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
      $gallery.trigger('to.owl.carousel', this.getCurrentIndex());
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

      $gallery
        .find(".item")
        .each(function(index, item) {
          $(item).find("a").attr("item-index", index);
        });

      $gallery.owlCarousel(owlOptions);

      options.galleryUID = uid;
      $gallery.attr("data-pswp-uid", uid);

      $gallery.find(".owl-item").on("click", function(e){
        if( !$(e.target).is("img") ) return;
        var index = parseInt($(this).find("a").attr("item-index"));
        openGallery($gallery, index, items.concat(), options);
        return false;
      });
    });
  }

  var owlOptions = {
    responsive: {
      0: {
        items:1
      },
      480: {
        items:2
      },
      1000: {
        items:3
      }
    },
    nav: true,
    dots: false,
    loop: true
  },
  pswpOptions = {
    bgOpacity: 0.9,
    history: false,
    shareEl: false
  };

  initializeGallery($(".owl-carousel"), owlOptions, pswpOptions);


  var initPhotoSwipeFromDOM = function(gallerySelector) {
      var parseThumbnailElements = function(el) {
          var thumbElements = el.childNodes,
              numNodes = thumbElements.length,
              items = [],
              figureEl,
              linkEl,
              size,
              item;

          for(var i = 0; i < numNodes; i++) {
              figureEl = thumbElements[i];
              if(figureEl.nodeType !== 1) {
                  continue;
              }

              linkEl = figureEl.children[0];
              size = linkEl.getAttribute('data-size').split('x');
              item = {
                  src: linkEl.getAttribute('href'),
                  w: parseInt(size[0], 10),
                  h: parseInt(size[1], 10)
              };

              if(figureEl.children.length > 1) {
                  item.title = figureEl.children[1].innerHTML; 
              }

              if(linkEl.children.length > 0) {
                  item.msrc = linkEl.children[0].getAttribute('src');
              } 

              item.el = figureEl;
              items.push(item);
          }
          return items;
      };

      var closest = function closest(el, fn) {
          return el && ( fn(el) ? el : closest(el.parentNode, fn) );
      };

      var onThumbnailsClick = function(e) {
          e = e || window.event;
          e.preventDefault ? e.preventDefault() : e.returnValue = false;

          var eTarget = e.target || e.srcElement;

          var clickedListItem = closest(eTarget, function(el) {
              return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
          });

          if(!clickedListItem) {
              return;
          }

          var clickedGallery = clickedListItem.parentNode,
              childNodes = clickedListItem.parentNode.childNodes,
              numChildNodes = childNodes.length,
              nodeIndex = 0,
              index;

          for (var i = 0; i < numChildNodes; i++) {
              if(childNodes[i].nodeType !== 1) { 
                  continue; 
              }

              if(childNodes[i] === clickedListItem) {
                  index = nodeIndex;
                  break;
              }
              nodeIndex++;
          }

          if(index >= 0) {
              openPhotoSwipe( index, clickedGallery );
          }
          return false;
      };

      var photoswipeParseHash = function() {
          var hash = window.location.hash.substring(1),
          params = {};

          if(hash.length < 5) {
              return params;
          }

          var vars = hash.split('&');
          for (var i = 0; i < vars.length; i++) {
              if(!vars[i]) {
                  continue;
              }
              var pair = vars[i].split('=');  
              if(pair.length < 2) {
                  continue;
              }           
              params[pair[0]] = pair[1];
          }

          if(params.gid) {
              params.gid = parseInt(params.gid, 10);
          }

          return params;
      };

      var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
          var pswpElement = document.querySelectorAll('.pswp')[0],
              gallery,
              options,
              items;

          items = parseThumbnailElements(galleryElement);

          options = {

              galleryUID: galleryElement.getAttribute('data-pswp-uid'),

              getThumbBoundsFn: function(index) {
                  var thumbnail = items[index].el.getElementsByTagName('img')[0],
                      pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                      rect = thumbnail.getBoundingClientRect(); 

                  return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
              }

          };
          
          if(fromURL) {
              if(options.galleryPIDs) {
                  for(var j = 0; j < items.length; j++) {
                      if(items[j].pid == index) {
                          options.index = j;
                          break;
                      }
                  }
              } else {
                  options.index = parseInt(index, 10) - 1;
              }
          } else {
              options.index = parseInt(index, 10);
          }

          if( isNaN(options.index) ) {
              return;
          }

          if(disableAnimation) {
              options.showAnimationDuration = 0;
          }

          gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
          gallery.init();
      };

      var galleryElements = document.querySelectorAll( gallerySelector );

      for(var i = 0, l = galleryElements.length; i < l; i++) {
          galleryElements[i].setAttribute('data-pswp-uid', i+1);
          galleryElements[i].onclick = onThumbnailsClick;
      }

      var hashData = photoswipeParseHash();
      if(hashData.pid && hashData.gid) {
          openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
      }
  };
  initPhotoSwipeFromDOM('.photoswipeGallery');

    

});