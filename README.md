[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6AnthtIo)
# DeliverUS-Advanced - Project Requirements

## Introduction

DeliverUS is a made-up company whose business is focused on delivering food from 3rd parties (restaurants) to customers. To this end, we are requested to develop the needed software products which hopefully will boost the company. After interviewing the product owners and some stakeholders, the general objectives and requirements have been agreed, as described in this document.

## General Objective: Manage customer orders to restaurants

The software has to enable customers to order products to restaurants. To this end the following objectives have been identified

* Objective 1: Restaurants management
* Objective 2: Restaurants' products management
* Objective 3: Restaurants' order management
* Objective 4: Customers' order management
* Objective 5: Users management

## Information requirements

### IR-1: Users

DeliverUS-Advanced expects two types of users: restaurant owners and customers. The following information should be stored: First name, last name, email, phone number, avatar image, address and postal code. For login and authentication purposes, a password, a token and a tokenExpiration date should also be stored.

### IR-2: Restaurants

Owners manage restaurants. The following information should be stored: name, description, address, postal code, url, email, phone number, logo, hero image (it will serve as restaurant background image), shipping costs (default for orders placed to this restaurant), average service time in minutes (which will be computed from the orders record), status. A restaurant status represent if it is accepting orders, currently unavailable, or temporarily/permanently closed.
There are some predefined restaurant categories on the system, so the restaurant will belong to one restaurant category.

### IR-3: Products

Products are sold by restaurants. Each product belongs to one restaurant. The following information should be stored: name, description, price, image, order and availability. The order is intended for sorting purposes that could be defined by the owner so the products are ordered according to his/her interests.

There are some predefined product categories on the system, so the product will belong to one product category.

### IR-4: Orders

Orders are placed by customers. Each order will include a set of products from one particular restaurant. Orders cannot include products from more than one restaurant. The following information should be stored: creation date (when the customer places the order), start date (when a restaurant accepts the order), sent date (when the order leaves the restaurant) and delivery date (when the customer receives the order), total price of the products included, the address where it has to be delivered, and the shipping costs.

The system has to store the quantity of each product included in the order and the unitary price of each product at the moment of order placement.

## Class diagram proposed for design

From the information requirements and objectives described, the following class diagram is proposed:

