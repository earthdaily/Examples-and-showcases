/**
 * This opbject contains 2 methods:
 * - createOpenlayersMap to create an Openlayers map from the result of the MapProduct API.
 * - createLeafletMap to create a Leaflet map from the result of the MapProduct API.
 */
const maps = {

    /**
     * @function createOpenlayersMap
     * @description Creates an Openlayers map
     * An OSM layer is added as a background layer.
     * The image extent must be in projection 3857.
     * @param params  Result from mapProduct.getProduct().
     * @param params.imageExtent Image extent in EPSG:3957 [Xmin, Ymin, Xmax, Ymax].
     * @param params.url URL of the Blob Image.
     */
    createOpenlayersMap: function (params) {

        const imageExtent = params.imageExtent;
        const url = params.url;

        // Computes the center of the image extent to use it as the center of the map view. [X,Y]
        const center = [(imageExtent[0] + imageExtent[2]) / 2, (imageExtent[1] + imageExtent[3]) / 2];

        const map = new ol.Map({
            layers: [
                // Adds a background layer.
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                }),
                // Adds the image product to the map.
                new ol.layer.Image({
                    source: new ol.source.ImageStatic(
                        {
                            imageExtent,
                            url
                        }
                    ),
                })],
            // HTMLElement ID used to display the map.
            target: 'map_ol',
            view: new ol.View({
                center,
                zoom: 14,
            })
        });

    },

    /**
    * @function createLeafletMap
    * @description Creates a Leaflet map
    * An OSM layer is added as a background layer.
    * The image extent must be in system 4326.
    * @param params  Result from mapProduct.getProduct().
    * @param params.imageExtent Image extent in EPSG:3957 [Xmin, Ymin, Xmax, Ymax].
    * @param params.url URL of the Blob Image.
    */
    createLeafletMap: function (params) {

        let imageExtent = params.imageExtent;
        const url = params.url;

        // Computes the center of the image extent to use it as the center of the map view. [Lat,Lon].
        const center = [(imageExtent[1] + imageExtent[3]) / 2, (imageExtent[0] + imageExtent[2]) / 2];

        // Rewrites the image extent to be used by Leaflet. [[Latmin, Lonmin], [Latmax, Lonmax]].
        imageExtent = [[imageExtent[1], imageExtent[0]], [imageExtent[3], imageExtent[2]]];

        // Creates the map in the HTMLElement which ID is 'map_leaflet'.
        const map = L.map('map_leaflet').setView(center, 14);

        // Adds OSM layer as a background layer.
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            tileSize: 256,
        }).addTo(map);

        // Adds the image product layer.
        L.imageOverlay(url, imageExtent).addTo(map);
    }
}    