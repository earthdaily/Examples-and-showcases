<div id="top"></div>
<!-- PROJECT SHIELDS -->
<!--
*** See the bottom of this document for the declaration of the reference variables
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/GEOSYS">
    <img src="https://earthdailyagro.com/wp-content/uploads/2022/01/Logo.svg" alt="Logo" width="400" height="200">
  </a>

  <h1 align="center">GeosysPy</h3>

  <p align="center">
    To be able to discover, request and use imagery products based on <geosys/> virtual constellation using the &ltgeosys/&gt API.
    <br />
    <a href="https://earthdailyagro.com/"><strong>Who we are</strong></a>
    <br />
    <br />
    <a href="https://github.com/GEOSYS/GeosysPy">Project description</a>
    ·
    <a href="https://github.com/GEOSYS/GeosysPy/issues">Report Bug</a>
    ·
    <a href="https://github.com/GEOSYS/GeosysPy/issues">Request Feature</a>
  </p>
</p>


<div align="center">
  
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Twitter][twitter-shield]][twitter-url]
[![Youtube][youtube-shield]][youtube-url]
[![languages][language-python-shiedl]][issues-url]
[![CITest][CITest-shield]][CITest-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
  
</div>


<!--[![Stargazers][GitStars-shield]][GitStars-url]-->
<!--[![Forks][forks-shield]][forks-url]-->
<!--[![Stargazers][stars-shield]][stars-url]-->


<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#support-development">Support development</a></li>
    <li><a href="#resources">Resources</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#copyrights">Copyrights</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

EarthDaily Agro is the agricultural analysis division of EartDaily Analytics. Learn more about Earth Daily at [EarthDaily Analytics | Satellite imagery & data for agriculture, insurance, surveillance](https://earthdaily.com/).  EarthDaily Agro uses satellite imaging to provide advanced analytics to mitigate risk and increase efficiencies – leading to more sustainable outcomes for the organizations and people who feed the planet.
<p align="center">
  <a href="https://earthdailyagro.com/geosys/">
    <img src="https://earthdailyagro.com/wp-content/uploads/2022/01/new-logo.png" alt="Logo" width="400">
  </a>
</p>

 <p align="left">
Throught our &ltgeosys/&gt platform, we make geospatial analytics easily accessible for you to be browsed or analyzed, within our cloud or within your own environment. We provide developers and data scientists both flexibility and extensibility with analytic ready data and digital agriculture ready development blocks. We empower your team to enrich your systems with information at the field, regional or continent level via our API or Apps.
</p>

We have a team of experts around the world that understand local crops and ag industry, as well as advanced analytics to support your business.

We have established a developer community to provide you with plug-ins and integrations to be able to discover, request and use aggregate imagery products based on Landsat, Sentinel, Modis and many other open and commercial satellite sensors.

The `geosyspy` python package aims to provide an easy and ready to use library allowing any Python developers to quickly experience Earthdaily Agro capabilities.

<p align="right">(<a href="#top">back to top</a>)</p>

## Features

* Data sourcing:
     * Get aggregated NDVI/EVI normalized times series from Modis satellite imagery as pandas dataframe
     * Get aggregated historical and forecast weather data (precipitation, temperatures...) location based time series as pandas dataframe
     * Get SENTINEL 2, LANDSAT 8 and LANSAT 9 satellite images time series in [xarray](https://docs.xarray.dev/en/stable/) format
* Analytic publication:
     * Save and retrieve custom data in Analytics Fabrik

See [documentation](https://geosys.github.io/GeosysPy/) and [Examples](examples.ipynb) notebook for more information

## Getting started

### Prerequisites

Make sure you have valid credentials. If you need to get trial access, please register [here](https://earthdailyagro.com/geosys-api/#get-started).

This package has been tested on Python 3.9.7.


### Installing

#### For Linux / Mac OS
```
pip install geosyspy
```

#### For Windows

Please refer to the [install.md](install.md) file.

### Run the package from source

1. Install dependencies

```
conda config --add channels conda-forge
conda install --file requirements.txt
```
or
```
pip install -r requirements.txt
```


2. Create .env file

You need a .env file with your credentials to run the [Examples](examples.ipynb) Jupyter notebook.

```
API_CLIENT_ID=
API_CLIENT_SECRET=
API_USERNAME=
API_PASSWORD=
```

3. Run the Jupyter notebook


### Run the package inside a Docker container

Build the image locally :

`docker build --tag geosyspy .`

Run it :

`docker run -it --env-file .env geosyspy`

or, without .env file :

`docker run -it -e API_CLIENT_ID='...' -e API_CLIENT_SECRET='...' -e API_USERNAME='...' -e API_PASSWORD='...' geosyspy`

Then :

```python
>>> from geosyspy.geosys import Geosys
>>> from geosyspy.constants import Collection, Region, Env
>>> import os
>>> client = Geosys(os.getenv('API_CLIENT_ID'), os.getenv('API_CLIENT_SECRET'), os.getenv('API_USERNAME'), os.getenv('API_PASSWORD'), Env.PREPROD, Region.NA)

```

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage

Initialize client:

```python
from geosyspy.geosys import Geosys
from geosyspy.constants import Collection, Region, Env

client = Geosys("API_CLIENT_ID", "API_CLIENT_SECRET", "API_USERNAME", "API_PASSWORD", Env.PREPROD, Region.NA)

```

Query data:

```python
polygon = "POLYGON((...))"

today = dt.date.today()
year_ago = dt.date.today() + relativedelta(months=-12)

dataframe = client.get_time_series(polygon, year_ago, today, collection=Collection.MODIS, indicators=["NDVI"])
```

See the Jupyter notebook [Examples](examples.ipynb) for a working example.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- RESOURCES -->
## Resources 
The following links will provide access to more information:
- [EarthDaily agro developer portal  ](https://developer.geosys.com/)
- [Pypi package](https://pypi.org/project/geosyspy/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Support development

If this project has been useful, that it helped you or your business to save precious time, don't hesitate to give it a star.

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the [GPL 3.0 License](https://www.gnu.org/licenses/gpl-3.0.en.html). 

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

For any additonal information, please [email us](mailto:sales@earthdailyagro.com).

<p align="right">(<a href="#top">back to top</a>)</p>

## Copyrights

© 2022 Geosys Holdings ULC, an Antarctica Capital portfolio company | All Rights Reserved.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
<!-- List of available shields https://shields.io/category/license -->
<!-- List of available shields https://simpleicons.org/ -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo.svg?style=social
[contributors-url]: https://github.com/github_username/repo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo.svg?style=plastic&logo=appveyor
[forks-url]: https://github.com/github_username/repo/network/members
[stars-shield]: https://img.shields.io/github/stars/qgis-plugin/repo.svg?style=plastic&logo=appveyor
[stars-url]: https://github.com/github_username/repo/stargazers
[issues-shield]: https://img.shields.io/github/issues/GEOSYS/qgis-plugin/repo.svg?style=social
[issues-url]: https://github.com/github_username/repo/issues
[license-shield]: https://img.shields.io/github/license/GEOSYS/qgis-plugin
[license-url]: https://www.gnu.org/licenses/gpl-3.0.en.html
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=social&logo=linkedin
[linkedin-url]: https://www.linkedin.com/company/earthdailyagro/mycompany/
[twitter-shield]: https://img.shields.io/twitter/follow/EarthDailyAgro?style=social
[twitter-url]: https://img.shields.io/twitter/follow/EarthDailyAgro?style=social
[youtube-shield]: https://img.shields.io/youtube/channel/views/UCy4X-hM2xRK3oyC_xYKSG_g?style=social
[youtube-url]: https://img.shields.io/youtube/channel/views/UCy4X-hM2xRK3oyC_xYKSG_g?style=social
[language-python-shiedl]: https://img.shields.io/badge/python-3.9-green?logo=python
[language-python-url]: https://pypi.org/ 
[GitStars-shield]: https://img.shields.io/github/stars/GEOSYS?style=social
[GitStars-url]: https://img.shields.io/github/stars/GEOSYS?style=social
[CITest-shield]: https://img.shields.io/github/workflow/status/GEOSYS/qgis-plugin/Continous%20Integration
[CITest-url]: https://img.shields.io/github/workflow/status/GEOSYS/qgis-plugin/Continous%20Integration