![DeliverUS-Advanced-EntityDiagram drawio (3)](https://user-images.githubusercontent.com/19324988/155700850-bb7817fb-8818-440b-97cb-4fbd33787f20.png)

## Business rules

* BR1: If an order total price is greater than 10€ the shipping costs will be 0€ (free shipping).
* BR2: An order can only include products from one restaurant
* BR3: Once an order is accepted by the restaurant owner, it cannot be modified or deleted.

## Functional requirements

### Customer functional requirements

As a customer, the system has to provide the following functionalities:

#### FR1: Restaurants listing

Customers will be able to query all restaurants.

#### FR2: Restaurants details and menu

Customers will be able to query restaurants details and the products offered by them.

#### FR3: Add, edit and remove products to a new order

A customer can add several products, and several units of a product to a new order. Before confirming, customer can edit and remove products. Once the order is confirmed, it cannot be edited or removed.

#### FR4: Confirm or dismiss new order

If an order is confirmed, it is created with the state _pending_. Shipping costs must follow BR1: _Orders greater than 10€ don't have service fee_. An order is automatically related to the customer who created it.
If an order is dismissed, nothing is created.

#### FR5: Listing my confirmed orders

A Customer will be able to check his/her confirmed orders, sorted from the most recent to the oldest.

#### FR6: Show order details

A customer will be able to look his/her orders up. The system should provide all details of an order, including the ordered products and their prices.

#### FR7: Show top 3 products

Customers will be able to query top 3 products from all restaurants. Top products are the most popular ones, in other words the best sellers.

### Owner functional requirements

As a restaurant owner, the system has to provide the following functionalities:

#### FR1: Add, list, edit and remove Restaurants

Restaurants are related to an owner, so owners can perform these operations to the restaurants owned by him. If an owner creates a Restaurant, it will be automatically related (owned) to him.

#### FR2: Add, list, edit and remove  Products

An owner can create, read, update and delete the products related to any of his owned Restaurants.

#### FR3: List orders of a Restaurant

An owner will be able to inspect orders of any of the restaurants owned by him. The order should include products related.

#### FR4: Update the state of an order

An owner can change the state of an order. States can change from: _pending_ to _in process_, from _in process_ to _sent_, and finally from _sent_ to _delivered_.

#### FR5: Show a dashboard including some business analytics

 #yesterdayOrders, #pendingOrders, #todaysServedOrders, #invoicedToday (€)

## Non-functional requirements

### Portability

The system has to provide users the possibility to be accessed and run through the most popular operating systems for mobile and desktop devices.

### Security

Backend should include basic measures to prevent general security holes to be exploited such as: sql injection, contentSecurityPolicy, crossOriginEmbedderPolicy, crossOriginOpenerPolicy, crossOriginResourcePolicy, dnsPrefetchControl, expectCt, frameguard, hidePoweredBy, helmet.hsts, ieNoOpen, noSniff, originAgentCluster, permittedCrossDomainPolicies, referrerPolicy, xssFilter.

For login and authentication purposes, a password, a token and a tokenExpiration (token authentication strategy) date should also be stored for users.

Note: This subject does not focus on security topics, but we will use libraries made by cybersecurity experts that will help us to include these measures. In Node.js ecosystem we will use the helmet package for the rest of potential security holes when publishing REST services.

### Scalability

The system should use a stack of technologies that could be deployed in more than one machine, horizontal scalability ready.

## Proposed architecture

Once that requirements have been analyzed by our company's software architects, the following general architecture is proposed:

1. Client-server architecture model.
2. Front-end and backend independent developments.
3. One front-end development for each type of user (Customer and Owners).

Moreover, these architects propose the following technological stack:

1. Backend:
   1. Relational database or document-oriented database. It may be deployed on a machine other than where the rest of subsystems are deployed.
   2. DeliverUS-Advanced backend application logic developed in Node.js application server that publishes functionalities as RESTful services helped by Express.js framework.


# Backend deployment steps

1. Accept the assignment of your github classroom if you have not done it before. Once you accepted it, you will have your own copy of this project template.
1. Clone your private repository at your local development environment by opening VScode and clone it by opening Command Palette (Ctrl+Shift+P or F1) and `Git clone` this repository, or using the terminal and running

   ```Bash
   git clone <url>
   ```

      It may be necessary to setup your github username by running the following commands on your terminal:

      ```Bash
      git config --global user.name "FIRST_NAME LAST_NAME"
      git config --global user.email "MY_NAME@example.com"
      ```

   In case you are asked if you trust the author, please select yes.

1. Setup your environment files `.env.mongo.local`, `.env.mongo.atlas`, `.env.sequelize` respectively.

## A) Docker deployment

   1. Include credential details for `.env.mongo.atlas`.

      ### a) Windows

      1. Run `win-setup.bat` in a powershell terminal
      1. Test your environment setup by running `npm test`

      ### b) Unix (Linux, MacOS and similar)

      1. Run `cp -f .env.docker .env`
      1. Run `docker compose up -d`
      1. Run `npm install`
      1. Test your environment setup by running `npm test`

## B) Local deployment

1. Install MongoDB and MariaDB.

   ### MariaDB setup

   1. Create a new database named as your `.env.sequelize` DATABASE_NAME property (by default it is set to `deliverusadvanced`)
   1. Create a new user named as your `.env.sequelize` DATABASE_USERNAME property (by default it is set to `deliverusadvanced`) and assign the password as DATABASE_PASSWORD (by default it is set to `deliverusadvanced`)
   1. Grant all privileges to the new user for the new database.

   ### MongoDB setup

   1. Follow the steps for enabling authentication mechanism and creating user detailed at: https://www.mongodb.com/docs/manual/core/authentication/
   1. You will need to create a new dabase/schema named as your `.env.mongo.local` DATABASE_NAME property (by default it is set to `deliverusadvanced`)

      Here you can find an example of a mongo command for the creation of the needed user with the default values:

      ```Bash
      db.createUser({ user : "deliverusadvanced", pwd : "deliverusadvanced", roles: [{role: "readWrite", db: "deliverusadvanced"}, {role: "dbAdmin", db: "deliverusadvanced"}]})
      ```

   ### a) Windows

   1. Run the following script in powershell terminal:

      ```Bash

      echo Iniciando npm install
      start npm install

      :: Obtén la ruta de PowerShell
      FOR /F "tokens=*" %%i IN ('where powershell') DO SET POWERSHELL_PATH=%%i


      echo  Configurando PowerShell como shell de script para npm
      CALL npm config set script-shell "%POWERSHELL_PATH%"

      echo Ejecutando PowerShell como administrador y habilitando la ejecución de scripts npm en powershell
      powershell -Command "Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force"
      ```

   1. Test your environment setup by running `npm test`

   ### b) Unix (Linux, MacOS and similar)

   1. Run `npm install`
   1. Test your environment setup by running `npm test`


# 1. New Requirements: Product Reviews

DeliverUS company has decided to include a new functionality. Customers should be able to write reviews on the products of the restaurant. These reviews should include: a title, a body, when the review was created, when the review was updated, the customer that made the review and a numeric review from 0 to 5 (stars). Reviews can be edited and deleted by the customer that made it (owns it).

Therefore, each product could be reviewed many times. From these reviews, the average stars of the product should be computed and returned when
listing restaurant products, this is in the GET request to `/restaurants/:restaurantId/products` and to `/restaurants/:restaurantId`. If a product has no reviews, the `avgStars` property should have a null value or be undefined. The product detail response shape should be as follows:

```JSON
{
  "name": "Paella",
  "description": "De marisco",
  "price": 5,
  "order": 4,
  "availability": true,
  "reviews": [
    {
      "title": "Very tasty",
      "body": "I loved it!  I will repeat for sure! I recommend it to everyone!",
      "stars": 5,
      "createdAt": "2024-01-23T16:02:28.695Z",
      "updatedAt": "2024-01-23T16:02:28.695Z",
      "userId": "63f74bf8eeed64054274b52d",
      "id": "65afe314658c4b9dda65cfc0",
    },
    {
      "title": "Not so good",
      "body": "The rice was sticky and overcooked!",
      "stars": 2,
      "createdAt": "2024-01-23T16:02:29.140Z",
      "updatedAt": "2024-01-23T16:02:29.140Z",
      "userId": "63f74bf8eeed64054274b52d",
      "id": "65afe315658c4b9dda65d0a1",
    },
  ],
  "createdAt": "2024-01-23T16:02:27.246Z",
  "updatedAt": "2024-01-23T16:02:27.246Z",
  "productCategoryId": "63f7964b682cae15acbda1fb",
  "restaurantId": "6400897a9262622bea152962",
  "avgStars": 3.5,
  "productCategory": [
    {
      "name": "Main Courses",
      "id": "63f7964b682cae15acbda1fb",
    },
  ],
  "id": "65afe313658c4b9dda65cd8c",
}
```

The reviews of each product should be returned when showing product details, this is in the GET request to `/products/:productId`.

Moreover, to create a review, it is expected to be done by making a POST request to `/products/:productId/reviews` with the following sample json body:

```JSON
{
   "title": "Review title",
   "body": "Review body. It can be a long text",
   "stars": 4
}
```

and should return a HTTP 200 OK Status code and the following JSON body:

```JSON
{
   "id": "reviewId",
   "title": "Review title",
   "body": "Review body. It can be a long text",
   "stars": 4,
   "userId": "theIdOfTheUserThatMadeTheReview"
}
```

Similarly, to update a review, it is expected to be done by making a PUT request to `/products/:productId/reviews/:reviewId` including the same JSON Body, and to remove a review by making a DELETE request to `/products/:productId/reviews/:reviewId`.
