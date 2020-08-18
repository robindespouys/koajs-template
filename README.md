# koajs-template

A template for building a simple API with Koa.js framework

### Configure database connection

I use the [typeorm](https://github.com/typeorm/typeorm) ORM. [Here](https://typeorm.io/) you'll find the documentation in an other format.

you should create *dev.env* and *prod.env* files by copying the *.example files in [config](./config).

I chose to use a postgresql database but you can use whatever you like.
Just refer to the documentation for adapting the options in [create-connections-db.ts](./src/databases/create-connections-db.ts) and the *.env files in [config](./config).

If you don't already have a database ready to connect you can always use [docker](https://github.com/docker/docker-ce)

* To run a postgresql instance in a docker container

``` 
docker run --rm --name postgres-dockerized -e POSTGRES_USER=postgresuser -e POSTGRES_PASSWORD=postgrespassword -d  -v save-volume-name:/var/lib/postgresql/data -p 5432:5432 postgres:11
```

* If you are running on linux you should not have a problem to communicate with your docker image. 
* But, if you are having trouble on MAC OS X, you could use [docker-machine](https://github.com/docker/machine)

1. Retrieve the name of the virtual machine

``` 
  docker-machine ls
  ```

2. Retrieve the IP Address of the virtual machine by using its name e.g, default

``` 
  docker-machine ip default
  ```

3. Use this value to update *.env files in [config](./config).

### Create the database(s) 

At the moment, I did not find a way to automatically create the databases from the server code.
I suggest to manually create your database.

* If you are running a postgresql instance :

The most simple and efficient way to create a database is by using the [psql](http://www.postgresguide.com/utilities/psql.html#what-is-psql) tool.
  

``` 
  psql -h localhost -U postgresuser
  ```

  you will get prompted to enter your password e.g : postgrespassword
  

```
  create database "awesome-db-name-dev"; 
  create database "awesome-db-name-prod"; 
  ```

### Install

``` 
  npm install
  ```

### Linter

``` 
  npm run lint
  ```

### Run server in Development mode

``` 
  npm run dev
  ```

  + If you want to change the **listening port** [default: 3333] you can change the **PORT** parameter in [nodemon.json](./nodemon.json)

### Run server in Production mode  

``` 
  npm install pm2 -g
  npm run prod
  ```

  + If you want to change the **listening port** [default: 4444] you can change the **PORT** parameter in [pm2.config.js](./pm2.config.js)
