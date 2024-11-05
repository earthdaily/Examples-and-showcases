<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/earthdaily">
    <img src="https://earthdailyagro.com/wp-content/uploads/2022/01/Logo.svg" alt="Logo" width="400" height="200">
  </a>

  <h1 align="center">Examples & Showcases</h1>

  <p align="center">
    Learn how to use &ltgeosys/&gt platform capabilities to integrate them in your own business workflow! 
    <br />
    <a href="https://earthdailyagro.com/"><strong>Who we are</strong></a>
    <br />
    <br />
    <a href="https://github.com/earthdaily/GeosysPy/issues">Report Bug</a>
    ·
    <a href="https://github.com/earthdaily/GeosysPy/issues">Request Feature</a>
  </p>
</p>

<div align="center">
</div>

<div align="center">
  
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Twitter][twitter-shield]][twitter-url]
[![Youtube][youtube-shield]][youtube-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</div>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>

- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
  * [Prerequisite](#prerequisite)
  * [Installation](#installation)
- [Usage with Jupyter Notebook](#usage-with-jupyter-notebook)
- [Resources](#resources)
- [Support development](#support-development)
- [License](#license)
- [Contact](#contact)
- [Copyrights](#copyrights)

</details>

<!-- ABOUT THE PROJECT -->
## About The Project

EarthDaily Agro is the agricultural analysis division of EartDaily Analytics. Learn more about Earth Daily at [EarthDaily Analytics | Satellite imagery & data for agriculture, insurance, surveillance](https://earthdaily.com/).  EarthDaily Agro uses satellite imaging to provide advanced analytics to mitigate risk and increase efficiencies – leading to more sustainable outcomes for the organizations and people who feed the planet.
<p align="center">
  <a href=https://earthdailyagro.com/geosys/>
    <img src=https://earthdailyagro.com/wp-content/uploads/2022/01/new-logo.png alt="Logo" width="400">
  </a>
</p>

 <p align="left">
Throught our &ltgeosys/&gt platform, we make geospatial analytics easily accessible for you to be browsed or analyzed, within our cloud or within your own environment. We provide developers and data scientists both flexibility and extensibility with analytic ready data and digital agriculture ready development blocks. We empower your team to enrich your systems with information at the field, regional or continent level via our API or Apps.
</p>

We have a team of experts around the world that understand local crops and ag industry, as well as advanced analytics to support your business.

The current project aims to provide samples, snippets and examples on how to integrate data and analytics but expand and enrich capabilites by creating your own analytic based satellite imagery, weather and many others available inputs. 

<p align="right">(<a href="#top">back to top</a>)</p>

<div id="top"></div>
<!-- PROJECT SHIELDS -->
<!--
*** See the bottom of this document for the declaration of the reference variables
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


<!-- GETTING STARTED -->
## Getting Started

### Prerequisite

To be able to run this example, you will need to have the following tools to be installed


1. Install Git

    Please install Git on your computer. You can download and install it by visiting the [official Git website]    (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and following the provided instructions

2. Install Conda

    Please install Conda on your computer. You can download and install it by following the instructions provided on the [official Conda website](https://conda.io/projects/conda/en/latest/user-guide/install/index.html)

3. Install Jupyter Notebook

    Please install jupyter Notebook on your computer. You can install it by following the instructions provided on the [official Jupyter website](https://jupyter.org/install)


If you want to test Earthdaily agro APIs, make sure you have valid credentials. If you need to get trial access, please register [here](https://earthdailyagro.com/geosys-api/#get-started).

If you want to access data directly from EarthDataStore, please make sure you have appropriate credentials, and that you follow the earthdaily python client installation documentation [here](https://earthdaily.github.io/earthdaily-python-client/).  If you need to get trial access, please register [here](https://console.earthdaily.com/mosaics/signup).


Those examples package have been tested on Python 3.13.0

<p align="right">(<a href="#top">back to top</a>)</p>


### Installation

To set up the project, follow these steps:

1. Clone the project repository:

    ```
    git clone https://github.com/earthdaily/Examples-and-showcases
    ```


2. Change the directory:

    ```
    cd Examples-and-showcases
    ```

3. Chooses your area of interest 

Run the following line if you're looking for accessing Earthdaily data (reflectances from EarthDataStore for instance)
    
    cd Data as a service

Run the following line if you're looking for accessing Earthdaily advanced analytics (ready-to-use vegetation indexes, agronomic analysis such as harvest detection, etc.)
    
    cd Analytics as a service

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage with Jupyter Notebook

To use the project with Jupyter Notebook, follow these steps:


1. Create a Conda environment:

    To create a Conda environment, ensure first you have installed Conda on your computer. You can download and install it by following the instructions provided on the official Conda website.
    
    ```
    conda create -y --name your_environment_name 
    ```


2. Activate the Conda environment:
    
    ```
    conda activate your_environment_name
    ```
   
3. Install the project dependencies. You can do this by running the following command in your terminal:

    ```
    conda install pip
    pip install -r requirements.txt
    pip install ipykernel
    ```
4. Set up the Jupyter Notebook kernel for the project:

    ```
    python -m ipykernel install --user --name your_environment_name --display-name your_kernel_name
    ```
5. Open jupyter and then the example notebook you want to use by clicking on it.


6. Select the "Kernel" menu and choose "Change Kernel". Then, select "your_kernel_name" from the list of available kernels.


7. Run the notebook cells to execute the code example.

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

Distributed under the [MIT License](https://github.com/earthdaily/Studies-and-Analysis/blob/main/LICENSE).

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

For any additonal information, please [email us](mailto:sales@earthdailyagro.com).

<p align="right">(<a href="#top">back to top</a>)</p>

## Copyrights

© 2023 Geosys Holdings ULC, an Antarctica Capital portfolio company | All Rights Reserved.

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
[stars-shield]: https://img.shields.io/github/stars/analytics-datacube-processor/repo.svg?style=plastic&logo=appveyor
[stars-url]: https://github.com/github_username/repo/stargazers
[issues-shield]: https://img.shields.io/github/issues/earthdaily/analytics-datacube-processor/repo.svg?style=social
[issues-url]: https://github.com/earthdaily/analytics-datacube-processor/issues
[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://opensource.org/licenses/MIT
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=social&logo=linkedin
[linkedin-url]: https://www.linkedin.com/company/earthdailyagro/mycompany/
[twitter-shield]: https://img.shields.io/twitter/follow/EarthDailyAgro?style=social
[twitter-url]: https://img.shields.io/twitter/follow/EarthDailyAgro?style=social
[youtube-shield]: https://img.shields.io/youtube/channel/views/UCy4X-hM2xRK3oyC_xYKSG_g?style=social
[youtube-url]: https://img.shields.io/youtube/channel/views/UCy4X-hM2xRK3oyC_xYKSG_g?style=social
[language-python-shiedl]: https://img.shields.io/badge/python-3.9-green?logo=python
[language-python-url]: https://pypi.org/ 
[GitStars-shield]: https://img.shields.io/github/stars/earthdaily?style=social
[GitStars-url]: https://img.shields.io/github/stars/earthdaily?style=social
[CITest-shield]: https://img.shields.io/github/workflow/status/earthdaily/analytics-datacube-v2/Continous%20Integration
[CITest-url]: https://img.shields.io/github/workflow/status/earthdaily/analytics-datacube-v2/Continous%20Integration
