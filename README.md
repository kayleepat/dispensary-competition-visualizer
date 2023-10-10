# Dispensary Competition Visualizer

## Overview
The Dispensary Competition Visualizer is a web application designed to provide users with valuable insights into the competitive landscape of dispensaries within the state of Florida. By selecting a specific radius and clicking on the map, users can highlight competing dispensaries. The application updates a table and various charts to offer a comprehensive overview of the local competitive environment.

### Data Dashboard
The application's data dashboard consists of multiple visual elements that provide valuable information:
- **Bar Chart:** This chart displays the distances of all competitors within the selected radius, allowing users to quickly gauge the proximity of competing dispensaries.
- **Doughnut Chart:** The doughnut chart offers a visual representation of the local market share, illustrating the percentage of stores each company occupies within the specified radius.
- **Table:** The table provides detailed information about the top 10 competitors. Users can view data such as company name, address, and distance from the selected dispensary.

## Tools Used
This webpage is powered by several dependencies shown below:
- [Leaflet](https://leafletjs.com/)
- [D3.js](https://d3js.org/)
- [Chart.js](https://www.chartjs.org/)
- [Splinter](https://splinter.readthedocs.io/en/latest/)
- [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Flask](https://flask.palletsprojects.com/en/3.0.x/)
- [SQLite](https://www.sqlite.org/index.html)
- [Pandas](https://pandas.pydata.org/docs/)
- [Numpy](https://numpy.org/doc/)
- [Geoapify API](https://www.geoapify.com/)

## Data Source
The data used in this application is sourced from the [Office of Medical Marijuana Use Website](https://knowthefactsmmj.com/mmtc/). The data is first scraped from the website and then stored in an SQLite database. To facilitate its visualization, the data is converted into geoJSON format for use with the Leaflet library.

## Future Plans
- Update markers to show unique icon for each company
- Provide a general overview of the entire state of Florida
