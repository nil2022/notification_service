# Notification Service

<p align="left">
<a href="https://github.com/nil2022/notification_service/actions/workflows/vulnerability-check.yml" target="_blank"><img src="https://github.com/nil2022/notification_service/actions/workflows/vulnerability-check.yml/badge.svg?branch=master" alt="Node.js Vulnerability Check" /></a>
<a href="https://github.com/nil2022/notification_service/actions/workflows/github-code-scanning/codeql" target="_blank"> <img src="https://github.com/nil2022/notification_service/actions/workflows/github-code-scanning/codeql/badge.svg?branch=master" alt="CodeQL" /></a>
</a>
</p>

This is the `notification-service`, a service designed to send notifications to users of a CRM application.

## Description

The notification service is responsible for the integration and handling of notification-related tasks. It is built using Node.js and a variety of other packages to manage tasks such as sending emails and scheduling.

## Features

- Sending notifications via email using `nodemailer`.
- Task scheduling with `node-cron`.
- User IP address tracking with `user-ip`.

## Getting Started

To get the service running on your local machine, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/nil2022/notification_service.git
   ```
2. Install the dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and populate it with your environment variables.

4. Start the service:
   ```
   npm start
   ```

For development, you can use the following command to start the server with `nodemon` for auto-reloading:
```
npm run dev
```

## Dependencies

- `express`: For creating the HTTP server.
- `mongoose`: For database management with MongoDB.
- `node-cron`: For scheduling tasks.
- `nodemailer`: For sending emails.
- `dotenv`: For managing environment variables.
- `user-ip`: For capturing the IP address of users.
- `helmet`: For setting security headers.
- `express-rate-limit`: For rate limiting requests.
- `morgan`: For logging requests.

## Author

Nilanjan Haldar

## Contributing

Please feel free to submit issues or pull requests to the repository.

## Bugs

If you encounter any bugs, please file them [here](https://github.com/nil2022/notification_service/issues).

## Repository

This service is hosted on GitHub. You can access the repository [here](https://github.com/nil2022/notification_service).
