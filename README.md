# 📸 ProShot AI - Professional Headshot Generator

<div align="center">
  <img src="./public/preview.png" alt="ProShot AI Application Preview" width="800" style="border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
  
  <p><em>Transform casual selfies into professional studio-quality headshots in seconds using Google's Gemini 2.5 Flash Image Model.</em></p>
</div>

## 🚀 Overview

**ProShot AI** is a modern web application that leverages generative AI to create professional headshots from ordinary photos. Users can upload a casual selfie, select a style (Corporate, Creative, Tech Startup, etc.), and receive a high-definition, studio-quality image with optimized lighting, clothing, and background.

It features an intuitive 3-step wizard interface and an AI-powered editing suite to refine results using natural language commands.

## ✨ Features

-   **AI-Powered Transformation**: Instantly upgrade lighting, background, and attire while preserving facial likeness.
-   **Style Selection**: Choose from curated styles like *Corporate Executive*, *Modern Minimalist*, *Warm & Friendly*, and more.
-   **Smart Editing**: Use the built-in chat interface to refine the result (e.g., "Make the background darker", "Add a blue tie").
-   **Privacy Focused**: Client-side image resizing ensures fast uploads and minimal data transfer.
-   **Responsive Design**: A premium, mobile-friendly UI built with Tailwind CSS.

## 🛠️ Tech Stack

-   **Frontend**: React 19, TypeScript, Vite
-   **Styling**: Tailwind CSS, Lucide React (Icons)
-   **AI Model**: Google Gemini 2.5 Flash Image (via `@google/genai` SDK)
-   **State Management**: React Hooks
-   **Build Tool**: Vite

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/proshot-ai-web.git
    cd proshot-ai-web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
    > **Note**: You can get a free API key from [Google AI Studio](https://aistudio.google.com/).

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Build for production**:
    ```bash
    npm run build
    ```

## 🖼️ Adding a Preview Image

To update the preview image in this README:
1.  Run the app (`npm run dev`).
2.  Take a screenshot of the interface.
3.  Save it as `preview.png` in the `public` folder.
4.  Push the changes.

---

<p align="center">
  Built with love from <a href="https://starteder.com">StarterDev</a>
</p>
