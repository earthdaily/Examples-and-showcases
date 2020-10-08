# Gis.Client.Samples

Samples, Snippets and examples to use Openlayers, Leaflet, or other libraries.

## MapProduct
It is an example to see how to use a map product in Openlayers or Leaflet.

For steps 1),2), and 3) please refer to the existing Geosys API documentation.
You will have to use : your login/password, your field Id and an image that covers your field. In this projet, we are supposing that you know how to do those steps.
The purpose of this repo is to highlight the OpenLayer & Leaflet integration, not to focus on the Geosys API.

The workflow steps are:
1) Get the token
2) Get the map product properties including the links to the image, the world file, the legend, etc.
3) Get the product image(PNG)/world file (PGW) and transform it into image(BLOB)/image extent (ARRAY).
4) Create a map with OpenLayers and another with Leaflet.

The example files are in the MapProduct folder:
* **maps.html**
    * **Head**: includes the libraries and CSS of Openlayers and Leaflet, the CSS of the page and the JS files.
    * **Body**: includes the HTMLElement to receive the maps, and a IIFE to run the calls to MapProduct APIs.
* **mapproduct.js**: includes the methods handling the MapProduct APIs.
    * **getToken**: gets the access_token.
    * **getProductLinks**: gets the map product properties: image URL, world file URL, legend URL, colormap, etc.
    * **getProduct**: gets the image /the world file and transforms them into image / image extent usable in Openlayers and Leaflet.
* **maps.js**:
    * **createOpenlayersMap**: creates an Openlayers map from the result of the MapProduct API.
    * **createLeafletMap**: creates a Leaflet map from the result of the MapProduct API.