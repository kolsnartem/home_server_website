// Визначення пристрою
function detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|android|mobile/.test(ua);
    const isIPhone = /iphone/.test(ua);
    const container = document.getElementById('main-container');

    if (isIPhone) {
        container.classList.add('iphone');
        document.body.classList.add('iphone-body');
    } else if (isMobile) {
        container.classList.add('mobile');
    } else {
        container.classList.add('desktop');
    }
    adjustHeight();
}

// Адаптація висоти
function adjustHeight() {
    const container = document.getElementById('main-container');
    const body = document.body;
    const contentHeight = container.scrollHeight;

    if (contentHeight <= window.innerHeight) {
        body.style.height = '100vh';
        body.style.overflowY = 'hidden';
    } else {
        body.style.height = 'auto';
        body.style.overflowY = 'auto';
    }
}

// Збереження історії
function saveToHistory(fileName, vlcLink) {
    let history = JSON.parse(localStorage.getItem('fileHistory')) || [];
    const timestamp = new Date().toLocaleString('uk-UA', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const entry = { name: fileName, link: vlcLink, timestamp };

    history = history.filter(item => item.link !== vlcLink);
    history.unshift(entry);
    if (history.length > 10) history.pop();

    localStorage.setItem('fileHistory', JSON.stringify(history));
}

// Відображення історії на головній сторінці
function loadLastViewed() {
    const history = JSON.parse(localStorage.getItem('fileHistory')) || [];
    const lastViewedList = document.getElementById('last-viewed-list');
    const noHistoryMessage = document.getElementById('no-history-message');
    const lastViewedSection = document.getElementById('last-viewed');
    lastViewedList.innerHTML = '';

    if (history.length === 0) {
        noHistoryMessage.style.display = 'block';
        lastViewedSection.classList.add('d-none');
    } else {
        noHistoryMessage.style.display = 'none';
        lastViewedSection.classList.remove('d-none');
        history.forEach(item => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item d-flex align-items-center justify-content-between mb-2 p-2';

            const fileLink = document.createElement('a');
            fileLink.innerText = item.name;
            fileLink.href = item.link;
            fileLink.className = 'text-truncate flex-grow-1 me-2';
            fileLink.addEventListener('click', () => saveToHistory(item.name, item.link));

            const timestamp = document.createElement('span');
            timestamp.innerText = item.timestamp;
            timestamp.className = 'text-muted small ms-2';

            const iconButton = document.createElement('button');
            iconButton.className = 'icon-button btn btn-sm p-1';
            iconButton.setAttribute('data-clipboard-text', item.link.replace('vlc://', ''));

            const linkIcon = document.createElement('img');
            linkIcon.src = 'http://192.168.31.185/media1/web/images/icon.png';
            linkIcon.alt = 'Copy link';
            linkIcon.className = 'link-icon';

            const checkIcon = document.createElement('img');
            checkIcon.src = 'http://192.168.31.185/media1/web/images/check.png';
            checkIcon.alt = 'Copied';
            checkIcon.className = 'check-icon d-none';

            iconButton.appendChild(linkIcon);
            iconButton.appendChild(checkIcon);

            iconButton.addEventListener('click', function() {
                linkIcon.classList.add('d-none');
                checkIcon.classList.remove('d-none');
                setTimeout(() => {
                    checkIcon.style.opacity = '0';
                    setTimeout(() => {
                        checkIcon.classList.add('d-none');
                        linkIcon.classList.remove('d-none');
                        linkIcon.style.opacity = '0';
                        setTimeout(() => {
                            linkIcon.style.opacity = '1';
                        }, 50);
                    }, 300);
                }, 1000);
            });

            fileItem.appendChild(fileLink);
            fileItem.appendChild(timestamp);
            fileItem.appendChild(iconButton);
            lastViewedList.appendChild(fileItem);
        });

        new ClipboardJS('.icon-button');
    }
    adjustHeight();
}

