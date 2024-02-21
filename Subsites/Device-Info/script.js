// Function to get screen resolution
function getScreenResolution() {
    return window.screen.width + "x" + window.screen.height;
}

// Function to get device type
function getDeviceType() {
    var userAgent = navigator.userAgent;
    if (userAgent.match(/Android/i)) {
        return "Android";
    } else if (userAgent.match(/webOS/i)) {
        return "webOS";
    } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
        return "iOS";
    } else if (userAgent.match(/Windows Phone/i)) {
        return "Windows Phone";
    } else if (userAgent.match(/Windows/i)) {
        return "Windows";
    } else if (userAgent.match(/Macintosh/i)) {
        return "Macintosh";
    } else if (userAgent.match(/Linux/i)) {
        return "Linux";
    } else {
        return "Unknown";
    }
}



// Function to get operating system
function getOperatingSystem() {
    var userAgent = navigator.userAgent;
    var platform = navigator.platform;
    var os;
    if (userAgent.match(/Windows Phone/i) || userAgent.match(/Windows/i)) {
        os = "Windows";
    } else if (userAgent.match(/Android/i)) {
        os = "Android";
    } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
        os = "iOS";
    } else if (userAgent.match(/Macintosh/i)) {
        os = "Mac OS";
    } else if (userAgent.match(/Linux/i)) {
        os = "Linux";
    } else {
        os = "Unknown";
    }
    return os + " " + platform;
}

// Function to get language
function getLanguage() {
    return navigator.language || navigator.userLanguage;
}

// Function to get browser information
function getBrowserInfo() {
    var userAgent = navigator.userAgent;
    var browserInfo = "";
    
    // Check for Chrome
    if (userAgent.match(/Chrome/i)) {
        browserInfo += "Chrome";
    }
    // Check for Firefox
    else if (userAgent.match(/Firefox/i)) {
        browserInfo += "Firefox";
    }
    // Check for Safari
    else if (userAgent.match(/Safari/i)) {
        browserInfo += "Safari";
    }
    // Check for Edge
    else if (userAgent.match(/Edg/i)) {
        browserInfo += "Edge";
    }
    // Check for Internet Explorer
    else if (userAgent.match(/MSIE/i) || !!document.documentMode == true) {
        browserInfo += "Internet Explorer";
    }
    // Default to Unknown
    else {
        browserInfo += "Unknown";
    }
    
    // Add version information if available
    var version = userAgent.match(/(?:Chrome|Firefox|Safari|Edge|Internet Explorer)\/([\d.]+)/);
    if (version && version.length > 1) {
        browserInfo += " " + version[1];
    }
    
    return browserInfo;
}

// Function to get timezone offset
function getTimezoneOffset() {
    return new Date().getTimezoneOffset();
}

// Function to check if cookies are enabled
function areCookiesEnabled() {
    document.cookie = "test_cookie";
    var cookiesEnabled = document.cookie.indexOf("test_cookie") !== -1;
    document.cookie = "test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return cookiesEnabled;
}

// Function to check if JavaScript is enabled
function isJavaScriptEnabled() {
    return true; // JavaScript is always enabled if this code is executed
}

// Function to get device pixel ratio
function getDevicePixelRatio() {
    return window.devicePixelRatio;
}

// Function to check touchscreen support
function hasTouchscreen() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}

// Function to get CPU architecture
function getCPUArchitecture() {
    // This information is not directly available through JavaScript
    return navigator.hardwareConcurrency;
}

// Function to get GPU information
function getGPUInfo() {
    var canvas = document.createElement('canvas');
    var gl;
    var debugInfo;
    var vendor;
    var renderer;

    try {
        gl = canvas.getContext('webgl', { powerPreference: "high-performance" }) || canvas.getContext('experimental-webgl', { powerPreference: "high-performance" });
    } catch (e) {
    }

    if (gl) {
    debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }
    return debugInfo, vendor, renderer;
}

function hasAccelerometer() {
    return 'ondevicemotion' in window;
}

// Function to check gyroscope support
function hasGyroscope() {
    return 'ondeviceorientation' in window;
}

// Function to check proximity sensor support
function hasProximitySensor() {
    return 'ondeviceproximity' in window;
}

// Function to display user info including additional details
function displayUserInfo() {
    document.getElementById("user-agent").textContent = navigator.userAgent;
    document.getElementById("screen-resolution").textContent = getScreenResolution();
    document.getElementById("device-type").textContent = getDeviceType();
    document.getElementById("operating-system").textContent = getOperatingSystem();
    document.getElementById("language").textContent = getLanguage();
    document.getElementById("browser-info").textContent = getBrowserInfo();
    document.getElementById("timezone-offset").textContent = getTimezoneOffset();
    document.getElementById("cookies-enabled").textContent = areCookiesEnabled() ? "Yes" : "No";
    document.getElementById("javascript-enabled").textContent = isJavaScriptEnabled() ? "Yes" : "No";
    document.getElementById("device-pixel-ratio").textContent = getDevicePixelRatio();
    document.getElementById("touchscreen-support").textContent = hasTouchscreen() ? "Yes" : "No";
    document.getElementById("cpu-architecture").textContent = getCPUArchitecture();
    document.getElementById("gpu-info").textContent = getGPUInfo();
    document.getElementById("accelerometer-support").textContent = hasAccelerometer() ? "Yes" : "No";
    document.getElementById("gyroscope-support").textContent = hasGyroscope() ? "Yes" : "No";
    document.getElementById("proximity-sensor-support").textContent = hasProximitySensor() ? "Yes" : "No";
}
// Call displayUserInfo function when the page loads
window.onload = displayUserInfo;

