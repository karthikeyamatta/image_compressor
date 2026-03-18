# GitHub Pages Deployment Guide

This repository is optimized for **GitHub Pages**. Since the UPF engine runs entirely in the browser via WebAssembly, you can host this site for free without any backend server.

## Steps to Deploy

1.  **Push to GitHub**:
    Ensure all your local changes are committed and pushed to your GitHub repository.
    ```bash
    git add .
    git commit -m "Prepare for static hosting"
    git push origin main
    ```

2.  **Enable GitHub Pages**:
    - Go to your repository on GitHub.
    - Click on **Settings** (top tab).
    - In the left sidebar, click **Pages**.
    - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
    - Select your branch (e.g., `main`) and the folder (e.g., `/(root)`).
    - Click **Save**.

3.  **Wait for Deployment**:
    GitHub will take a minute to build and deploy your site. Once complete, you'll see a link like `https://your-username.github.io/your-repo-name/`.

4.  **Verification**:
    Visit the URL and try dragging an image into the "Testbed" or "Export" tools. Open your browser's **Network Tab** (F12) to verify that no images are being sent to any API—everything is happening locally!

## Security Note

The site includes a **Content Security Policy (CSP)** to prevent cross-site scripting (XSS) and ensure that only trusted scripts are executed. This is a best practice for privacy-focused tools.
