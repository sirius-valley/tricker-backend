# Tricker Backend

## Overview

The Tricker backend is a robust and scalable server-side application providing real-time ticket tracking capabilities. It's built using Node.js and Express, leveraging TypeScript for added type safety and developer productivity. This backend serves as the core logic provider and data aggregator, interfacing with various ticketing systems like Linear, Jira, etc.

## Key Features

-   **Real-Time Data Processing**: Efficient handling of real-time ticket data from multiple sources.
-   **API Integration**: Seamless integration with ticketing platforms like Linear and Jira.
-   **Scalable Architecture**: Designed to handle high loads and concurrent requests.
-   **Security**: Implementing best practices for secure data handling and transmission.

## Technology Stack

-   **Node.js**: For building the server-side application.
-   **Express**: As the web application framework.
-   **TypeScript**: For type-safe code and improved maintainability.
-   Additional dependencies: (List any key databases, libraries, or frameworks used.)

## Getting Started

### Prerequisites

-   Node.js (version 20 or later)
-   npm

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/sirius-valley/tricker-backend.git
    cd tricker-backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Create a .env file**

Copy the contents from .env.template adding your custom variables

4. **Run the application**

    ```bash
    npm start
    ```
