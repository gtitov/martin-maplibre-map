const map = new maplibregl.Map({
    container: "map",
    style: "https://raw.githubusercontent.com/gtitov/basemaps/refs/heads/master/voyager-nolabels.json",
    center: [37, 55],
    zoom: 6,
    maxZoom: 11,
    maxBounds: [[25, 50], [50, 60]],
    hash: true,
})

map.on("load", () => {

    document.getElementById("filter").addEventListener("input", (e) => {
        filterValue = parseInt(e.target.value)
        map.setFilter("grid-layer", ["<", ["to-number", ["get", "sum_pop"]], filterValue])
    })

    map.addSource("grid", {
        type: "vector",
        url: "http://localhost:3000/grid",
        promoteId: "id"
    })
    map.addLayer({
        id: "grid-layer",
        source: "grid",
        "source-layer": "grid",
        type: "fill",
        paint: {
            "fill-color": [
                "interpolate",
                ["linear"],
                ['to-number', ["get", "sum_pop"]],
                0,
                "#440154",
                100,
                "#39568c",
                1000,
                '#1f968b',
                10000,
                '#fde725'
            ],
            'fill-outline-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                "cyan",
                "transparent"
            ]
        }
    })

    map.addSource("oikonyms", {
        type: "vector",
        tiles: ["http://localhost:3000/oikonyms/{z}/{x}/{y}"],
        minzoom: 8
    })
    map.addLayer({
        id: "oikonyms-layer",
        source: "oikonyms",
        "source-layer": "oikonyms",
        type: "circle",
        paint: {
            "circle-color": "#1a9641",
            "circle-radius": 6,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#FFF",
            "circle-opacity": 0.8
        }
    })

    let hoveredFeatureId = null;

    map.on("mousemove", "grid-layer", (e) => {
        if (hoveredFeatureId !== null) {
            map.setFeatureState(
                {
                    source: "grid",
                    sourceLayer: "grid",
                    id: hoveredFeatureId
                },
                { hover: false }
            )
        }
        hoveredFeatureId = e.features[0].id
        map.setFeatureState(
            {
                source: "grid",
                sourceLayer: "grid",
                id: hoveredFeatureId
            },
            { hover: true }
        )
    })

    map.on("mouseleave", "grid-layer", () => {
        map.setFeatureState(
            {
                source: "grid",
                sourceLayer: "grid",
                id: hoveredFeatureId
            },
            { hover: false }
        )
    })


    map.on("click", "grid-layer", (e) => {
        map.flyTo({
            center: e.lngLat,
            zoom: 10
        })
    })


    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'oikonyms-layer', (e) => {
        popup
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.name)
            .addTo(map);
    });

    map.on('mouseleave', 'oikonyms-layer', () => {
        popup.remove();
    });


    map.on('mouseenter', 'grid-layer', () => {
        map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'grid-layer', () => {
        map.getCanvas().style.cursor = ''
    })


    map.addControl(new maplibregl.ScaleControl())
})