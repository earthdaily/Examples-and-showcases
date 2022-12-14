from datetime import datetime
from geosyspy import Geosys
from dotenv import load_dotenv
import os
import datetime as dt
import numpy as np
from geosyspy.constants import Collection, Env, Region
# read .env file
load_dotenv()

API_CLIENT_ID = os.getenv("API_CLIENT_ID")
API_CLIENT_SECRET = os.getenv("API_CLIENT_SECRET")
API_USERNAME = os.getenv("API_USERNAME")
API_PASSWORD = os.getenv("API_PASSWORD")


class TestGeosys:

    # polygon with two pixels : mh11v4i225j4612, mh11v4i226j4612
    polygon = "POLYGON((-91.29152885756007 40.39177489815265,-91.28403789132507 40.391776131485386,-91.28386736508233 40.389390758655935,-91.29143832829979 40.38874592864832,-91.29152885756007 40.39177489815265))"
    client = Geosys(
        API_CLIENT_ID, API_CLIENT_SECRET, API_USERNAME, API_PASSWORD, Env.PREPROD, Region.NA
    )

    def test_authenticate(self):
        assert set(
            [
                "access_token",
                "expires_in",
                "token_type",
                "scope",
                "expires_at",
                "refresh_token",
            ]
        ).issubset(set(self.client.token.keys()))

    def test_get_time_series_modis_ndvi(self):

        start_date = dt.datetime.strptime("2020-01-01", "%Y-%m-%d")
        end_date = dt.datetime.strptime("2020-01-07", "%Y-%m-%d")

        df = self.client.get_time_series(
            self.polygon, start_date, end_date, Collection.MODIS, ["NDVI"]
        )

        assert df.index.name == "date"
        assert "value" in df.columns
        assert "index" in df.columns
        assert len(df.index) == 7
        date_range = list(map(lambda x: x.strftime("%Y-%m-%d"), df.index))
        assert set(
            [
                "2020-01-01",
                "2020-01-02",
                "2020-01-03",
                "2020-01-04",
                "2020-01-05",
                "2020-01-06",
                "2020-01-07",
            ]
        ).issubset(set(date_range))

    def test_get_satellite_image_time_series_modis_ndvi(self):

        start_date = dt.datetime.strptime("2020-01-01", "%Y-%m-%d")
        end_date = dt.datetime.strptime("2020-01-07", "%Y-%m-%d")

        df = self.client.get_satellite_image_time_series(
            self.polygon, start_date, end_date, [Collection.MODIS], ["NDVI"]
        )
        assert df.index.name == "date"
        assert set(["value", "index", "pixel.id"]).issubset(set(df.columns))
        assert np.all((df["index"].values == "NDVI"))
        assert len(df.index) == 14

        assert set(
            [
                "2020-01-01",
                "2020-01-02",
                "2020-01-03",
                "2020-01-04",
                "2020-01-05",
                "2020-01-06",
                "2020-01-07",
            ]
        ).issubset(set(df.index))

        assert set(["mh11v4i225j4612", "mh11v4i226j4612"]).issubset(set(df["pixel.id"]))

    def test_get_satellite_coverage_image_references(self):
        start_date = dt.datetime.strptime("2021-01-01", "%Y-%m-%d")
        end_date = dt.datetime.strptime("2022-01-01", "%Y-%m-%d")
        info, images_references = self.client.get_satellite_coverage_image_references(
            self.polygon, start_date, end_date, [Collection.SENTINEL_2]
        )

        assert set(
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
        ).issubset(set(info.columns))

        assert len(info) == len(images_references)
        for i, image_info in info.iterrows():
            assert (
                image_info["image.date"],
                image_info["image.sensor"],
            ) in images_references

    def get_time_series_weather_historical_daily(self):

        start_date = dt.datetime.strptime("2021-01-01", "%Y-%m-%d")
        end_date = dt.datetime.strptime("2022-01-01", "%Y-%m-%d")
        indicators = [
            "Precipitation",
            "Temperature.Ground",
            "Temperature.Standard",
            "Temperature.StandardMax",
            "Date",
        ]

        df = self.client.get_time_series(
            self.polygon,
            start_date,
            end_date,
            Collection.WEATHER_HISTORICAL_DAILY,
            indicators,
        )

        assert set(
            [
                "precipitation.cumulative",
                "precipitation.probabilities",
                "temperature.ground",
                "temperature.standard",
                "temperature.standardMax",
            ]
        ).issubset(set(df.columns))
        assert df.index.name == "date"

    # def test_get_metrics(self):

    #     lai_radar_polygon = "POLYGON((-52.72591542 -18.7395779,-52.72604885 -18.73951122,-52.72603114 -18.73908689,-52.71556835 -18.72490316,-52.71391916 -18.72612966,-52.71362802 -18.72623726,-52.71086473 -18.72804231,-52.72083542 -18.74173696,-52.72118937 -18.74159174,-52.72139229 -18.7418552,-52.72600257 -18.73969719,-52.72591542 -18.7395779))"
    #     schema_id = "LAI_RADAR"
    #     start_date = dt.datetime.strptime("2022-01-24", "%Y-%m-%d")
    #     end_date = dt.datetime.strptime("2022-01-30", "%Y-%m-%d")
    #     df = self.client.get_metrics(lai_radar_polygon, schema_id, start_date, end_date)

    #     assert set(
    #         [
    #             "Values.RVI",
    #             "Values.LAI",
    #             "Schema.Id",
    #         ]
    #     ).issubset(set(df.columns))
    #     assert set(
    #         [
    #             "2022-01-24T00:00:00Z",
    #             "2022-01-25T00:00:00Z",
    #             "2022-01-26T00:00:00Z",
    #             "2022-01-27T00:00:00Z",
    #             "2022-01-28T00:00:00Z",
    #             "2022-01-29T00:00:00Z",
    #             "2022-01-30T00:00:00Z",
    #         ]
    #     ).issubset(set(df.index))
    #     assert df.index.name == "date"

    def test_get_satellite_image_time_series(self):
        start_date = dt.datetime.strptime("2021-03-01", "%Y-%m-%d")
        end_date = dt.datetime.strptime("2021-04-30", "%Y-%m-%d")
        dataset = self.client.get_satellite_image_time_series(
            self.polygon,
            start_date,
            end_date,
            collections=[Collection.SENTINEL_2, Collection.LANDSAT_8],
            indicators=["Reflectance"],
        )

        assert dict(dataset.dims) == {'band': 5, 'y': 36, 'x': 66, 'time': 7}
