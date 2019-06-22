## 我的餐廳清單

This is a web appliaction built by Node.js, Express.js, and Mongoose with basic CRUD functions 

### Key features
1. User can see all restaurants in the index page
2. User can click indivisual restaurant and view more information
3. User can create new restaurant
4. User can edit restaurant info
5. User can delete a restaurant

---
### Getting Started
#### Prerequisites/Environment
* Node.js v10.15.0
* Express.js v4.17.1
* Mongoose v5.6.0
* express-handlebars v3.1.0

#### Clone this project
```
$ git clone https://github.com/jacs0110/node_restaurant_list_crud.git
```
#### Setup
0. Create a local database "restaurantListDB" on MongoDB

1. Go to the project folder **node_restaurant_list_crud**

2. Install npm packages
```
$ npm install
```
3. Add seed data

```
$ cd models/seeds
```
     
```
$ node restaurantSeeder.js 
```

4. Run the server
```
$ npm run dev
```
and you will see "Listening on http://localhost:3000"  and "MongoDB connected!" in the console

---
### Authors
[Jacs](https://github.com/jacs0110)

*I'm now learning web development and want to become a software engineer in the future. Feel free to let me know if you have any feedback or questions about my project. Thanks!*
