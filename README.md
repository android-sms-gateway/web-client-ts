# SMS Gateway for Android™ Web Client

## Description

This is a demonstration app that utilizes the [SMS Gateway for Android™](https://sms.capcom.me/) to create an SMS management web interface. It leverages webhooks to display received SMS messages in real-time and provides the capability to send SMS messages.

## Features

- Connect to any account registered on the Cloud/Private server.
- Real-time receipt of SMS messages.
- Capability to send SMS messages.

## Privacy

The application does not store credentials anywhere, except in the session memory, which is cleared upon logout. Received and sent SMS messages are not stored at all for now.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate into the project directory:
    ```bash
    cd web-client-ts
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```

### Configuration

To configure the application, create a `.env` file in the project root directory. This file should contain your environment variables, which include:

- `HTTP__PORT` or `PORT`: Specifies the port on which the server listens.
- `HTTP__SESSION_SECRET`: A secret key for session encryption.
- `GATEWAY__URL`: The URL of the gateway API.
- `GATEWAY__WEBHOOK_URL`: The external address of the server, appended with `/api/webhooks`, to receive webhooks.
- `NODE_ENV`: Set to `development` to enable development mode.

For more detailed information on the configuration options, please refer to `src/config.ts`.

### Running the Project

- To run in development mode:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

- To build the project:
    ```bash
    npm run build
    ```
    or
    ```bash
    yarn build
    ```

- To start the server:
    ```bash
    npm start
    ```
    or
    ```bash
    yarn start
    ```

## Usage

After starting the server, navigate to `http://localhost:<your-configured-port>` to view the application.

## Technical details

This app uses socket.io for real-time communication.

### Events sequence

Client always listens to events `login:success` and `login:fail`. The first one indicates that client successfully logged in by previously sending `login` event or saved in session credentials. The second one indicates that login attempt failed, current credentials can't be used anymore or session expired.

Typical sequences:

1. Client sends `login` event with credentials to login.
2. Server responds with `login:success` or `login:fail` event.
3. Client sends `sms:send` event with message to send new message. Server sends acknowledgement with success or failure.
4. Server sends `sms:received` event with newly received message.
5. Client sends `logout` event to destroy session.

### Client emmited events

- `login` with `{login: string, password: string}` payload - login attempt. Server responds by `login:success` or `login:fail` event.
- `sms:send` with `{phoneNumber: string, message: string}` payload - send SMS message. Server uses acknowledgement to respond with payload `{success: boolean, message?: string}`.
- `logout` - destroy session, server responds by `login:fail` event.

### Server emmited events

- `sms:received` with `{phoneNumber: string, message: string, receivedAt: Date}` payload - received SMS message. The client should add received message to the list.
- `login:success` - login successful. The client should move from login screen to messaging screen.
- `login:fail` - login failed. The client should move to login screen if it is not already there.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the Apache-2.0 License - see the `LICENSE` file for details.