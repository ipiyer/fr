// var flickrData = { "photoset": { "id": "72157632346355274", "primary": "8309577953", "owner": "24328860@N05", "ownername": "munichlinux", 
//     "photo": [
//       { "id": "8309577953", "secret": "448c034e57", "server": "8504", "farm": 9, "title": "", "isprimary": 1 },
//       { "id": "8310628356", "secret": "c74cdda897", "server": "8076", "farm": 9, "title": "", "isprimary": 0 },
//       { "id": "8309578647", "secret": "9720949546", "server": "8500", "farm": 9, "title": "", "isprimary": 0 },
//       { "id": "8310629068", "secret": "90ba399963", "server": "8363", "farm": 9, "title": "", "isprimary": 0 },
//       { "id": "8310629406", "secret": "7d4e86bdb6", "server": "8211", "farm": 9, "title": "", "isprimary": 0 },
//       { "id": "8310629704", "secret": "2e180db78e", "server": "8364", "farm": 9, "title": "", "isprimary": 0 },
//       { "id": "8310629952", "secret": "9ccdbedf27", "server": "8072", "farm": 9, "title": "", "isprimary": 0 },
//       { "id": "8309580125", "secret": "869f4c30b7", "server": "8497", "farm": 9, "title": "", "isprimary": 0 },
//       { "id": "8309580487", "secret": "5aa7922ce7", "server": "8362", "farm": 9, "title": "", "isprimary": 0 },
//       { "id": "8309580885", "secret": "14b8908d8d", "server": "8491", "farm": 9, "title": "", "isprimary": 0 }
//     ], "page": 1, "per_page": 10, "perpage": 10, "pages": 7, "total": 63 }, "stat": "ok" }


//    http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
//    
//    
//    
// s     small square 75x75
// q     large square 150x150
// t     thumbnail, 100 on longest side
// m     small, 240 on longest side
// n     small, 320 on longest side
// -     medium, 500 on longest side
// z     medium 640, 640 on longest side
// c     medium 800, 800 on longest side†
// b     large, 1024 on longest side*
// o     original image, either a jpg, gif or png, depending on source format


(function(){
  var mashUp = function(){
    this.mashEl = document.getElementById("mash");
    this.init();
  }

  mashUp.prototype = {
    init: function() {
      this.getPhotos();
    },
    getPhotos : function() {
      var that = this;
      $.jsonp("http://api.flickr.com/services/rest/", 
      {
        method: "flickr.photosets.getPhotos", 
        api_key: "89427fb671a99bfeee9679ae1cb0c15f",
        photoset_id:"72157632346355274", 
        per_page:10, 
        format: "json"
      }, 
        {
          // callback
          name: "jsoncallback",
          callback: function(resp, status){
            if(resp.stat !== "ok") {
              return;
            }

            that.apiResp = resp;

            that.constructURI();

            //link list the photos
            var dll = new $.DoublyLinkedList();
            dll.listify(that.photos);

            that.lBox = new lightBox({
              dllist: dll,
              El: "lightbox"
            });
          }
        })
    },
    constructURI: function() {
      var photos = this.apiResp.photoset.photo, uri, html = "";

      photos.forEach(function(photo) {
        uri = {
          normal: "http://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_m.jpg",
          large : "http://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_c.jpg"
        };

        photo["uri"] = uri;

        html = html + "<li><a href='javascript:void(0)'><img src='"+uri.normal+"' data-photoid='"+photo.id+"'/></a></li>";

      });

      this.photos = photos;
      this.mashEl.innerHTML = html;
      this.addClick();
    },
    addClick : function() {
      // Add click event on all the imgs.
      // 
      var imgEls = this.mashEl.getElementsByTagName("a");
      var len = imgEls.length;
      var that = this;
      for(var i = 0; i < len; i++) {
        imgEls[i].addEventListener("click", function(e){
          var target = e.target;
          var photoid = target.getAttribute("data-photoid");
          that.lBox.showLightBox(photoid);
        })
      }
    }
  }

  new mashUp();
})()

