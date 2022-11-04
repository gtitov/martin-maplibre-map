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
        zoom: 3, // starting zoom
        maxZoom: 10
    });

    map.on('load', function () {
        // Raster basemap from Mapbox
        // map.addSource('basemap', {
        //     'type': 'raster',
        //     'tiles': ['https://api.mapbox.com/styles/v1/ghermant/cl9n3adsz002114o7irgcouyt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2hlcm1hbnQiLCJhIjoiY2pncDUwcnRmNDQ4ZjJ4czdjZXMzaHZpNyJ9.3rFyYRRtvLUngHm027HZ7A']
        // })

        // map.addLayer({
        //     "id": "basemap-layer",
        //     "type": "raster",
        //     "source": "basemap",
        //     "paint": {}
        // })

        // DOCS: https://docs.mapbox.com/api/maps/vector-tiles/
        // https://api.mapbox.com/v4/{tileset_id}/{zoom}/{x}/{y}.{format} --- {zoom} > {z}, {format} > mvt
        map.addSource('grid', {
            'type': 'vector',
            "tiles": ["http://46.243.227.216:3000/public.grid/{z}/{x}/{y}.pbf"],
            "promoteId": "gid"  // DOCS: https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/#vector-promoteId
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
                        ["*", ['get', 'n'], parseFloat(document.getElementById("weight-range").value)],
                        0,
                        '#440154',
                        10,
                        '#39568c',
                        40,
                        '#1f968b',
                        100,
                        '#fde725'
                    ],
                    'fill-outline-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "cyan",
                        "transparent"
                    ]
                }
            }
        );

        document.getElementById("weight-range").addEventListener("input", function () {
            map.setPaintProperty("grid-layer", "fill-color", [
                'interpolate',
                ['linear'],
                ["*", ['get', 'n'], parseFloat(document.getElementById("weight-range").value)],
                0,
                '#440154',
                10,
                '#39568c',
                40,
                '#1f968b',
                100,
                '#fde725'
            ])
        })


        // map.addSource('oikonyms', {
        //     'type': 'vector',
        //     "tiles": ["http://46.243.227.216:3000/public.oikonyms/{z}/{x}/{y}.pbf"],
        //     "minzoom": 8
        // });
        // map.addLayer({
        //     'id': 'oikonyms-layer',
        //     'source': 'oikonyms',
        //     'source-layer': 'public.oikonyms',
        //     'type': 'circle',
        //     'paint': {
        //         'circle-stroke-width': 1,
        //         'circle-stroke-color': '#FFFFFF',
        //         'circle-color': '#1a9641',
        //         'circle-opacity': 0.8,
        //         'circle-radius': 6
        //     }
        // });

        // map.addSource('border', {
        //     'type': 'vector',
        //     "tiles": ["http://46.243.227.216:3000/public.border/{z}/{x}/{y}.pbf"]
        // });
        // map.addLayer({
        //     'id': 'border-layer',
        //     'source': 'border',
        //     'source-layer': 'public.border',
        //     "type": "line",
        //     'paint': {
        //         "line-color": "red",
        //         "line-width": 3
        //     },
        // });

        map.addSource("countries", {
            type: "vector",
            tiles: [
              `https://api.mapbox.com/v4/ghermant.aq1p7k29/{z}/{x}/{y}.mvt?access_token=pk.eyJ1IjoiZ2hlcm1hbnQiLCJhIjoiY2pncDUwcnRmNDQ4ZjJ4czdjZXMzaHZpNyJ9.3rFyYRRtvLUngHm027HZ7A`,
            ],
          });
  
          map.addLayer({
            id: "countries-layer",
            type: "line",
            source: "countries",
            "source-layer": "ne_110m_admin_0_countries-cz6wwp",
            paint: {
              "line-color": "blue",
              "line-width": 3,
            },
            filter: ["==", ["get", "NAME"], "Russia"],
            maxzoom: 4,
          });
        const features = map.querySourceFeatures('countries', {
            sourceLayer: 'ne_110m_admin_0_countries-cz6wwp'
        });

        // console.log(features)

        // var popup = new maplibregl.Popup({
        //     closeButton: false,
        //     closeOnClick: false
        // });

        // map.on('mouseenter', 'oikonyms-layer', (e) => {
        //     // Change the cursor style as a UI indicator.
        //     map.getCanvas().style.cursor = 'pointer';

        //     // Populate the popup and set its coordinates
        //     // based on the feature found.
        //     popup
        //         .setLngLat(e.lngLat)
        //         .setHTML(e.features[0].properties.name)
        //         .addTo(map);
        // });

        // map.on('mouseleave', 'oikonyms-layer', () => {
        //     map.getCanvas().style.cursor = '';
        //     popup.remove();
        // });

        // var hoveredStateId = null;
        // map.on('mousemove', 'grid-layer', (e) => {
        //     if (e.features.length > 0) {
        //         // console.log(e.features[0])
        //         if (hoveredStateId !== null) {
        //             map.setFeatureState(
        //                 {
        //                     source: 'grid',
        //                     sourceLayer: 'public.grid',
        //                     id: hoveredStateId
        //                 },
        //                 { hover: false }
        //             );
        //         }
        //         hoveredStateId = e.features[0].id
        //         map.setFeatureState(
        //             {
        //                 source: 'grid',
        //                 sourceLayer: 'public.grid',
        //                 id: hoveredStateId
        //             },
        //             { hover: true }
        //         );
        //     }
        // });

        // map.on('mouseleave', 'grid-layer', () => {
        //     if (hoveredStateId !== null) {
        //         map.setFeatureState(
        //             {
        //                 source: 'grid',
        //                 sourceLayer: 'public.grid',
        //                 id: hoveredStateId
        //             },
        //             { hover: false }
        //         );
        //     }
        //     hoveredStateId = null;
        // });

        // map.on('click', 'grid-layer', (e) => {
        //     map.flyTo({
        //         center: e.lngLat,
        //         zoom: 9
        //     });
        // });

        // map.on('dblclick', 'grid-layer', (e) => {
        //     new maplibregl.Popup()
        //         .setLngLat(e.lngLat)
        //         .setHTML(`Число ойконимов: ${e.features[0].properties.n}`)
        //         .addTo(map);
        // });
    })
})




