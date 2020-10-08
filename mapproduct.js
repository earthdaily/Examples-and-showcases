/**
 * This object contains three methods:
 * - getToken to get the access_token
 * - getProductLinks to get the map product links and properties: image URL, world file URL, legend URL, colormap, etc.
 * - getProduct to get the image (PNG) and the world file (PGW) and transform them into image / image extent usable in Openlayers and Leaflet.
 */
const mapProduct = {
    /**
     * @function getToken
     * @description Method to get the token used later to fetch the map products.
     * @param params Authentication parameters.
     * @param params.URL URL of the identity server.
       @param params.REFRESH_TOKEN
       @param params.CLIENT_ID
       @param params.USER_NAME
       @param params.PASSWORD
       @param params.CLIENT_SECRET
     * @returns Promise that resolves the token.
     */
    getToken :function (params) {
        return new Promise((resolve, reject) => {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("Cookie", `refresh_token=${params.REFRESH_TOKEN}`);

            const urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "password");
            urlencoded.append("client_id", params.CLIENT_ID);
            urlencoded.append("username", params.USER_NAME);
            urlencoded.append("password", params.PASSWORD);
            urlencoded.append("scope", "openid offline_access");
            urlencoded.append("client_secret", params.CLIENT_SECRET);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch(params.URL, requestOptions)
                .then(response => resolve(response.json()))
                .catch(error => reject(error));
        });
    },

    /**
     * @function getProductLinks
     * @description Gets the map product links for a field/date/product type.
     * @param params The URL to query the MapProduct APIs.
     * @param token 
     * @returns Promise that resolves the API response.
     */
    getProductLinks :function (params, token) {
        return new Promise((resolve, reject) => {

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(params.URL, requestOptions)
                .then(response => resolve(response.json()))
                .catch(error => reject(error));
        });
    },

    /**
     * @function getProduct
     * @description Gets the image and the world file and computes the image extent.
     * The API returns a world file, but the image extent is needed to display the image in Openlayers or Leaflet.
     * To compute this image extent from the world file, the image size is necessary. 
     * So after getting the world file and the image, we call the getImageSize and then the computeExtent.
     * As the image must be fetched to compute its extent, we use Blob and createObjectURL methods to create a local URL to the image:
     * this prevents a double call to the API. So it is not necessary to fetch the image to get its size and then fetch it again to display it.
     * About the projection: 
     *  - if you use Openlayers, you have to use the WGS 84 / Pseudo-Mercator projection with EPSG = 3857.
     *  - if you use Leaflet, you have to use the WGS84 representation with EPSG = 4326 (API default transformation). 
     * @param params The URLs of the image product (PNG) and the associated world file (PGW).
     * @param params.linkWorldFile World file URL.
     * @param params.linkImage Image URL.
     * @param params.epsg EPSG out specified in the URL. For EPSG =  4326, it is not necessary to specify it.
     * @param token 
     * @returns Promise that resolves an object with the image blob URL and the image extent.
     */
    getProduct :function (params, token) {
        return new Promise((resolve, reject) => {

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            // Adds the EPSG out parameter.
            if (params.epsg) {
                params.linkWorldFile += `?epsgout=${params.epsg}`;
                params.linkImage += `?epsgout=${params.epsg}`;
            }

            // Gets the world file (PGW) and the image (PNG).
            Promise.all([
                fetch(params.linkWorldFile, requestOptions),
                fetch(params.linkImage, requestOptions)
            ])
                .then(responses => {

                    // Turns world file into text and image into blob.
                    Promise.all([
                        responses[0].text(),
                        responses[1].blob()
                    ])
                        .then((results) => {

                            const worldFile = results[0].split('\n');
                            const image = results[1];

                            // Gets image size
                            _getImageSize(image)
                                .then((img) => {

                                    // Gets the useful parameters to compute the image extent: scale, size, position.
                                    const scale = [worldFile[0], Math.abs(worldFile[3])];
                                    const position = [worldFile[4], worldFile[5]];
                                    const size = [img.width, img.height];

                                    // Computes the image extent
                                    const imageExtent = _computeImageExtent({ scale, position, size });

                                    // Returns the image extent and the image (BLOB) URL.
                                    resolve({
                                        imageExtent,
                                        url: img.src
                                    });
                                })
                                .catch(error => reject(error));

                        })
                        .catch(error => reject(error));

                })
                .catch(error => reject(error));
        });
    }
}

/**
 * @function _getImageSize
 * @description Create a HTMLImageElement used to get its size.
 * @param image Blob representing the product image.
 * @return Promise that resolves a HTMLImageELement
 */
function _getImageSize(image) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = err => reject(err);
        img.src = URL.createObjectURL(image);
    });
};

/**
 * @function _computeImageExtent
 * @description Computes the image extent from the image size and the world file.
 * @param params
 * @param params.scale Scale from the world file.
 * @param params.position Position from the world file.
 * @param params.size Size of the image.
 * @returns The image extent [Xmin, Ymin, Xmax, Ymax]
 */
function _computeImageExtent({ scale, position, size }) {
    return [
        parseFloat(position[0]),
        parseFloat(position[1]) - size[1] * parseFloat(scale[1]),
        parseFloat(position[0]) + size[0] * parseFloat(scale[0]),
        parseFloat(position[1])
    ];
};