// Відображення історії на сторінці History
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('fileHistory')) || [];
    fileList.innerHTML = '';

    if (history.length === 0) {
        noFilesMessage.textContent = 'No recent files';
        noFilesMessage.style.display = 'block';
    } else {
        noFilesMessage.style.display = 'none';
        history.forEach(item => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item d-flex align-items-center justify-content-between mb-2 p-2';

            const fileLink = document.createElement('a');
            fileLink.innerText = item.name;
            fileLink.href = item.link;
            fileLink.className = 'text-truncate flex-grow-1 me-2';
            fileLink.addEventListener('click', () => saveToHistory(item.name, item.link));

            const timestamp = document.createElement('span');
            timestamp.innerText = item.timestamp;
            timestamp.className = 'text-muted small ms-2';

            const iconButton = document.createElement('button');
            iconButton.className = 'icon-button btn btn-sm p-1';
            iconButton.setAttribute('data-clipboard-text', item.link.replace('vlc://', ''));

            const linkIcon = document.createElement('img');
            linkIcon.src = 'http://192.168.31.185/media1/web/images/icon.png';
            linkIcon.alt = 'Copy link';
            linkIcon.className = 'link-icon';

            const checkIcon = document.createElement('img');
            checkIcon.src = 'http://192.168.31.185/media1/web/images/check.png';
            checkIcon.alt = 'Copied';
            checkIcon.className = 'check-icon d-none';

            iconButton.appendChild(linkIcon);
            iconButton.appendChild(checkIcon);

            iconButton.addEventListener('click', function() {
                linkIcon.classList.add('d-none');
                checkIcon.classList.remove('d-none');
                setTimeout(() => {
                    checkIcon.style.opacity = '0';
                    setTimeout(() => {
                        checkIcon.classList.add('d-none');
                        linkIcon.classList.remove('d-none');
                        linkIcon.style.opacity = '0';
                        setTimeout(() => {
                            linkIcon.style.opacity = '1';
                        }, 50);
                    }, 300);
                }, 1000);
            });

            fileItem.appendChild(fileLink);
            fileItem.appendChild(timestamp);
            fileItem.appendChild(iconButton);
            fileList.appendChild(fileItem);
        });

        new ClipboardJS('.icon-button');
    }
    backButton.classList.remove('d-none');
    adjustHeight();
}

// Завантаження файлів
function loadFiles(directory, baseUrl = '192.168.31.185') {
    fetch('http://' + baseUrl + directory)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a');
            fileList.innerHTML = '';

            if (links.length <= 1) { // Перевіряємо, чи є щось крім "../"
                noFilesMessage.textContent = 'No files found in ' + directory;
                noFilesMessage.style.display = 'block';
            } else {
                noFilesMessage.style.display = 'none';
                links.forEach((link) => {
                    const href = link.getAttribute('href');
                    const fileName = decodeURIComponent(link.innerText);

                    if (fileName === "../") return;

                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item d-flex align-items-center justify-content-between mb-2 p-2';

                    const fileLink = document.createElement('a');
                    fileLink.innerText = fileName;
                    fileLink.className = 'text-truncate flex-grow-1 me-2';

                    if (href.endsWith('/')) {
                        fileLink.href = directory + href;
                        fileLink.addEventListener('click', function(event) {
                            event.preventDefault();
                            loadFiles(directory + href, baseUrl);
                        });
                    } else {
                        const vlcLink = `vlc://http://${baseUrl}${directory}${href}`;
                        const httpLink = `http://${baseUrl}${directory}${href}`;
                        fileLink.href = vlcLink;
                        fileLink.addEventListener('click', (event) => {
                            event.preventDefault();
                            saveToHistory(fileName, vlcLink);
                            window.location.href = vlcLink;
                        });

                        const iconButton = document.createElement('button');
                        iconButton.className = 'icon-button btn btn-sm p-1';
                        iconButton.setAttribute('data-clipboard-text', httpLink);

                        const linkIcon = document.createElement('img');
                        linkIcon.src = 'http://192.168.31.185/media1/web/images/icon.png';
                        linkIcon.alt = 'Copy link';
                        linkIcon.className = 'link-icon';

                        const checkIcon = document.createElement('img');
                        checkIcon.src = 'http://192.168.31.185/media1/web/images/check.png';
                        checkIcon.alt = 'Copied';
                        checkIcon.className = 'check-icon d-none';

                        iconButton.appendChild(linkIcon);
                        iconButton.appendChild(checkIcon);

                        iconButton.addEventListener('click', function() {
                            linkIcon.classList.add('d-none');
                            checkIcon.classList.remove('d-none');
                            setTimeout(() => {
                                checkIcon.style.opacity = '0';
                                setTimeout(() => {
                                    checkIcon.classList.add('d-none');
                                    linkIcon.classList.remove('d-none');
                                    linkIcon.style.opacity = '0';
                                    setTimeout(() => {
                                        linkIcon.style.opacity = '1';
                                    }, 50);
                                }, 300);
                            }, 1000);
                        });

                        fileItem.appendChild(iconButton);
                    }

                    fileItem.insertBefore(fileLink, fileItem.firstChild);
                    fileList.appendChild(fileItem);
                });

                new ClipboardJS('.icon-button');
            }
            adjustHeight();
        })
        .catch(error => {
            console.error('Error loading files:', error);
            fileList.innerHTML = '';
            noFilesMessage.textContent = 'Error loading files from ' + directory;
            noFilesMessage.style.display = 'block';
            adjustHeight();
        });
}

