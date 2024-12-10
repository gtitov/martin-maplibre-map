import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6/dist/maplibre-gl.mjs';

const map = new maplibregl.Map({
    container: 'map',
    style: "https://raw.githubusercontent.com/gtitov/basemaps/refs/heads/master/positron-nolabels.json",
    center: [37.437, 55.838],
    zoom: 6.25,
    hash: true,
    maxZoom: 11,
    maxBounds: [[25, 50], [50, 60]]
});

map.on('load', () => {
    map.addSource('grid', {
        type: 'vector',
        tiles: ["https://gtitov.github.io/martin-maplibre-map/grid/{z}/{x}/{y}.pbf"],
        promoteId: 'id'
    })
    map.addLayer({
        id: 'grid-layer',
        source: 'grid',
        'source-layer': 'grid',
        type: 'fill',
        paint: {
            "fill-color": [
                "interpolate", ["linear"],
                ["to-number", ["get", "sum_pop"]],
                0, "#440154",
                100, "#39568c",
                1000, "#1f968b",
                10000, "#fde725"
            ],
            "fill-outline-color": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "red",
                "transparent"
            ]
        }
    })

    // map.addSource('landsat', {
    //     type: 'raster',
    //     url: 'http://localhost:3000/LC09_L2SP_20250404-rendered-2',
    //     tileSize: 256
    // })
    // map.addLayer({
    //     id: 'landsat-layer',
    //     source: 'landsat',
    //     type: 'raster',
    //     layout: {
    //         visibility: 'none'
    //     }
    // })

    map.addSource('oikonyms', {
        type: 'vector',
        tiles: ["https://gtitov.github.io/martin-maplibre-map/oikonyms/{z}/{x}/{y}.pbf"],
    })
    map.addLayer({
        id: 'oikonyms-layer',
        source: 'oikonyms',
        'source-layer': 'oikonyms',
        type: 'circle',
        paint: {
            "circle-color": "#1a9641",
            "circle-radius": 6,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#FFF",
            "circle-opacity": 0.8
        },
        minzoom: 9
    })

    map.on("click", "grid-layer", (e) => {
        map.flyTo({
            center: e.lngLat,
            zoom: 10
        })
    })

    let hoveredFeatureId = null

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

    map.on("mouseenter", "grid-layer", () => {
        map.getCanvas().style.cursor = "pointer"
    })

    map.on("mouseleave", "grid-layer", () => {
        map.getCanvas().style.cursor = ""

        map.setFeatureState(
            {
                source: "grid",
                sourceLayer: "grid",
                id: hoveredFeatureId
            },
            { hover: false }
        )
    })

    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    })

    map.on("mouseenter", "oikonyms-layer", (e) => {
        popup
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.name)
            .addTo(map)
    })

    map.on("mouseleave", "oikonyms-layer", () => {
        popup.remove()
    })

    document.getElementById("filter").addEventListener("input", (e) => {
        const filterValue = parseInt(e.target.value)
        map.setFilter("grid-layer", ["<", ["to-number", ["get", "sum_pop"]], filterValue])
    })

    // document.getElementById("landsat").addEventListener("change", (e) => {
    //     const isVisible = e.target.checked ? 'visible' : 'none'
    //     map.setLayoutProperty("landsat-layer", "visibility", isVisible)
    // })
})