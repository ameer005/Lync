# Lync

## Table of Contents

- [Lync](#lync)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
  - [Setup](#setup)
  - [Continued Development](#continued-development)

## Introduction

Lync is a web application built with Next.js, MongoDB, Express, Node.js, Socket.IO, and Mediasoup. It provides a platform for video conferencing with features such as screen sharing and high-quality video conferences. This README file will guide you through the setup, installation, and usage of Lync.

## Features

- Video conferencing with multiple participants
- Screen sharing during conferences
- Secure user authentication
- Responsive design for various devices
- High-quality audio and video streaming
- Integration with Mediasoup for media processing

## Technologies Used

- **Next.js:** A React framework for building server-rendered React applications.
- **MongoDB:** A NoSQL database for storing user and application data.
- **Express:** A Node.js web application framework for building RESTful APIs.
- **Node.js:** A JavaScript runtime environment for building server-side applications.
- **Socket.IO:** A library for enabling real-time, bidirectional communication between clients and the server.
- **Mediasoup:** A WebRTC media server for enabling real-time video conferencing.
- **WebRTC:** A framework for real-time communication on the web.

## Getting Started

Before you begin, make sure you have the following prerequisites installed:

- Node.js (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/)
- npm (Node Package Manager, comes with Node.js)

## Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ameer005/lync.git
   ```

2. **Install Dependencies:**

   ```plaintext
   cd server
   npm install

   cd client
   npm install
   ```

3. **Configure Environment Variables:**
   ```plaintext
   MONGO_URL=
   JWT_SECRET=
   ACCESS_TOKEN_SECRET=
   REFRESH_TOKEN_SECRET=
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USER=
   SMTP_PASS=
   ```
4. **Start the Application::**

   ```bash
   cd server
   npm run dev

   cd client
   npm run dev
   ```

## Continued Development

- **In-Meeting Real-Time Chat:** I'm working on integrating a real-time chat feature that will allow participants to communicate within meetings. Whether it's sharing important links, discussing topics, or coordinating tasks
