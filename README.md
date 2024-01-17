# LightBnB

This project was build as part of the learning process at Lighthouse Labs. The purpose of this project is to design a database and use server-side JavaScript to display the information from queries to web pages.

Lighthouse BnB is an app that will revolutionize the travel industry. It will allow homeowners to rent out their homes to people on vacation, creating an alternative to hotels and bed and breakfasts...Users can view property information, book reservations, view their reservations, and write reviews.

## Getting Started

1. Clone this repository https://github.com/Lalika31253/LightBnB onto your local device
2. Install dependencies using the npm install command
3. Populate your Database by runnig the following commands in psql:
* \i migrations/01_schema.sql
* \i seeds/01_seeds.sql
* \i seeds/02_seeds.sql
4. Start the web server using the npm run local command. The app will be served at http://localhost:3001/
5. Go to http://localhost:3001/ in your browser and look for the best options for your stay or post a propperty for your future guests

![Home_page](https://github.com/Lalika31253/LightBnB/blob/main/LightBnB_WebApp-master/public/pictures/Lightbnb_home_page.jpg)
![Search_page](https://github.com/Lalika31253/LightBnB/blob/main/LightBnB_WebApp-master/public/pictures/Lightbnb_search_page.jpg)
![Create_listing_page](https://github.com/Lalika31253/LightBnB/blob/main/LightBnB_WebApp-master/public/pictures/Lightbnb_create_listing_page.jpg)


## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.
