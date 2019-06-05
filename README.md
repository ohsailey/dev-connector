# DevConnector

> Udemy的課程[MERN Stack Front to Back](https://www.udemy.com/mern-stack-front-to-back/)，主要使用MERN架構來建構一個為開發者交流的社群網站，

### What did I learn?

* Build a full stack social network app with React, Redux, Node, Express & MongoDB
* Create an extensive backend API with Express
* Use Stateless JWT authentication practices
* Integrate React with an Express backend in an elegant way
* React Hooks, Async/Await & modern practices
* Use Redux for state management
* Deploy to Heroku with a postbuild script


## Quick Start

```bash
# Install dependencies for server
npm install

# Install dependencies for client
npm run client-install

# Run the client & server with concurrently
npm run dev

# Run the Express server only
npm run server

# Run the React client only
npm run client

# Server runs on http://localhost:5000 and client on http://localhost:3000
```

You will need to create a keys_dev.js in the server config folder with

```
module.exports = {
  mongoURI: 'YOUR_OWN_MONGO_URI', // MongoDB 雲端資料庫URI
  secretOrKey: 'YOUR_OWN_SECRET'  // 這裡的key是為了jwt來產生加密的token
};
```
