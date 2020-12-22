/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2hyaXNiY2xhcmsiLCJhIjoiY2tiYjFwenJ1MDAzeDJ2cWh3ajh2Zmd2dSJ9.ZadTq3QiGvrica-K1luvPQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/chrisbclark/ckbb2ourn08de1iqiy7o743ic',
    //scrollZoom: 'false',
    showZoom: 'true'
    // center: [-80.743814,34.925885],
    // zoom: 15
  });

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
  );

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    //Create the Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add a pop up

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend the bounds to include the current location
    bounds.extend(loc.coordinates);
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 99
      }
    });
  });
};
