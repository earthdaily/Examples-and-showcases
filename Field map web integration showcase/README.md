<div id="top"></div>
<!-- PROJECT SHIELDS -->
<!--
*** See the bottom of this document for the declaration of the reference variables
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href=https://github.com/GEOSYS>
    <img src=https://earthdailyagro.com/wp-content/uploads/2022/01/Logo.svg alt="Logo" width="400" height="200">
  </a>

  <h1 align="center">Field Level Map webview</h3>

  <p align="center">
    The current example aims to provide samples, snippets and examples on how to display field level maps coming from &ltgeosys/&gt api within Openlayers, Leaflet, or other libraries.
    <br />
    <a href=https://earthdailyagro.com/><strong>Who we are</strong></a>
    <br />
    <br />
    <a href=https://github.com/GEOSYS/Examples-and-showcases</a>
    ·
    <a href=https://github.com/GEOSYS/Examples-and-showcases/issues>Report Bug</a>
    ·
    <a href=https://github.com/GEOSYS/Examples-and-showcases/issues>Request Feature</a>
  </p>
</p>

<div align="center">
  
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Twitter][twitter-shield]][twitter-url]
[![Youtube][youtube-shield]][youtube-url]
<!--[![languages][language-python-shiedl]][]-->
<!--[![languages][NETcore-shield]][NETcore-url]-->
<!--[![CITest][CITest-shield]][CITest-url]-->
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
  
</div>

<!--[![Stargazers][GitStars-shield]][GitStars-url]-->
<!--[![Forks][forks-shield]][forks-url]-->
<!--[![Stargazers][stars-shield]][stars-url]-->

<!-- TABLE OF CONTENTS -->
<details closed>
  <summary>Table of Contents</summary>
  <ol>
        <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#support-development">Support development</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#copyrights">Copyrights</a></li>
  </ol>
</details>

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Use of this project requires valids credentials from the '<geosys/> platform . If you need to get trial access, please register [here](https://earthdailyagro.com/geosys-api/#get-started).

### Installation
To start replicate current project and launch it using your code editor.

### Configuration

For steps 1),2), and 3) please refer to the existing Geosys API documentation.
You will have to use : your login/password, your field Id and an image that covers your field. In this projet, we are supposing that you know how to do those steps.
The purpose of this repo is to highlight the OpenLayer & Leaflet integration, not to focus on the Geosys API.

The workflow steps are:
1) Get the token
2) Get the map product properties including the links to the image, the world file, the legend, etc.
3) Get the product image(PNG)/world file (PGW) and transform it into image(BLOB)/image extent (ARRAY).
4) Create a map with OpenLayers and another with Leaflet.
Update the appseettings file: 

```
"Azure": { 
   "BlobStorage": {
    "ConnectionString": "MyAzureBlobStorageConnectionString" <- Put the connection string to your Microsoft Storage account }
    }, 
   "IdentityServer": { 
    "Url": "IdentityServerUrl", -> On veut target la préprod ou/et la prod ??? 
    "TokenEndPoint": "connect/token", 
    "UserLogin": "myuser", <- Set the user login get from your trial access here "UserPassword": 
    "mypassword", <- Set the password get from your trial access here 
    "ClientId": "myclientid", <- Set the clientId get from your trial access here "ClientSecret": 
    "myclientsecret", <- Set the clientSecret get from your trial access here 
    "Scope": "openid offline_access", "GrantType": "password" 
    }, 
    "MapProduct": { 
      "Url": "MapProductUrl"
     }
```
Finally build and deploy host this web project in your infrastructure.
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

<p align="right">(<a href="#top">back to top</a>)</p>
  
<!-- RESOURCES -->
## Resources 
The following links will provide access to more information:
- [EarthDaily agro developer portal  ](https://developer.geosys.com/)


<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Support development

If this project has been useful, that it helped you or your business to save precious time, don't hesitate to give it a star.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the [GPL 3.0 License](https://www.gnu.org/licenses/gpl-3.0.en.html). 

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

For any additonal information, please <a href="mailto: sales@earthdailyagro.com">email us</a>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- COPYRIGHT -->
## Copyrights

© 2022 Geosys Holdings ULC, an Antarctica Capital portfolio company | All Rights Reserved.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
<!-- List of available shields https://shields.io/category/license -->
<!-- List of available shields https://simpleicons.org/ -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo.svg?style=social
[NETcore-shield]: https://img.shields.io/badge/.NET%20Core-6.0-green
[NETcore-url]: https://github.com/dotnet/core
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
[language-python-shiedl]: https://img.shields.io/badge/python-3.7-green?logo=python
[language-python-url]: https://pypi.org/ 
[GitStars-shield]: https://img.shields.io/github/stars/GEOSYS?style=social
[GitStars-url]: https://img.shields.io/github/stars/GEOSYS?style=social
[CITest-shield]: https://img.shields.io/github/workflow/status/GEOSYS/qgis-plugin/Continous%20Integration
[CITest-url]: https://img.shields.io/github/workflow/status/GEOSYS/qgis-plugin/Continous%20Integration





