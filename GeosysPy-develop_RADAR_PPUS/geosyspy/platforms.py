"""
This file contains python dictionaries used to store the Geosys' APIs
URLs for the preprod/prod environments for both of north america
and Europe.

"""

IDENTITY_URLS = {
    'na': {
        'preprod': 'https://identity.preprod.geosys-na.com/v2.1/connect/token',
        'prod': 'https://identity.geosys-na.com/v2.1/connect/token'
    },
    'eu': {
        'preprod': 'https://identity.preprod.geosys-na.com/v2.1/connect/token',
        'prod': 'https://identity.geosys-eu.com/v2.1/connect/token'
    }
}
GEOSYS_API_URLS = {
    'na': {
        'preprod': 'https://api-pp.geosys-na.net',
        'prod': 'https://api.geosys-na.net'
    },
    'eu': {
        'preprod': 'https://api-pp.geosys-na.net',
        'prod': 'https://api.geosys-eu.net'
    }
}
