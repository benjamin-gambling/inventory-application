# Inventory Application

After completing a number tutorials and creating some simple projects using node and express, I decided to create my own imaginary business that focussed around managing inventory. I wanted this to simulated a real user experience where products could be purchased and the stock would be updated in real time, as well i wanted to add owner features that meant they could create new items and update old ones. I decided my business would be to sell water bottles but wanted to design it so that if desired it could be change to sell pretty much anything without having to be built from scratch again. To do this i used the CRUD method using the MVC design pattern.

# ![Inventory Application](readme_img/screenshot.png)

The bottles were built up of two models, color and product type. These were used to create, update bottles and then were unable to be deleted while still in use. I made all destructive actions only accessible via an admin page which is password protected. I added the ability to upload images of the product to make my content more visually appealing.

i made the stock visible and created a buy function to simulate the site in use, with real time stock updates and the pages dynamically changing when items 'sell out'.

> Product In-Stock

# ![Inventory Application](readme_img/screenshot_buy.png)

> Product Out of Stock

# ![Inventory Application](readme_img/screenshot_out.png)

#### Admin Features

> Admin Page showing all products with the create, update and delete buttons

# ![Inventory Application](readme_img/admin1.png)

# ![Inventory Application](readme_img/admin2.png)

> Create/Update Form

# ![Inventory Application](readme_img/admin3.png)

If you are interested in playing around with the destructive features of the website, feel free to create a pull request or message me directly for the admin password.

## Table of contents

1. [Demo](#demo)
2. [Technologies](#technologies)
3. [Features](#features)
4. [Development](#development)
5. [License](#license)

## Demo

Here is the working live demo:
[https://bgwd-inventory-application.herokuapp.com/shop](https://bgwd-inventory-application.herokuapp.com/shop).

## Technologies

- Modern JavaScript (ES6 +)
- [Handlebars](https://handlebarsjs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Heroku](https://www.heroku.com/about)

  <img width="64" height="64" src="readme_img/handlebars_logo.png">
  <img width="64" height="64" src="readme_img/bootstrap.png">
  <img width="64" height="64" src="readme_img/node_logo.jpeg">
  <img width="175" height="64" src="readme_img/ExpressJS.png">
  <img width="64" height="64" src="readme_img/mongodb.png">
  <img width="64" height="64" src="readme_img/heroku.png">

## Features

- CRUD application w/ password protected destructive features
- Uses an MVC model
- .hbs template engine
- MongoDB NoSQL Database
- Real time product stock view
- Customer simulation (buy products)
- Create, Update and Delete products and product models
- Range of express middleware such as express-validator and multer

## Development

- Create optional search/filter methods (color/product etc)
- Find a way to keep individual user logged on to admin features without making features accessible to anyone on site.

## License

> You can check out the full license [here](LICENSE)

This project is licensed under the terms of the **MIT** license.

#### This README was made using my [React ReadMe Maker](https://benjamin-gambling.github.io/markdown-previewer/)
