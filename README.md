<!-- PROJECT SHIELDS -->
[![License][license-shield]][license-url]

<a id="readme-top"></a>

<div align="center">
  <h1 align="center">SMS Gateway for Android™ (SMSGate) Web Client</h1>
  <p align="center">
    A demonstration app that utilizes the <a href="https://sms-gate.app/">SMS Gateway for Android</a> to create an SMS management web interface
    <br />
    <a href="https://github.com/android-sms-gateway/web-client-ts"><strong>Explore the source »</strong></a>
    <br />
    <br />
    <a href="https://github.com/android-sms-gateway/web-client-ts/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/android-sms-gateway/web-client-ts/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
- [🌐 About The Project](#-about-the-project)
  - [Key Features](#key-features)
  - [Built With](#built-with)
- [🚀 Getting Started](#-getting-started)
  - [📋 Prerequisites](#-prerequisites)
  - [📦 Installation](#-installation)
  - [⚙️ Configuration](#️-configuration)
- [💻 Usage](#-usage)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)
  - [Production Start](#production-start)
- [⚙️ Technical Implementation](#️-technical-implementation)
  - [Event Sequence](#event-sequence)
  - [Client Events](#client-events)
  - [Server Events](#server-events)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)


<!-- ABOUT THE PROJECT -->
## 🌐 About The Project

This web client serves as the frontend component of the SMS Gateway for Android ecosystem, providing a user-friendly interface for managing SMS communications through the SMS Gateway for Android app. It connects to both cloud and private server deployments, enabling real-time SMS management capabilities.

### Key Features

- 🌐 Connect to any account registered on Cloud/Private server
- 📩 Real-time receipt of SMS messages
- 📤 Capability to send SMS messages
- 🔒 Session-based authentication with no persistent credential storage

The application follows strict privacy practices - credentials are stored only in session memory (cleared upon logout) and SMS messages are not stored persistently.

### Built With

- 🟩 [Node.js](https://nodejs.org/)
- 📦 [npm/yarn](https://www.npmjs.com/)
- ⚡ [Socket.IO](https://socket.io/)
- 📘 [TypeScript](https://www.typescriptlang.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v18+)
- npm or yarn package manager

### 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/android-sms-gateway/web-client-ts.git
   ```
2. Navigate to the web client directory:
   ```bash
   cd web-client-ts
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or with yarn:
   ```bash
   yarn install
   ```

### ⚙️ Configuration

Create a `.env` file in the project root with the following environment variables (see [.env.example](.env.example) for a ready-to-copy template):

| Variable               | Description                                               | Default Value                                          |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------ |
| `HTTP__PORT` or `PORT` | Server listening port                                     | `3000`                                                 |
| `HTTP__SESSION_SECRET` | Session encryption secret                                 | random bytes (32 bytes)                                |
| `GATEWAY__URL`         | SMS Gateway API URL                                       | `https://api.sms-gate.app/3rdparty/v1`                 |
| `GATEWAY__WEBHOOK_URL` | External address for webhooks (`<your-url>/api/webhooks`) | `http://localhost:<your-configured-port>/api/webhooks` |
| `NODE_ENV`             | Application environment (development or production)       | `production`                                           |

For complete configuration options, see [`src/config.ts`](src/config.ts).

Notes:  
- Do not commit your `.env` file to version control.
- Always set a strong, unique `HTTP__SESSION_SECRET` in production (rotate it periodically). If not provided, the app may auto-generate one for development only.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## 💻 Usage

After starting the server, navigate to `http://localhost:<your-configured-port>` to access the web interface.

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Production Start
```bash
npm start
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TECHNICAL IMPLEMENTATION -->
## ⚙️ Technical Implementation

The application uses Socket.IO for real-time communication between client and server. All communication follows a strict event-based protocol.

### Event Sequence
1. Client sends `login` with credentials
2. Server responds with `login:success` or `login:fail`
3. Client sends `sms:send` to send messages
4. Server sends `sms:received` for incoming messages
5. Client sends `logout` to terminate session

### Client Events
- `login` - Authentication attempt
- `sms:send` - Send SMS message
- `logout` - Terminate session

### Server Events
- `sms:received` - Incoming SMS notification
- `login:success` - Successful authentication
- `login:fail` - Authentication failure

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## 📄 License

Distributed under the Apache-2.0 License. See [`LICENSE`](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/github/license/android-sms-gateway/web-client-ts.svg?style=for-the-badge
[license-url]: LICENSE