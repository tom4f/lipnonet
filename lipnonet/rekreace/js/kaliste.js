"use strict"


// https://console.developers.google.com/

    function initMap(){
      // Map options
      let options = {
        zoom: 7,
        center: {
            lat: 49.8220106,
            lng: 14.2428942
        }
      }

      // New map
      var map = new google.maps.Map(
        document.getElementById('map'),
        options
      );

      // Listen for click on map
      google.maps.event.addListener(map, 'click', function(event){
        // Add marker
        addMarker({coords:event.latLng});
      });

      // Array of markers
      var markers = [
        {
          coords:{lat:48.6564814,lng:14.2096428},
          //iconImage:'https://www.frymburk.com/rekreace/images/main_leto.jpg',
          content:`
            <div class="marker">
                <a href="https://www.frymburk.com/kaliste/">
                  <h2>
                    Kaliště 993 m n.m.
                  </h2>
                </a>
            </div>
            `
        },
        {
          coords:{lat:48.6614711,lng:14.1640828},
          content:`
          <div class="marker">
              <a href="https://www.frymburk.com/rekreace/">
                <h2>
                  Ubytování u Kučerů
                </h2>
                <br>
                <img src="https://www.frymburk.com/rekreace/images/main_leto.jpg"></img>
              </a>
          </div>
          `
        }
      ];

      // Loop through markers
      for(var i = 0;i < markers.length;i++){
        // Add marker
        addMarker(markers[i]);
      }

      // Add Marker Function
      function addMarker(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          map:map,
          icon:props.iconImage
        });

        // Check for customicon
        if(props.iconImage){
          // Set icon image
          marker.setIcon(props.iconImage);
        }

        // Check content
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });
        }
      }
    }