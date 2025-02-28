# React + TypeScript + Vite

## Project Overview
This repository contains the test assessment for Shayan Memarzade, for the Senior Frontend Developer position.


The APIs used:
* https://developer.nytimes.com/
* https://newsapi.org/
* https://open-platform.theguardian.com/

## Prerequisites
To run the project, you need to have Docker installed on your system. Follow the official Docker installation guide based on your operating system:

[Install Docker](https://docs.docker.com/get-docker/)

## Running the Project

1. **Build the Docker image:**

```bash
docker build . -t my-news-app:v1.0
```

2. **Run the Docker container:**

```bash
docker run -p 3000:3000 my-news-app:v1.0
```

## Notes
* Ensure Docker is running before executing the commands.
* The application will be accessible at `http://localhost:3000` after running the container.
* The APIs are using free tier, so they can easily reach to their limit after a few times of refreshing the page.
