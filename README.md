# ✨ UPF Image Compressor

> **Privacy-First, Client-Side Batch Image Optimization Powered by Rust & WebAssembly.**

[![WASM](https://img.shields.io/badge/Powered%20by-WebAssembly-6366f1?style=for-the-badge&logo=webassembly)](https://webassembly.org/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-10b981?style=for-the-badge)](https://github.com/karthikeyamatta/image_compressor)
[![Batch](https://img.shields.io/badge/Batch-Processing-orange?style=for-the-badge)](#features)

UPF Image Compressor is a high-performance, browser-based utility designed for photographers and web developers who demand both quality and privacy. Unlike traditional compressors, your images **never leave your device**. Everything happens in your browser using a high-efficiency Rust-based compression engine.

---

## 🚀 Key Features

- **🛡️ 100% Private**: All processing is done locally via WebAssembly. No servers, no tracking, no data leaks.
- **📦 Batch Processing**: Optimize up to 20 images simultaneously with a non-blocking asynchronous queue.
- **⚡ High Performance**: Powered by a custom Rust Quad-Tree compression algorithm for optimal size-to-quality ratio.
- **🔄 HEIC Support**: Seamlessly convert and compress Apple's HEIC/HEIF files directly to JPEG.
- **🗜️ ZIP Export**: Download all your optimized images in a single, convenient ZIP archive.
- **💎 Premium UI**: A modern, glassmorphic interface with fluid animations and responsive design.

---

## 🛠️ Technology Stack

- **Core**: JavaScript (Vanilla ES6+)
- **Engine**: Rust compiled to **WebAssembly (WASM)**
- **Image Handling**: `OffscreenCanvas` & `createImageBitmap` for high-performance, non-blocking UI.
- **Compatibility**: `heic-to` for native browser HEIC support.
- **Archiving**: `JSZip` for on-the-fly ZIP generation.

---

## 📖 How to Use

1. **Upload**: Drag and drop your images (JPG, PNG, WebP, HEIC) or click to browse.
2. **Process**: The app will automatically begin compressing using the WASM engine. Monitor progress in real-time.
3. **Download**: Either download images individually or click **"DOWNLOAD ALL AS ZIP"** to save the entire batch.

---

## 💻 Local Development

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/karthikeyamatta/image_compressor.git
   ```
2. Navigate to the directory:
   ```bash
   cd image_compressor
   ```
3. Serve the `dist` folder:
   ```bash
   npx serve dist
   ```
4. Open your browser at `http://localhost:3000`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/karthikeyamatta/image_compressor/issues).



---

<p align="center">Made with ❤️ for the Privacy-Conscious Web</p>
