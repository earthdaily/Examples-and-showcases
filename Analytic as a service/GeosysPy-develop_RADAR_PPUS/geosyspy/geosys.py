from oauthlib.oauth2 import LegacyApplicationClient
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import TokenExpiredError
import json
import re
from urllib.parse import urljoin
import pandas as pd
from . import platforms
import logging
import io
import zipfile
from rasterio.io import MemoryFile
from shapely import wkt
from pathlib import Path
from . import image_reference
import xarray as xr
import rasterio
import numpy as np
from .constants import Collection


def renew_access_token(func):
    """Decorator used to wrap the Geosys class's http methods.

    This decorator wraps the geosys http methods (get,post...) and checks
    wether the used token is still valid or not. If not, it fetches a new token and
    uses it to make another request.

    """

    def wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except TokenExpiredError:
            self._Geosys__refresh_token()
            return func(self, *args, **kwargs)

    return wrapper


class Geosys:
    """Geosys is the main client class to access all the Geosys APIs capabilities.

    `client = Geosys(api_client_id, api_client_secret, api_username, api_password, env, region)`

    Parameters:
        str_api_client_id (str): The client id
        str_api_client_secret (str): The client secret
        str_api_username (str): The api username
        str_api_password (str): The api user password
        enum_env (enum): 'Env.PROD' or 'Env.PREPROD'
        enum_region (enum): 'Region.NA' or 'Region.EU'
        str_priority_queue (str): 'realtime' or 'bulk'
    """

    def __init__(
        self,
        str_api_client_id,
        str_api_client_secret,
        str_api_username,
        str_api_password,
        enum_env,
        enum_region,
        str_priority_queue="realtime",
    ):
        """Initializes a Geosys instance with the required credentials
        to connect to the GEOSYS API.
        """
        self.region = enum_region
        self.env = enum_env
        self.str_id_server_url = platforms.IDENTITY_URLS[enum_region.value][enum_env.value]
        self.base_url = platforms.GEOSYS_API_URLS[enum_region.value][enum_env.value]
        self.master_data_management_endpoint = "master-data-management/v6/seasonfields"
        self.vts_endpoint = "vegetation-time-series/v1/season-fields"
        self.vts_by_pixel_endpoint = "vegetation-time-series/v1/season-fields/pixels"
        self.flm_catalog_imagery = (
            "field-level-maps/v4/season-fields/{}/catalog-imagery"
        )
        self.flm_coverage = "field-level-maps/v4/season-fields/{}/coverage"
        self.weather_endpoint = "Weather/v1/weather"
        self.analytics_fabric_endpoint = "analytics/metrics"
        self.analytics_fabric_schema_endpoint = "analytics/schemas"
        self.str_api_client_id = str_api_client_id
        self.str_api_client_secret = str_api_client_secret
        self.str_api_username = str_api_username
        self.str_api_password = str_api_password
        self.token = None
        self.priority_queue = str_priority_queue
        self.priority_headers = {"bulk": "Geosys_API_Bulk", "realtime": ""}
        self.list_collection_lr = [Collection.MODIS]
        self.list_collection_mr = [Collection.LANDSAT_8, Collection.LANDSAT_9, Collection.SENTINEL_2]
        self.list_collection_weather = [
            Collection.WEATHER_FORECAST_DAILY,
            Collection.WEATHER_FORECAST_HOURLY,
            Collection.WEATHER_HISTORICAL_DAILY,
        ]
        self.__authenticate()

    def __authenticate(self):
        """Authenticates the client to the API.

        This method connects the user to the API which generates a token that
        will be valid for one hour. A refresh token is also generated, which
        makes it possible for the http methods wrappers to get a new token
        once the previous one is no more valid through the renew_access_token
        decorator. This method is only run once when a Geosys object is instantiated.

        """

        try:
            oauth = OAuth2Session(
                client=LegacyApplicationClient(client_id=self.str_api_client_id)
            )
            self.token = oauth.fetch_token(
                token_url=self.str_id_server_url,
                username=self.str_api_username,
                password=self.str_api_password,
                client_id=self.str_api_client_id,
                client_secret=self.str_api_client_secret,
            )
            self.token["refresh_token"] = oauth.cookies["refresh_token"]
            logging.info("Authenticated")
        except Exception as e:
            logging.error(e)

    def __refresh_token(self):
        """Fetches a new token."""

        client = OAuth2Session(self.str_api_client_id, token=self.token)
        self.token = client.refresh_token(
            self.str_id_server_url,
            client_id=self.str_api_client_id,
            client_secret=self.str_api_client_secret,
        )

    def __get_matched_str_from_pattern(self, pattern, text):
        """Returns the first occurence of the matched pattern in text.

        Args:
            pattern : A string representing the regex pattern to look for.
            text : The text to look into.

        Returns:
            A string representing the first occurence in text of the pattern.

        """
        p = re.compile(pattern)
        return p.findall(text)[0]

    @renew_access_token
    def __get(self, url_endpoint, headers={}):
        """Gets the url_endpopint.

        Args:
            url_endpoint : A string representing the url to get.

        Returns:
            A response object.
        """
        client = OAuth2Session(self.str_api_client_id, token=self.token)
        return client.get(url_endpoint, headers=headers)

    @renew_access_token
    def __post(self, url_endpoint, payload, headers={}):
        """Posts payload to the url_endpoint.

        Args:
            url_endpoint : A string representing the url to post paylaod to.
            payload : A python dict representing the payload.

        Returns:
            A response object.
        """
        client = OAuth2Session(self.str_api_client_id, token=self.token)
        return client.post(url_endpoint, json=payload, headers=headers)

    @renew_access_token
    def __patch(self, url_endpoint, payload):
        """Patchs payload to the url_endpoint.

        Args:
            url_endpoint : A string representing the url to patch paylaod to.
            payload : A python dict representing the payload.

        Returns:
            A response object.
        """
        client = OAuth2Session(self.str_api_client_id, token=self.token)
        return client.patch(url_endpoint, json=payload)

    def __create_season_field_id(self, polygon):
        """Posts the payload below to the master data management endpoint.

        This method returns a season field id. The season field id is required
        to request other APIs endpoints.

        Args:
            polygon : A string representing a polygon.

        Returns:
            A response object.

        """
        payload = {
            "Geometry": polygon,
            "Crop": {"Id": "CORN"},
            "SowingDate": "2022-01-01",
        }
        str_mdm_url = urljoin(self.base_url, self.master_data_management_endpoint)

        return self.__post(str_mdm_url, payload)

    def __extract_season_field_id(self, polygon):
        """Extracts the season field id from the response object.

        Args:
            polygon : A string representing a polygon.

        Returns:
            A string rerpesenting the season field id.

        Raises:
            ValueError: The response status code is not as expected.
        """

        response = self.__create_season_field_id(polygon)
        dict_response = response.json()

        if (
            response.status_code == 400
            and "sowingDate" in dict_response["errors"]["body"]
        ):
            pattern = r"\sId:\s(\w+),"
            str_text = dict_response["errors"]["body"]["sowingDate"][0]["message"]
            return self.__get_matched_str_from_pattern(pattern, str_text)

        elif response.status_code == 201:
            return dict_response["id"]
        else:
            raise ValueError(
                f"Cannot handle HTTP response : {str(response.status_code)} : {str(response.json())}"
            )

    def get_time_series(self, polygon, start_date, end_date, collection, indicators):
        """Retrieve a time series of the indicator for the aggregated polygon on the collection targeted.

        Args:
            polygon (str): The polygon
            start_date (datetime): The start date of the time series
            end_date (datetime): The end date of the time series
            collection (enum): The collection targeted
            indicators (str list): The indicators to retrieve on the collection

        Returns:
            (dataframe): A pandas dataframe for the time series

        Raises:
            ValueError: The collection doesn't exist
        """

        if collection in self.list_collection_weather:
            return self.__get_weather(
                polygon,
                start_date,
                end_date,
                collection.value.split(".").pop(),
                indicators,
            )
        elif collection in self.list_collection_lr:
            return self.__get_modis_time_series(
                polygon, start_date, end_date, indicators[0]
            )
        else:
            raise ValueError(f"{collection} collection doesn't exist")

    def get_satellite_image_time_series(
        self, polygon, start_date, end_date, collections, indicators
    ):
        """Retrieve a pixel-by-pxel time series of the indicator on the collection targeted.

        Args:
            polygon (str): The polygon
            start_date (datetime): The start date of the time series
            end_date (datetime): The end date of the time series
            collections (enum list): The collections targeted
            indicators (str list): The indicators to retrieve on the collections

        Returns:
            ('dataframe or xarray'): Either a pandas dataframe or an xarray for the time series
        """

        if not collections:
            raise ValueError(
                "The argument collections is empty. It must be a list of constants.Collection objects"
            )
        elif all([isinstance(elem, Collection) for elem in collections]):
            if set(collections).issubset(set(self.list_collection_lr)):
                return self.__get_time_series_by_pixel(
                    polygon, start_date, end_date, indicators[0]
                )
            elif set(collections).issubset(set(self.list_collection_mr)):
                return self.__get_images_as_dataset(
                    polygon, start_date, end_date, collections
                )
        else:
            raise TypeError(
                f"Argument collections must be a list of constants.Collection objects"
            )

    def __get_modis_time_series(self, polygon, start_date, end_date, indicator):
        """Returns a pandas DataFrame.

        This method returns a time series of 'indicator' within the range
        'start_date' -> 'end_date' as a pandas DataFrame :

                     | index     | value |

            date     | indicator |   1   |
        __________________________________
         start-date  | indicator |   2   |

            ...      |    ...    |  ...  |

         end-date    | indicator |   8   |

        Args:
            polygon : A string representing a polygon.
            start_date : A datetime object representing the start date of the date interval the user wants to filter on.
            end_date : A datetime object representing the final date of the date interval the user wants to filter on.
            indicator : A string representing the indicator whose time series the user wants.

        Returns:
            df : A Pandas DataFrame containing two columns : index and value, and an index called 'date'.

        """
        logging.info("Calling APIs for aggregated time series")
        str_season_field_id = self.__extract_season_field_id(polygon)
        str_start_date = start_date.strftime("%Y-%m-%d")
        str_end_date = end_date.strftime("%Y-%m-%d")
        parameters = f"/values?$offset=0&$limit=9999&$count=false&SeasonField.Id={str_season_field_id}&index={indicator}&$filter=Date >= '{str_start_date}' and Date <= '{str_end_date}'"
        str_vts_url = urljoin(self.base_url, self.vts_endpoint + parameters)

        response = self.__get(str_vts_url)

        if response.status_code == 200:
            dict_response = response.json()
            df = pd.read_json(json.dumps(dict_response))
            df.set_index("date", inplace=True)
            return df
        else:
            logging.info(response.status_code)

    def __get_time_series_by_pixel(self, polygon, start_date, end_date, indicator):
        """Returns a pandas DataFrame.

        This method returns a time series of 'indicator' by pixel within the range 'start_date' -> 'end_date'
        as well as the pixel's coordinates X,Y in the MODIS's sinusoidal projection as a pandas DataFrame :



                        | index     | value | pixel.id | X | Y |
                        _______________________________________|
            date        | indicator |       |          |   |   |
            ___________________________________________________|

            start-date  | indicator |   2   |    1     |   |   |

            ...         | ...       |  ...  |   ...    |   |   |

            end-date    | indicator |   8   |   1000   |   |   |

        Args:
            polygon : A string representing a polygon.
            start_date : A datetime object representing the start date of the date interval the user wants to filter on.
            end_date : A datetime object representing the final date of the date interval the user wants to filter on.
            indicator : A string representing the indicator whose time series the user wants.

        Returns:
            df : A Pandas DataFrame containing five columns : index, value, pixel.id, X, Y and an index called 'date'.

        """

        logging.info("Calling APIs for time series by the pixel")
        str_season_field_id = self.__extract_season_field_id(polygon)
        str_start_date = start_date.strftime("%Y-%m-%d")
        str_end_date = end_date.strftime("%Y-%m-%d")
        parameters = f"/values?$offset=0&$limit=9999&$count=false&SeasonField.Id={str_season_field_id}&index={indicator}&$filter=Date >= '{str_start_date}' and Date <= '{str_end_date}'"
        str_vts_url = urljoin(self.base_url, self.vts_by_pixel_endpoint + parameters)
        # PSX/PSY : size in meters of one pixel
        # MODIS_GRID_LENGTH : theoretical length of the modis grid in meters
        # MOIS_GRID_HEIGHT : theoretical height of the modis grid in meters
        PSX = 231.65635826
        PSY = -231.65635826
        MODIS_GRID_LENGTH = 4800 * PSX * 36
        MODIS_GRID_HEIGHT = 4800 * PSY * 18

        response = self.__get(str_vts_url)

        if response.status_code == 200:
            df = pd.json_normalize(response.json())
            df.set_index("date", inplace=True)

            # Extracts h, v, i and j from the pixel dataframe
            logging.info("Computing X and Y coordinates per pixel... ")
            df["h"] = df["pixel.id"].str.extract(r"h(.*)v").astype(int)
            df["v"] = df["pixel.id"].str.extract(r"v(.*)i").astype(int)
            df["i"] = df["pixel.id"].str.extract(r"i(.*)j").astype(int)
            df["j"] = df["pixel.id"].str.extract(r"j(.*)$").astype(int)

            # XUL/YUL : The coordinates of the top left corner of the tile h,v's top left pixel
            #  X/Y : the coordinates of the top left corner of the i,j pixel
            df["XUL"] = (df["h"] + 1) * 4800 * PSX - MODIS_GRID_LENGTH / 2
            df["YUL"] = (df["v"] + 1) * 4800 * PSY + MODIS_GRID_HEIGHT / 2
            df["X"] = df["i"] * PSX + df["XUL"]
            df["Y"] = df["j"] * PSY + df["YUL"]
            logging.info("Done ! ")
            return df[["index", "value", "pixel.id", "X", "Y"]]
        else:
            logging.info(response.status_code)

    def get_satellite_coverage_image_references(
        self, polygon, start_date, end_date, collections=[Collection.SENTINEL_2, Collection.LANDSAT_8]
    ):
        """Retrieves a list of images that covers a polygon on a specific date range.
        The return is a tuple: a dataframe with all the images covering the polygon, and 
                    an dictionary images_references. Key= a tuple (image_date, image_sensor).
                    Value = an object image_reference, to use with the method `download_image()`

        Args:
            polygon (str): The polygon
            start_date (datetime): The start date of the time series
            end_date (datetime): The end date of the time series
            sensors (str list): The sensors to check the coverage on

        Returns:
            (tuple): images list and image references for downloading
        """

        df = self.__get_satellite_coverage(polygon, start_date, end_date, collections)
        images_references = {}

        for i, image in df.iterrows():
            images_references[
                (image["image.date"], image["image.sensor"])
            ] = image_reference.ImageReference(
                image["image.id"],
                image["image.date"],
                image["image.sensor"],
                image["seasonField.id"],
            )

        return df, images_references

    def __get_satellite_coverage(
        self, polygon, start_date, end_date, sensors=[Collection.SENTINEL_2, Collection.LANDSAT_8]
    ):
        logging.info("Calling APIs for coverage")
        str_season_field_id = self.__extract_season_field_id(polygon)
        str_start_date = start_date.strftime("%Y-%m-%d")
        str_end_date = end_date.strftime("%Y-%m-%d")
        sensors = [elem.value for elem in sensors]
        parameters = f"?maps.type=INSEASON_NDVI&Image.Sensor=$in:{'|'.join(sensors)}&CoverageType=CLEAR&$limit=9999&$filter=Image.Date >= '{str_start_date}' and Image.Date <= '{str_end_date}'"

        str_flm_url = urljoin(
            self.base_url,
            self.flm_catalog_imagery.format(str_season_field_id) + parameters,
        )
        response = self.__get(
            str_flm_url,
            {"X-Geosys-Task-Code": self.priority_headers[self.priority_queue]},
        )

        if response.status_code == 200:
            df = pd.json_normalize(response.json())
            if df.empty:
                return df
            else:
                return df[
                    [
                        "coverageType",
                        "image.id",
                        "image.availableBands",
                        "image.sensor",
                        "image.soilMaterial",
                        "image.spatialResolution",
                        "image.weather",
                        "image.date",
                        "seasonField.id",
                    ]       
                ]
        else:
            logging.info(response.status_code)

    def __get_zipped_tiff(self, field_id, image_id):
        parameters = f"/{image_id}/reflectance-map/TOC/image.tiff.zip"
        download_tiff_url = urljoin(
            self.base_url, self.flm_coverage.format(field_id) + parameters
        )

        response_zipped_tiff = self.__get(
            download_tiff_url,
            {"X-Geosys-Task-Code": self.priority_headers[self.priority_queue]},
        )
        return response_zipped_tiff

    def download_image(self, image_reference, str_path=""):
        """Downloads a satellite image locally

        Args:
            image_reference (ImageReference): An ImageReference object representing the image to download
            str_path (str): the path to download the image to
        """
        response_zipped_tiff = self.__get_zipped_tiff(
            image_reference.season_field_id, image_reference.image_id
        )
        if str_path == "":
            str_path = Path.cwd() / f"image_{image_reference.image_id}_tiff.zip"
        with open(str_path, "wb") as f:
            logging.info(f"writing to {str_path}")
            f.write(response_zipped_tiff.content)

    def __get_images_as_dataset(self, polygon, start_date, end_date, collections):
        """Returns all the 'sensors_list' images covering 'polygon' between
        'start_date' and 'end_date' as an xarray dataset.

        Args:
            polygon : A string representing the polygon that the images will be covering.
            start_date : The date from which the method will start looking for images.
            end_date : The date at which the methd will stop looking images.
            sensors_list : A list of the sensors' names as strings.

        Returns:
            The image's numpy array.

        """

        def get_coordinates_by_pixel(raster):
            """Returns the coordinates in meters in the raster's CRS
            from its pixels' grid coordinates."""

            img = raster.read()
            band1 = img[0]
            height = band1.shape[0]
            width = band1.shape[1]
            cols, rows = np.meshgrid(np.arange(width), np.arange(height))
            xs, ys = rasterio.transform.xy(raster.transform, rows, cols)
            lons = np.array(xs)
            lats = np.array(ys)
            lst_lats = [lat[0] for lat in lats]
            lst_lons = list(lons[0])
            return {"y": lst_lats, "x": lst_lons}

        # Selects the covering images in the provided date range
        # and sorts them by resolution, from the highest to the lowest.
        # Keeps only the first image if two are found on the same date.
        df_coverage = self.__get_satellite_coverage(
            polygon, start_date, end_date, collections
        )

        # Return empty dataset if no coverage on the polygon between start_date, end_date
        if df_coverage.empty:
            return xr.Dataset()

        df_coverage["image.date"] = pd.to_datetime(
            df_coverage["image.date"], infer_datetime_format=True
        )
        df_coverage = df_coverage.sort_values(
            by=["image.spatialResolution", "image.date"], ascending=[True, True]
        ).drop_duplicates(subset="image.date", keep="first")

        # Creates a dictionary that contains a zip archive containing the tif file
        # for each image id and some additional data (bands, sensor...)
        dict_archives = {}
        for i, row in df_coverage.iterrows():
            dict_archives[row["image.id"]] = {
                "byte_archive": self.__get_zipped_tiff(
                    row["seasonField.id"], row["image.id"]
                ).content,
                "bands": row["image.availableBands"],
                "date": row["image.date"],
                "sensor": row["image.sensor"],
            }

        # Extracts the tif files from  the zip archives in memory
        # and transforms them into a list of xarray DataArrays.
        # A list of all the raster's crs is also created in order
        # to merge this data in the final xarray Dataset later on.
        list_xarr = []
        list_crs = []
        first_img_id = df_coverage.iloc[0]["image.id"]
        for img_id, dict_data in dict_archives.items():
            with zipfile.ZipFile(io.BytesIO(dict_data["byte_archive"]), "r") as archive:
                list_files = archive.namelist()
                for file in list_files:
                    list_words = file.split(".")
                    if list_words[-1] == "tif":
                        img_in_bytes = archive.read(file)
                        with MemoryFile(img_in_bytes) as memfile:
                            with memfile.open() as raster:
                                dict_coords = get_coordinates_by_pixel(raster)
                                xarr = xr.DataArray(
                                    raster.read(masked=True),
                                    dims=["band", "y", "x"],
                                    coords={
                                        "band": dict_data["bands"],
                                        "y": dict_coords["y"],
                                        "x": dict_coords["x"],
                                        "time": dict_data["date"],
                                    },
                                )

                                if img_id == first_img_id:
                                    len_y = len(dict_coords["y"])
                                    len_x = len(dict_coords["x"])
                                    print(
                                        f"The highest resolution's image grid size is {(len_x, len_y)}"
                                    )
                                else:
                                    logging.info(
                                        f"interpolating {img_id} to {first_img_id}'s grid"
                                    )
                                    xarr = xarr.interp(
                                        x=list_xarr[0].coords["x"].data,
                                        y=list_xarr[0].coords["y"].data,
                                        method="linear",
                                    )
                                list_xarr.append(xarr)
                                list_crs.append(raster.crs.to_string())

        # Adds the img's raster's crs to the initial dataframe
        df_coverage["crs"] = list_crs

        # Concatenates all the DataArrays in list_xarr in order
        # to create one final DataArray with an additional dimension
        # 'time'. This final DataArray is then transformed into
        # an xarray Dataset containing one data variable "reflectance".

        final_xarr = xr.concat(list_xarr, "time")
        dataset = xr.Dataset(data_vars={"reflectance": final_xarr})

        # Adds additional metadata to the dataset.
        dataset = dataset.assign_coords(
            **{
                k: ("time", np.array(v))
                for k, v in df_coverage[
                    [
                        "image.id",
                        "image.sensor",
                        "image.soilMaterial",
                        "image.spatialResolution",
                        "image.weather",
                        "crs",
                    ]
                ]
                .to_dict(orient="list")
                .items()
            }
        )
        return dataset

    def __get_weather(self, polygon, start_date, end_date, weather_type, fields):
        """Returns the weather data as a pandas dataframe.

        Args:
            polygon : A string representing a polygon.
            start_date : A datetime object representing the start date of the date interval the user wants to filter on.
            end_date : A datetime object representing the final date of the date interval the user wants to filter on.
            weather_type : A string representing the collection ["HISTORICAL_DAILY", "FORECAST_DAILY", "FORECAST_HOURLY"]
            fields : An array of strings representings the fields to select (eg: Precipitation, Temperature)

        Returns:
            The image's numpy array.

        """

        allowed_weather_types = [
            "HISTORICAL_DAILY",
            "FORECAST_DAILY",
            "FORECAST_HOURLY",
        ]
        if weather_type not in allowed_weather_types:
            raise ValueError(f"weather_type should be either {allowed_weather_types}")

        if "Date" not in fields:
            fields.append("Date")

        str_start_date = start_date.strftime("%Y-%m-%d")
        str_end_date = end_date.strftime("%Y-%m-%d")
        polygon_wkt = wkt.loads(polygon)
        str_weather_fields = ",".join(fields)
        parameters = f"?%24offset=0&%24limit=9999&%24count=false&Location={polygon_wkt.centroid.wkt}&Date=%24between%3A{str_start_date}T00%3A00%3A00.0000000Z%7C{str_end_date}T00%3A00%3A00.0000000Z&Provider=GLOBAL1&WeatherType={weather_type}&$fields={str_weather_fields}"
        str_weather_url = urljoin(self.base_url, self.weather_endpoint + parameters)

        response = self.__get(str_weather_url)

        if response.status_code == 200:
            df = pd.json_normalize(response.json())
            if df.empty:
                return df
            else:
                df.set_index("date", inplace=True)
                df["Location"] = polygon_wkt.centroid.wkt
                return df.sort_index()
        else:
            logging.error(response.status_code)
            raise ValueError(response.content)

    def create_schema_id(self, schema_id, schema):
        """Create a schema in Analytics Fabrics

        Args:
            schema_id (str): The schema id to create
            schema (dict): Dict representing the schema {'property_name': 'property_type'}

        Returns:
            A http response object.
        """
        properties = []
        for prop_name, datatype in schema.items():
            prop = {
                "Name": prop_name,
                "Datatype": datatype,
                "UnitCategory": None,
                "IsPartOfKey": False,
                "IsOptional": False,
            }
            properties.append(prop)

        payload = {
            "Id": schema_id,
            "Properties": properties,
            "Metadata": {"OnAggregationCompleted": "Off"},
        }
        str_af_url = urljoin(
            self.base_url,
            self.analytics_fabric_schema_endpoint,
        )
        response = self.__post(str_af_url, payload)
        if response.status_code == 201:
            return response.content
        else:
            logging.info(response.status_code)

    def get_metrics(self, polygon, schema_id, start_date, end_date):
        """Returns metrics from Analytics Fabrics in a pandas dataframe.

        Args:
            polygon (str): A string representing a polygon.
            start_date (datetime): A datetime object representing the start date of the date interval the user wants to filter on.
            end_date (datetime): A datetime object representing the final date of the date interval the user wants to filter on.
            schema_id (str): A string representing a schema existing in Analytics Fabrics

        Returns:
            df : A Pandas DataFrame containing severals columns with metrics

        """
        season_field_id = self.__extract_season_field_id(polygon)
        logging.info("Calling APIs for metrics")
        str_start_date = start_date.strftime("%Y-%m-%d")
        str_end_date = end_date.strftime("%Y-%m-%d")
        parameters = f'?%24limit=9999&Timestamp=$between:{str_start_date}|{str_end_date}&$filter=Entity.ExternalTypedIds.Contains("SeasonField:{season_field_id}@LEGACY_ID_{self.region.value.upper()}")&$filter=Schema.Id=={schema_id}'
        str_af_url = urljoin(
            self.base_url,
            self.analytics_fabric_endpoint + parameters,
        )
        response = self.__get(str_af_url)

        if response.status_code == 200:
            df = pd.json_normalize(response.json())
            df.drop("Entity.TypedId", inplace=True, axis=1)
            df.rename(
                columns={"Timestamp": "date"},
                inplace=True,
            )
            df = df.sort_values(by="date")
            df.set_index("date", inplace=True)
            return df
        else:
            logging.info(response.status_code)

    def get_metrics_by_seasonfieldid(self, seasonfield, schema_id, start_date, end_date):
        """Returns metrics from Analytics Fabrics in a pandas dataframe.

        Args:
            polygon (str): A string representing a polygon.
            start_date (datetime): A datetime object representing the start date of the date interval the user wants to filter on.
            end_date (datetime): A datetime object representing the final date of the date interval the user wants to filter on.
            schema_id (str): A string representing a schema existing in Analytics Fabrics

        Returns:
            df : A Pandas DataFrame containing severals columns with metrics

        """
        logging.info("Calling APIs for metrics")
        str_start_date = start_date.strftime("%Y-%m-%d")
        str_end_date = end_date.strftime("%Y-%m-%d")
        parameters = f'?%24limit=9999&Timestamp=$between:{str_start_date}|{str_end_date}&$filter=Entity.ExternalTypedIds.Contains("SeasonField:{seasonfield}@LEGACY_ID_{self.region.value.upper()}")&$filter=Schema.Id=={schema_id}'
        str_af_url = urljoin(
            self.base_url,
            self.analytics_fabric_endpoint + parameters,
        )
        print(str_af_url)
        response = self.__get(str_af_url)

        if response.status_code == 200:
            df = pd.json_normalize(response.json())
            df.drop("Entity.TypedId", inplace=True, axis=1)
            df.rename(
                columns={"Timestamp": "date"},
                inplace=True,
            )
            df = df.sort_values(by="date")
            df.set_index("date", inplace=True)
            return df
        else:
            logging.info(response.status_code)
            
    def push_metrics(self, polygon, schema_id, values):
        """Push metrics in Analytics Fabrics

        Args:
            seasonfield :seasonfield externalid (legacy ID)
            schema_id : The schema on which to save
            values : Dict representing values to push

        Returns:
            A response object.
        """
        season_field_id = self.__extract_season_field_id(polygon)
        payload = []
        for value in values:
            prop = {
                "Entity": {
                    "TypedId": f"SeasonField:{season_field_id}@LEGACY_ID_{self.region.value.upper()}"
                },
                "Schema": {"Id": schema_id, "Version": 1},
            }
            prop = dict(prop, **value)
            payload.append(prop)

        str_af_url = urljoin(
            self.base_url,
            self.analytics_fabric_endpoint,
        )
        response = self.__patch(str_af_url, payload)
        if response.status_code == 200:
            return response.status_code
        else:
            logging.info(response.status_code)

    def push_metrics_seasonfield(self, seasonfield, schema_id, values):
        """Push metrics in Analytics Fabrics

        Args:
            seasonfield :seasonfield externalid (legacy ID)
            schema_id : The schema on which to save
            values : Dict representing values to push

        Returns:
            A response object.
        """
        
        payload = []
        for value in values:
            prop = {
                "Entity": {
                    "TypedId": f"SeasonField:{seasonfield}@LEGACY_ID_{self.region.value.upper()}"
                },
                "Schema": {"Id": schema_id, "Version": 1},
            }
            prop = dict(prop, **value)
            payload.append(prop)

        str_af_url = urljoin(
            self.base_url,
            self.analytics_fabric_endpoint,
        )
        response = self.__patch(str_af_url, payload)
        if response.status_code == 200:
            return response.status_code
        else:
            logging.info(response.status_code)