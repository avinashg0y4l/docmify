
# Docmify - All-in-One PDF Tools

A modern, responsive web application for managing PDF files. Built with React, Tailwind CSS, and Node.js.

## Features

*   **Merge PDF**: Combine multiple PDFs into one.
*   **Compress PDF**: Reduce file size with adjustable quality levels.
*   **Split PDF**: Separate pages.
*   **Convert**: PDF to JPG, JPG to PDF, Word to PDF.
*   **Protect**: Add/Remove passwords.

## Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React.
*   **Backend**: Node.js, Express, Multer, PDF-Lib.

## Getting Started

### Prerequisites

*   Node.js (v16+)

### Installation

1.  **Clone the repository**

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create uploads directory automatically on start
    node server.js
    ```
    The backend runs on `http://localhost:5000`.

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The frontend runs on `http://localhost:5173`.

## Deployment

Refer to `DEPLOY.md` for detailed instructions on deploying to Vercel and Render.

## License

MIT
