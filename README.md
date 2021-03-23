# Yelp Audience Builder

The goal of this project is to enable a user to build an audience profile of Yelp users who have written reviews on the service, based off of a specific category of restaurant. 

A user can search for businesses by category (i.e. 'mexican', 'cantonese') or search for all users who have written reviews for the same list of businesses. 

*Note: This is a fork of a previous coding assignment meant to test whether a database is needed at all for this project. I am planning to proceed without one as of writing (8/31/20)*

## Use

To start the docker containers you may run `make run` or `docker-compose build` and then `docker-compose up`.

You may use any of the following end points to query the data:

* `/<category>/search`
* `/search/<category` - the main search function of the application, this allows you to obtain a list of businesses and users that match this category 
* `/categories` - view a list of all available categories
* `/business/<category>` - view a list of all businesses near a specified address that contain a specified category
* `/users/<category>` - gather a list of users that have written reviews for restaurants with this category

#### Known Issues

Occasionally, `docker inspect yabdb_docker` is needed to fetch the IP address for the container, which is used by the backend `app.py` to connect
to the db. At a later date this could be fixed. 

## How it works

Currently, the application will call the Yelp API's `/businesses/search` endpoint with a `category` and `address` parameter in order to obtain, and then save, a list of businesses that possess the `category` and are near the specified `address`. The data gets saved into a PostgreSQL database table called `businesses` and the categories are mapped to the businesses in a `business_categories` table. 

To find the user list, the Yelp `/businesses/{id}/reviews` endpoint is called, which returns a list of three reviews sorted by Yelp's default sorting algorithm. Each review has data on the user that wrote the review, so a user object is created and saved to the database in a `users` table. Right now a user can only exist for one review. 


## Potential

More work could be done to build out the user data into a more valid form of audience profiling. Yelp does not offer much in the way of user querying but round-about ways of identifying user data with each user's unique ID could be done. Web scraping of a user's reviews on their profile page could reveal more information on their preferences - perhaps how frequently they visit a category.


### Checklist
<i>The project has met the needs of the assignment as follows:</i>
<br>
* A backend service was created with **Python**
* Calls a third party API - **Yelp**
* Collects two pieces of connected information - **Businesses** & **Users that have written reviews**, **Categories** & **Businesses that possess those Categories**
* Stored in a PostgreSQL database with tables: **categories, businesses, users, business_categories**
* Run in a docker container using **docker-compose**
* Create a README