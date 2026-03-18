import init, { encode_image_locally, decode_upf_to_rgba } from './pkg/upf_wasm_encoder.js';

async function processUserUpload(file, fileName) {
    // 1. Boot the Rust Engine
    await init();

    // 2. Read the user's JPEG/PNG into a temporary browser image
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    // 3. Draw it to a hidden, temporary canvas to extract the raw pixel physics
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    const ctx = offscreenCanvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);

    // Get the massive raw RGBA array
    const rawImageData = ctx.getImageData(0, 0, width, height).data;

    console.log("Passing raw pixels to the UPF Engine...");

    // 4. EXECUTE BARE-METAL COMPRESSION (The Wasm Call)
    const upfBinary = encode_image_locally(rawImageData, width, height);

    console.log(`Compression complete. New size: ${(upfBinary.length / 1024).toFixed(1)} KB`);

    // 5. Decode and Trigger the Trojan Horse Export!
    const finalName = fileName || file.name || 'image.jpg';
    triggerExport(upfBinary, finalName);
}

async function triggerExport(upfBinary, originalFilename) {
    // 1. Get the pixel data from the UPF binary
    const rgbaPixels = decode_upf_to_rgba(upfBinary);
    if (!rgbaPixels || rgbaPixels.length === 0) {
        console.error("Decoding failed.");
        return;
    }

    // 2. Read dimensions from the header (first 8 bytes for w/h)
    const view = new DataView(upfBinary.buffer, upfBinary.byteOffset, upfBinary.byteLength);
    const width = view.getUint32(0, true);
    const height = view.getUint32(4, true);

    // 3. Paint to the UI canvas or a new one
    const canvas = document.getElementById('export-canvas') || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Create ImageData from raw pixels
    const imageData = new ImageData(new Uint8ClampedArray(rgbaPixels), width, height);
    ctx.putImageData(imageData, 0, 0);

    // 4. Generate the export blob but DON'T auto-download
    canvas.toBlob((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const baseName = originalFilename.substring(0, originalFilename.lastIndexOf('.')) || originalFilename;
        const finalFilename = `${baseName}_optimized.jpg`;

        if (window.onExportComplete) {
            window.onExportComplete(blob.size, blobUrl, finalFilename);
        }
    }, 'image/jpeg', 0.90);
}

window.processUserUpload = processUserUpload;