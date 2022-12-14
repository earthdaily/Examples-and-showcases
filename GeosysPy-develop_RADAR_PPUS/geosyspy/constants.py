from enum import Enum


class Collection(Enum):
    """
    Available imagery and weather collections
    """
    MODIS = "MODIS"
    SENTINEL_2 = "SENTINEL_2"
    LANDSAT_8 = "LANDSAT_8"
    LANDSAT_9 = "LANDSAT_9"
    WEATHER_FORECAST_DAILY = "WEATHER.FORECAST_DAILY"
    WEATHER_FORECAST_HOURLY = "WEATHER.FORECAST_HOURLY"
    WEATHER_HISTORICAL_DAILY = "WEATHER.HISTORICAL_DAILY"


class Env(Enum):
    """
    Environment to target (PROD, PREPROD)
    """
    PROD = "prod"
    PREPROD = "preprod"


class Region(Enum):
    """
    Region to target (NA, EU)
    """
    NA = "na"
    EU = "eu"
