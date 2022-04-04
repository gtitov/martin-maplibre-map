document.addEventListener('DOMContentLoaded', function () {

    var map = new maplibregl.Map({
        container: 'map', // container id
        // DOCS: https://maplibre.org/maplibre-gl-js-docs/style-spec/
        style: {
            version: 8,
            sources: {},
            layers: []
        },
        center: [37.625, 55.751], // starting position [lng, lat]
        zoom: 5, // starting zoom
        maxZoom: 10
    });

    map.on('load', function () {

        // DOCS: https://docs.mapbox.com/api/maps/vector-tiles/
        // https://api.mapbox.com/v4/{tileset_id}/{zoom}/{x}/{y}.{format} --- {zoom} > {z}, {format} > mvt
        map.addSource('grid', {
            'type': 'vector',
            "tiles": ["http://localhost:3000/public.grid/{z}/{x}/{y}.pbf"]
        });
        map.addLayer(
            {
                'id': 'grid-layer',
                'type': 'fill',
                'source': 'grid',
                'source-layer': 'public.grid',
                'paint': {
                    "fill-color": [
                        'interpolate',
                        ['linear'],
                        ['get', 'n'],
                        0,
                        '#440154',
                        10,
                        '#39568c',
                        40,
                        '#1f968b',
                        80,
                        '#fde725'
                    ]
                }
            }
        );


        map.addSource('oikonyms', {
            'type': 'vector',
            "tiles": ["http://localhost:3000/public.oikonyms/{z}/{x}/{y}.pbf"],
            "minzoom": 8
        });
        map.addLayer({
            'id': 'oikonyms-layer',
            'source': 'oikonyms',
            'source-layer': 'public.oikonyms',
            'type': 'circle',
            'paint': {
                'circle-stroke-width': 1,
                'circle-stroke-color': '#FFFFFF',
                // DOCS: https://docs.mapbox.com/help/tutorials/mapbox-gl-js-expressions/
                // SELECT MIN(total_points), MAX(total_points) FROM cities
                'circle-color': '#1a9641',
                'circle-opacity': 0.8,
                // 'circle-radius': ['/', ['get', 'people_count'], 100]
                // DOCS: https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
                // SELECT DISTINCT group_name FROM cities
                'circle-radius': 6
            }
        });

        map.addSource('border', {
            'type': 'vector',
            "tiles": ["http://localhost:3000/public.border/{z}/{x}/{y}.pbf"]
        });
        map.addLayer({
            'id': 'border-layer',
            'source': 'border',
            'source-layer': 'public.border',
            "type": "line",
            'paint': {
                "line-color": "red",
                "line-width": 3
            },
        });

        const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'oikonyms-layer', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup
                .setLngLat(e.lngLat)
                .setHTML(e.features[0].properties.name)
                .addTo(map);
        });

        map.on('mouseleave', 'oikonyms-layer', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });



        // Modal
        var modalInteractive = new bootstrap.Modal(document.getElementById("popup-modal"), {
            keyboard: false
        })
    })
})




