import init, { encode_image_locally, decode_upf_to_rgba } from './pkg/upf_wasm_encoder.min.js';

async function processUserUpload(file, fileName) {
    // 1. Boot the Rust Engine
    await init();

    // 2. Read the user's JPEG/PNG into a temporary browser image
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    // 3. Use an offscreen canvas to avoid touching the DOM on the main thread
    const offscreenCanvas = new OffscreenCanvas(width, height);
    const ctx = offscreenCanvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);

    // Get the massive raw RGBA array
    const rawImageData = ctx.getImageData(0, 0, width, height).data;

    // 4. EXECUTE BARE-METAL COMPRESSION (The Wasm Call)
    const upfBinary = encode_image_locally(rawImageData, width, height);

    // 5. Decode and Trigger Export
    const finalName = fileName || file.name || 'image.jpg';
    return await triggerExport(upfBinary, finalName);
}

async function triggerExport(upfBinary, originalFilename) {
    // 1. Get the pixel data from the UPF binary
    const rgbaPixels = decode_upf_to_rgba(upfBinary);
    if (!rgbaPixels || rgbaPixels.length === 0) {
        throw new Error("Decoding failed.");
    }

    // 2. Read dimensions from the header (first 8 bytes for w/h)
    const view = new DataView(upfBinary.buffer, upfBinary.byteOffset, upfBinary.byteLength);
    const width = view.getUint32(0, true);
    const height = view.getUint32(4, true);

    // 3. Paint to a temporary offscreen canvas to generate the blob
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(new Uint8ClampedArray(rgbaPixels), width, height);
    ctx.putImageData(imageData, 0, 0);

    // 4. Generate the export blob
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.90 });
    const blobUrl = URL.createObjectURL(blob);
    const baseName = originalFilename.substring(0, originalFilename.lastIndexOf('.')) || originalFilename;
    const finalFilename = `${baseName}_optimized.jpg`;

    console.log(`Blob generated: ${blob.size} bytes`);
    
    if (window.onExportComplete) {
        window.onExportComplete(blob.size, blobUrl, finalFilename);
    }
    
    return { size: blob.size, url: blobUrl, filename: finalFilename };
}

window.processUserUpload = processUserUpload;
