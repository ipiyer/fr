(function(window){
     // does a cross domain xhr request
     
     var jsonp = function(url, params, callback){
      if(!callback || !url) {
        return;
      }

      var query = "?";
      params = params || {};

      for ( key in params ) {
        if ( params.hasOwnProperty(key) ) {
          query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
        }
      }

      var jsonp = "jsonp_" + new Date().getTime();
      window[ jsonp ] = callback.callback;

      var script = document.createElement("script");
      script.async = true;
      script.src = url + query + callback.name + "=" + jsonp;

      script.onload = script.onreadystatechange = function(){
        if (!script.readyState || /loaded|complete/.test( script.readyState ) ) {
          script.onload = script.onreadystatechange = null;

            // Remove the script
            if ( script.parentNode ) {
              script.parentNode.removeChild( script );
            }

            script = null;
          }
        }
        var head = document.head;
        head.appendChild( script );
      }
      console.log(jsonp.toString());

      var foo = function() {}

      console.log(foo.toString());


      // creates a doubly linked list
      // Its created to have a easy access 
      // to the next and prev element in the lightbox.
      // Example: { 
      //           12312 : {
      //             data: {},
      //             next: {},
      //             prev: {}
      //           }
      //          }
      // I also has a index to a bigO(1) look up
      //          

      var DoublyLinkedList = function() {
        this.length = 0;
        this.head = null;
        this.tail = null;
        this.node = {};
      }

      DoublyLinkedList.prototype = {

        add: function (data){

        // create a new node and adds the data 
        // with index for a easy look up.
        // Example: 
        
        this.node[data.id] = {
          data: data,
          next: null,
          prev: null
        };

        var node = this.node[data.id];

        // First insert where there is no element;
        if (this.length == 0) {
          this.head = node;
          this.tail = node;
        } else {

            //attach to the tail node
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
          }        

        // length of items;
        this.length++;

      },
      // This takes a array of json and adds that to the node.
      // Example: [{12123: {data:{}}}]
      listify : function (array) {
        var that = this;
        array.forEach(function(el){
          that.add(el)
        })
      },
      // These functions are created if you ever need to 
      // poll the server to get new json and 
      // want to extend the doubly linked list.
      extHead : function() {

      },
      extTail : function() {

      }
  };

  // Takes either a HTML collection or a element 
  // and adds display none;
  // 
  // Disclamir: May not be the right way to 
  // detect htmlcollection/nodelist
  var hide = function(el) {
    if(!el.length) {
      el.style.display = "none";
      return;
    }

    var len = el.length;
    for(var i = 0; i < len; i++) {
      el[i].style.display = "none";
    }
  }

  var show = function(el) {
    if(!el.length) {
      el.style.display = "";
      return;
    }

    var len = el.length;
    for(var i = 0; i < len; i++) {
      el[i].style.display = "";
    }
  }

  var removeClass = function(el, name) {
    if(!el.length) {
      el.className = el.className.replace(name, "");
      return;
    }

    var len = el.length;
    for(var i = 0; i < len; i++) {
      el[i].className = el[i].className.replace(name, "");
    }
  }

  var addClass = function(el, name) {
    if(!el.length) {
      if(!el.className.match(name)){
        el.className += name;
      }
      return;
    }

    var len = el.length;
    for(var i = 0; i < len; i++) {
      if(!el[i].className.match(name)){
        el[i].className += name;
      }
    }
  }

  window.$ = {
    jsonp : jsonp,
    DoublyLinkedList : DoublyLinkedList,
    hide : hide,
    show : show,
    removeClass : removeClass,
    addClass : addClass
  }
})(window);




var lightBox = function(options) {
  this.dllist = options.dllist;
  // No. of light box img elements on the DOM;
  this.cacheSize = options.cacheSize || 2;

  // stack size should be > cachesize; 
  // cache size is 2  2 + 1 + 2 (prev, current, next);
  this.stackSize = ( this.cacheSize * 2 ) + 2;

  this.El = document.getElementById(options.El);
  this.lImg = document.getElementById("l-imgs");
  this.prevEl = document.getElementById("prev");
  this.nextEl = document.getElementById("next");
  this.closeEl = document.getElementById("close");

  this.init();
}

lightBox.prototype = {
  init: function() {
    this.createMarkup();
    var that = this;
    this.closeEl.addEventListener("click", function(e){
      that.close(e);
    });

    this.prevEl.addEventListener("click", function(e){
      that.prev();
    })

    this.nextEl.addEventListener("click", function(e){
      that.next();
    })

  },
  close : function() {
    $.hide(this.El);
  },
  center: function() {
    var lwrap = document.getElementById("l-wrap");
    var width = window.innerWidth;
    var height = window.innerHeight;

    var left = width / 2 - 800 / 2;
    lwrap.style.left = left + "px";

    lwrap.style.top = (height / 2 - 600 / 2 ) - 50 + "px";

  },  
  createMarkup : function() {
    var html = "";  
    for(var i = 0; i < this.stackSize; i++) {
      html = html + "<li><img class='no-cache'/></li>";
    }
    this.lImg.innerHTML = html;
  },
  prev: function() {
    if(!this.current.prev){
      return;
    }

    this.current = this.current.prev;
    this.populateImg(this.current.data.id);

    if(!this.current.next) {
      this.prevEl.disabled = "disabled";
    }

  },
  next: function() {
    if(!this.current.next){
      return;
    }

    this.current = this.current.next;
    this.populateImg(this.current.data.id);

    if(!this.current.next) {
      this.nextEl.disabled = "disabled";
    }

  },
  showLightBox : function(id) {
    $.show(this.El);
    this.populateImg(id);
    this.center();
  },
  addClassCache : function() {
    var imgs = this.lImg.getElementsByTagName("img");
    $.addClass(imgs, "no-cache");
  },
  hideImgs : function() {
    var imgs = this.lImg.getElementsByTagName("img");
    $.hide(imgs);
  },
  populateImg : function(id) {

    if(!id) {
      id = this.dllist.head.data.id;
    }

    this.current = this.dllist.node[id];
    var that = this;

    this.hideImgs();

    var cacheData = [], index, node, noCache;
    cacheData.push(this.current);

    ["prev", "next"].forEach(function(action){
      index = 0;
      node = that.dllist.node[id][action];

      while(index < that.cacheSize && node) {
        index++;
        cacheData.push(node);
        node = node[action];
      }
    });


    cacheData.forEach(function(eid) {
      var inDOM = document.getElementById(eid.data.id);
      noCache = that.lImg.getElementsByClassName("no-cache");

      if(!noCache.length) {
        that.addClassCache();
        noCache = that.lImg.getElementsByClassName("no-cache");
      }

      if(!inDOM) {
        inDOM = noCache[0];
        noCache[0].src = eid.data.uri.large;
        noCache[0].id = eid.data.id;
      }

      $.removeClass(inDOM, "no-cache");
    });

    $.show(document.getElementById(id))
  }
};