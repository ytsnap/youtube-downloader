// DOM Elements
const languageButton = document.getElementById('languageButton');
const languageDropdown = document.getElementById('languageDropdown');
const urlInput = document.getElementById('urlInput');
const pasteButton = document.getElementById('pasteButton');
const downloadButton = document.getElementById('downloadButton');
const previewContainer = document.getElementById('previewContainer');
const faqButtons = document.querySelectorAll('.faq-button');

// Language handling
let currentLanguage = 'en';
const translations = {
    en: {
        paste: 'Paste YouTube URL',
        download: 'Download',
        error: 'Error',
        success: 'Success',
        invalidUrl: 'Please enter a valid YouTube URL',
        processing: 'Processing...',
        copied: 'URL copied to clipboard'
    },
    es: {
        paste: 'Pegar URL de YouTube',
        download: 'Descargar',
        error: 'Error',
        success: 'Éxito',
        invalidUrl: 'Ingrese una URL válida de YouTube',
        processing: 'Procesando...',
        copied: 'URL copiada al portapapeles'
    },
    zh: {
        paste: '粘贴 YouTube 网址',
        download: '下载',
        error: '错误',
        success: '成功',
        invalidUrl: '请输入有效的 YouTube 网址',
        processing: '处理中...',
        copied: '网址已复制到剪贴板'
    },
    hi: {
        paste: 'YouTube URL पेस्ट करें',
        download: 'डाउनलोड',
        error: 'त्रुटि',
        success: 'सफलता',
        invalidUrl: 'कृपया एक मान्य YouTube URL दर्ज करें',
        processing: 'प्रसंस्करण...',
        copied: 'URL क्लिपबोर्ड पर कॉपी किया गया'
    }
};

// Enhanced URL validation
function isValidYouTubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
}

// Toast notification with enhanced styling
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            ${type === 'error' 
                ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>'
                : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>'}
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Enhanced preview functionality with error handling
async function showPreview(url) {
    try {
        const videoId = getVideoId(url);
        if (!videoId) {
            throw new Error('Invalid video ID');
        }

        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const previewContainer = document.getElementById('previewContainer');
        
        if (!previewContainer) {
            throw new Error('Preview container not found');
        }

        previewContainer.innerHTML = `
            <div class="aspect-video relative rounded-lg overflow-hidden mb-4 hover-scale">
                <img src="${thumbnailUrl}" alt="Video thumbnail" class="w-full h-full object-cover">
            </div>
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <div class="space-y-1">
                        <h3 class="text-lg font-semibold">Download Options</h3>
                        <p class="text-sm text-gray-500">Select your preferred quality</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button class="px-4 py-2 border rounded hover:bg-gray-50 transition-colors button-pulse" data-quality="1080">1080p MP4</button>
                    <button class="px-4 py-2 border rounded hover:bg-gray-50 transition-colors" data-quality="720">720p MP4</button>
                    <button class="px-4 py-2 border rounded hover:bg-gray-50 transition-colors" data-quality="360">360p MP4</button>
                </div>
            </div>
        `;
        
        previewContainer.classList.remove('hidden');
        previewContainer.classList.add('fade-in');

        // Add event listeners to quality buttons
        const qualityButtons = previewContainer.querySelectorAll('button[data-quality]');
        qualityButtons.forEach(button => {
            button.addEventListener('click', () => {
                const quality = button.getAttribute('data-quality');
                downloadVideo(url, quality);
            });
        });
    } catch (error) {
        handleError(error);
    }
}

// Add download functionality
async function downloadVideo(url, quality) {
    try {
        const downloadButton = document.getElementById('downloadButton');
        downloadButton.textContent = translations[currentLanguage].processing;
        downloadButton.disabled = true;

        // Simulate download process (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showToast(translations[currentLanguage].success, 'success');
    } catch (error) {
        handleError(error);
    } finally {
        const downloadButton = document.getElementById('downloadButton');
        downloadButton.textContent = translations[currentLanguage].download;
        downloadButton.disabled = false;
    }
}

// Enhanced error handling
function handleError(error) {
    console.error('Error:', error);
    showToast(translations[currentLanguage].error, 'error');
}

// Enhanced video ID extraction
function getVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

// Event Listeners
languageButton.addEventListener('click', () => {
    languageDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!languageButton.contains(e.target) && !languageDropdown.contains(e.target)) {
        languageDropdown.classList.add('hidden');
    }
});

languageDropdown.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-lang')) {
        const lang = e.target.getAttribute('data-lang');
        changeLanguage(lang);
        languageDropdown.classList.add('hidden');
    }
});

pasteButton.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        urlInput.value = text;
        showToast(translations[currentLanguage].copied, 'success');
    } catch (err) {
        showToast(translations[currentLanguage].error, 'error');
    }
});

downloadButton.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        showToast(translations[currentLanguage].invalidUrl, 'error');
        return;
    }

    if (!isValidYouTubeUrl(url)) {
        showToast(translations[currentLanguage].invalidUrl, 'error');
        return;
    }

    try {
        downloadButton.textContent = translations[currentLanguage].processing;
        downloadButton.disabled = true;
        
        showPreview(url);
        showToast(translations[currentLanguage].success, 'success');
    } catch (error) {
        showToast(translations[currentLanguage].error, 'error');
    } finally {
        downloadButton.textContent = translations[currentLanguage].download;
        downloadButton.disabled = false;
    }
});

// FAQ functionality
faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        button.classList.toggle('active');
        content.classList.toggle('hidden');
    });
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language
    changeLanguage('en');

    // Initialize FAQ accordions
    const faqButtons = document.querySelectorAll('.faq-button');
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            button.classList.toggle('active');
            content.classList.toggle('hidden');
        });
    });
});

// Initialize language
function changeLanguage(lang) {
    currentLanguage = lang;
    urlInput.placeholder = translations[lang].paste;
    downloadButton.textContent = translations[lang].download;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + V to paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        pasteButton.click();
    }
    // Enter to download
    if (e.key === 'Enter' && document.activeElement === urlInput) {
        downloadButton.click();
    }
});
