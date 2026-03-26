# Getting Started with EPA Bienestar

This guide will help you set up and run your app.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and add your keys
cp .env.example .env

# Start the development server
npm start
```

## Environment Setup

Copy `.env.example` to `.env` and fill in the required values:

### Medplum Configuration

Your app uses Medplum for cloud storage and authentication.

Check your `.env.example` file for the required configuration values.
Fill in the credentials for your backend service in `.env`.

## Your App Features

Based on your selections, your app includes:

- **Medplum Backend** - Cloud storage with user authentication
- **Scheduler** - Recurring tasks and reminder management
- **Questionnaires** - FHIR-compliant health forms
- **Onboarding** - Welcome flow with consent management

## Running on Devices

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## Project Structure

```
├── app/              # Expo Router screens
│   ├── (tabs)/       # Bottom tab screens
│   ├── (onboarding)/ # Welcome and consent flow
│   └── questionnaire/# Health form screens
├── packages/         # Shared modules
│   └── account/      # User account management
│   └── scheduler/    # Task scheduling
│   └── questionnaire/# FHIR forms
│   └── medplum/     # Medplum integration
├── lib/              # App utilities
└── components/       # Reusable UI components
```

## Learn More

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router](https://expo.github.io/router/docs)
- [React Native](https://reactnative.dev)
