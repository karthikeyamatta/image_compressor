// Import your compiled WebAssembly engine
import init, { decode_upf_to_rgba } from './pkg/upf_wasm_decoder.js';

// Global state to ensure we only boot up the Rust engine once, 
// even if there are 100 <upf-img> tags on the page.
let wasmInitialized = false;
let wasmPromise = null;

async function bootEngine() {
    if (!wasmInitialized) {
        if (!wasmPromise) {
            wasmPromise = init();
        }
        await wasmPromise;
        wasmInitialized = true;
    }
}

// Define the Custom HTML Element
class UpfImage extends HTMLElement {
    static get observedAttributes() {
        return ['src'];
    }

    constructor() {
        super();
        // Attach a Shadow DOM so the internal canvas doesn't conflict with site CSS
        this.attachShadow({ mode: 'open' });
        
        // Create the internal canvas once
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.height = 'auto';
        this.shadowRoot.appendChild(this.canvas);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src' && oldValue !== newValue) {
            this.render();
        }
    }

    async connectedCallback() {
        // Render if src is already present
        if (this.getAttribute('src')) {
            this.render();
        }
    }

    async render() {
        const src = this.getAttribute('src');
        if (!src) return;

        try {
            // 1. Ensure the Rust math engine is running
            await bootEngine();

            // 2. Fetch your compressed binary payload
            const response = await fetch(src);
            const buffer = await response.arrayBuffer();
            const compressedBytes = new Uint8Array(buffer);

            // 3. Parse the C-Header for dimensions (The First 16 Bytes)
            const headerView = new Uint32Array(buffer.slice(0, 16));
            const trueWidth = headerView[0];
            const trueHeight = headerView[1];

            // 4. Size the canvas perfectly
            this.canvas.width = trueWidth;
            this.canvas.height = trueHeight;

            // 5. Execute the Bare-Metal Math!
            const rawRgbaArray = decode_upf_to_rgba(compressedBytes);

            // 6. Paint the Pixels directly to the monitor
            const ctx = this.canvas.getContext('2d');
            const imageData = new ImageData(
                new Uint8ClampedArray(rawRgbaArray),
                trueWidth,
                trueHeight
            );
            ctx.putImageData(imageData, 0, 0);

        } catch (error) {
            console.error(`UPF Engine Error rendering ${src}:`, error);
        }
    }
}

// Register the tag with the browser's HTML parser
customElements.define('upf-img', UpfImage);