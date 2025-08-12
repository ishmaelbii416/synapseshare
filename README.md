# SynapseShare

*Paste, Share, and Summarize with AI.*

SynapseShare is a modern, feature-rich pastebin application designed for developers, writers, and anyone who needs to quickly share text or code snippets. With a sleek, themeable interface and powerful AI capabilities, it's more than just a paste tool—it's a productivity enhancer.

![SynapseShare Screenshot](https://placehold.co/800x450.png)

## Core Features

-   **Instant Pasting:** Seamlessly paste large blocks of text or code.
-   **AI Summarization:** Leverage Google's Gemini AI to generate concise summaries of long text.
-   **Secure Sharing:** Generate unique, short URLs for your pastes.
-   **QR Code Generation:** Instantly create a QR code for your shareable link for easy mobile access.
-   **Configurable Auto-Deletion:** Set pastes to expire after a specific time (10 minutes, 1 hour, 1 day, 1 week) or never.
-   **One-Click Copy:** Easily copy shared links to your clipboard.
-   **Multiple Themes:** Switch between Light, Dark, and a Hacker-inspired "Matrix" theme.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
-   **AI:** [Google AI - Genkit](https://firebase.google.com/docs/genkit)
-   **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore)
-   **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [Firebase Project](https://console.firebase.google.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ishmaelbii416/synapseshare.git
    cd synapseshare
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    -   Create a new Firebase Web App in your Firebase project console.
    -   Copy the `firebaseConfig` object.
    -   Create a `.env` file in the root of your project.
    -   Add your Firebase configuration values to the `.env` file. You can use the `.env.example` file as a template.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application should now be running at [http://localhost:9002](http://localhost:9002).

## Deployment

This application is configured for easy deployment with **Firebase App Hosting**.

1.  **Install the Firebase CLI:**
    If you haven't already, install the Firebase CLI globally:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Log in to Firebase:**
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project:**
    (If you haven't already done so)
    ```bash
    firebase init
    ```
    Follow the prompts, making sure to select your existing Firebase project.

4.  **Deploy the application:**
    ```bash
    firebase deploy
    ```

    The CLI will build your Next.js application and deploy it. Once finished, it will provide you with a public URL where your application is live.
