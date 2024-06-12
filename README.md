# News Aggregator API
Objective: Build a RESTful API that allows users to fetch news articles from multiple sources based on their preferences.

Project Description: In this project, I have created a RESTful API using Node.js, Express.js, and NPM packages. The API will allow users to register, log in, and set their news preferences (e.g., categories, sources). The API will then fetch news articles from multiple sources using external news APIs (e.g., NewsAPI). The fetched articles should be processed and filtered asynchronously based on user preferences.
## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [To Start Server](#startServer)

## Features

- POST api/register: Register a new user.
- POST api/login: Log in a user.
- GET api/preferences: Retrieve the news preferences for the logged-in user.
- PUT api/preferences: Update the news preferences for the logged-in user.
- GET api/news: Fetch news articles based on the logged-in user's preferences.
- POST api/news/:id/read: Mark a news article as read.
- POST api/news/:id/favorite: Mark a news article as a favorite.
- GET api/news/read: Retrieve all read news articles.
- GET api/news/favorites: Retrieve all favorite news articles.
- GET api/news/search/:keyword Search article' based on keyword from title, description and content.
- 
## Installation
npm install

## To Start Server

- create .env file where mention these fields:-
- PORT = 3000,
- JWT_SECRET_KEY = "whateverYouWant",
- API_KEY= "you will get your key from newsAPI",
- cd src
- run this command:- nodemon
