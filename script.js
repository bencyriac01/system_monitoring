const particleField = document.getElementById('particles');

function createParticles() {
    const count = 24;
    for (let i = 0; i < count; i += 1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = 4 + Math.random() * 14;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = `${0.18 + Math.random() * 0.65}`;
        particle.style.animationDuration = `${10 + Math.random() * 12}s`;
        particle.style.animationDelay = `${-Math.random() * 16}s`;
        particleField.appendChild(particle);
    }
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function detectArchitecture() {
    const ua = navigator.userAgent;
    if (/x86_64|Win64|x64/i.test(ua)) return 'x64';
    if (/arm64|aarch64/i.test(ua)) return 'ARM64';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ARM';
    if (/Android/i.test(ua)) return 'ARM';
    return 'Unknown';
}

async function resolveGpuInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        return {
            name: 'Unavailable',
            manufacturer: 'Unavailable',
            driverVersion: 'Unavailable',
            opengl: 'Unavailable',
        };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER);
    const vendor = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : gl.getParameter(gl.VENDOR);
    const version = gl.getParameter(gl.VERSION);
    const shadingLang = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);

    return {
        name: renderer || 'Unavailable',
        manufacturer: vendor || 'Unavailable',
        driverVersion: version || 'Unavailable',
        opengl: shadingLang || 'Unavailable',
    };
}

function detectOS() {
    const ua = navigator.userAgent;
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac OS X/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua)) return 'Linux';
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    return 'Unknown';
}

function detectOSVersion(osName) {
    const ua = navigator.userAgent;
    if (osName === 'Windows') {
        const match = ua.match(/Windows NT ([0-9.]+)/);
        return match ? `NT ${match[1]}` : 'Unknown';
    }
    if (osName === 'macOS') {
        const match = ua.match(/Mac OS X ([0-9_]+)/);
        return match ? match[1].replace(/_/g, '.') : 'Unknown';
    }
    if (osName === 'Android') {
        const match = ua.match(/Android ([0-9.]+)/);
        return match ? match[1] : 'Unknown';
    }
    if (osName === 'iOS') {
        const match = ua.match(/OS ([0-9_]+)/);
        return match ? match[1].replace(/_/g, '.') : 'Unknown';
    }
    return 'Unknown';
}

async function updateMetrics() {
    const hardwareConcurrency = navigator.hardwareConcurrency || 0;
    const cpuArch = detectArchitecture();
    const osName = detectOS();
    const osVersion = detectOSVersion(osName);
    const platform = navigator.platform || 'Unknown';

    setText('cpu-platform', platform);
    setText('cpu-architecture', cpuArch);
    setText('cpu-logical', hardwareConcurrency ? `${hardwareConcurrency}` : 'Unknown');

    const gpu = await resolveGpuInfo();
    setText('gpu-name', gpu.name);
    setText('gpu-manufacturer', gpu.manufacturer);
    setText('gpu-driver', gpu.driverVersion);
    setText('gpu-opengl', gpu.opengl);

    const cpuSummary = `${platform} • ${cpuArch} • ${hardwareConcurrency} cores`;
    const gpuSummary = gpu.name !== 'Unavailable' ? gpu.name : 'Unavailable';
    const memorySummary = navigator.deviceMemory ? `${navigator.deviceMemory} GB installed` : 'Unknown';
    const osSummary = `${osName} ${osVersion}`;

    setText('summary-cpu', cpuSummary);
    setText('summary-gpu', gpuSummary);
    setText('summary-memory', memorySummary);
    setText('summary-os', osSummary);

    setText('ram-installed', navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown');

    setText('os-name', osName);
    setText('os-version', osVersion);
    setText('os-arch', cpuArch);
}

createParticles();
updateMetrics();
setInterval(updateMetrics, 10000);
