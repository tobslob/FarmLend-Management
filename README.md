[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

<div id="top"></div>

<!--
*** Inspired by the Best-README-Template.
*** Let's create something AMAZING! :D

*** GitLab Flavored Markdown - https://gitlab.com/gitlab-org/gitlab/-/blob/master/doc/user/markdown.md
-->


<div align="center">
  <h1>FarmLend-Management-System</h1>
</div>

## 📍 About The Project

`FarmLend-Management-System` is a CRUD endpoint that facilitates buy and sell between farmers and consumers

`https://documenter.getpostman.com/view/6225567/2s93JtQiRT` Documentation

`https://farmlend.vercel.app` Frontend application

`farmlendz-2009802627.eu-north-1.elb.amazonaws.com` Backend application api

## Login Details
```
emailAddress: "odutola_k@yahoo.ca"
password: "Kazeem27"
```

## DB MODEL

![DB MODEL](https://github.com/tobslob/FarmLend-Management/blob/master/database-model.png?raw=true)


# Running locally

To start the application in dev mode, please run:

```sh
git clone https://github.com/tobslob/FarmLend-Management.git
```

```sh
cd FarmLend-Management
```

```sh
 yarn install
```

```sh
 add `.env` to root folder, copy the .env.example
```

```sh
 yarn watch
```

```sh
 yarn start:dev
```

## Running using docker compose

Install PostgreSQL on local machine using the following command:

```sh
docker pull postgres

## 1. We will create a local folder and mount it as a data volume for our running container to store all the database files in a known location.

mkdir ${HOME}/postgres-data/
## 2. run the postgres image

docker run -d --name dev-postgres \
 --restart=always \
 -e POSTGRES_PASSWORD=secret \
 -e POSTGRES_USER=postgres \
 -e POSTGRES_DB=video-manager \
 -v ${HOME}/postgres-data/:/var/lib/postgresql/data \
 -p 5432:5432 postgres
## 3. check that the container is running
docker ps

```
```sh
 docker compose up
```

```sh
Application is ready to receive connection @ http://localhost:8080
```
```sh
## API Documentation
https://documenter.getpostman.com/view/6225567/2s8ZDcyKSF
```
```sh
## API-ENDPOINTS

- V1
# USER

`- POST /api/v1/users Create user account`

`- POST /api/v1/users/login Login a user`

`- GET /api/v1/users/<:id>`

# ORGANIZATION

`- POST /api/v1/organizations` Create an organization

`- GET /api/v1/organizations/<:id>` Get an organization

`- GET /api/v1/organizations/?type=buyer&name=Farmlend` Get organizations

`- DELETE /api/v1/organizations/<:id>` Delete a organization

`- PATCH /api/v1/organizations/:id Patch an organization

# PRODUCT

`- POST /api/v1/products` Create a product`

`- GET /api/v1/products/<:id>` Get product`

`- GET /api/v1/products/?category=Bananas&variety=Gala` Get organizations`

`- DELETE /api/v1/products/<:id>` Delete a product`

`- PATCH /api/v1/products/<:id>` Patch a product

# ORDER

`- POST /api/v1/orders` Create an order`

`- GET /api/v1/orders/<:id>` Get order`

`- GET /api/v1/orders/?category=Bananas&variety=Gala` Get orders`

`- DELETE /api/v1/orders/<:id>` Delete a order`

`- PATCH /api/v1/orders/<:id>` Patch a order
```

## Run using Docker Image

Use the following command

```sh
docker pull public.ecr.aws/t4y9h2u0/farmlend:latest
```

```sh
docker run -p 8080:8080 public.ecr.aws/t4y9h2u0/farmlend:latest
```

```sh
Application is ready to receive connection @ http://localhost:8080
```