// Ініціалізація
const fileList = document.getElementById('file-list');
const noFilesMessage = document.getElementById('no-files-message');
const navButtons = document.getElementById('navButtons');
const homeServer = document.getElementById('home-server');
const backButton = document.getElementById('back-button');
const lastViewedSection = document.getElementById('last-viewed');
let navigationStack = [];

detectDevice();
window.addEventListener('resize', adjustHeight);
loadLastViewed();

homeServer.addEventListener('click', function() {
    window.location.reload();
});

// Оновлені кнопки з правильними шляхами
document.getElementById('tv-button').addEventListener('click', function() {
    navButtons.classList.add('d-none');
    fileList.classList.add('active');
    lastViewedSection.classList.add('d-none');
    navigationStack = ['/media1/tv/'];
    loadFiles('/media1/tv/', '192.168.31.185');
    backButton.classList.remove('d-none');
});

document.getElementById('movies-button').addEventListener('click', function() {
    navButtons.classList.add('d-none');
    fileList.classList.add('active');
    lastViewedSection.classList.add('d-none');
    navigationStack = ['/sda1/home/john/media/movies/'];
    loadFiles('/sda1/home/john/media/movies/', '192.168.31.185');
    backButton.classList.remove('d-none');
});

document.getElementById('history-button').addEventListener('click', function() {
    navButtons.classList.add('d-none');
    fileList.classList.add('active');
    lastViewedSection.classList.add('d-none');
    navigationStack = [];
    loadHistory();
    backButton.classList.remove('d-none');
});

backButton.addEventListener('click', function() {
    if (navigationStack.length > 1) {
        navigationStack.pop();
        const previousDirectory = navigationStack[navigationStack.length - 1];
        loadFiles(previousDirectory, '192.168.31.185');
    } else {
        navigationStack = [];
        fileList.innerHTML = '';
        fileList.classList.remove('active');
        navButtons.classList.remove('d-none');
        backButton.classList.add('d-none');
        noFilesMessage.style.display = 'block';
        noFilesMessage.textContent = 'Select a folder to view files';
        lastViewedSection.classList.remove('d-none');
        loadLastViewed();
        adjustHeight();
    }
});

// Оновлення loadFiles для збереження навігації
const originalLoadFiles = loadFiles;
loadFiles = function(directory, baseUrl = '192.168.31.185') {
    if (navigationStack[navigationStack.length - 1] !== directory) {
        navigationStack.push(directory);
    }
    originalLoadFiles(directory, baseUrl);
};

// Запуск анімації після завантаження сторінки
window.addEventListener('load', function() {
    document.getElementById('main-container').classList.add('loaded');
});