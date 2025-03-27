//============================= Logger Function =============================//
const Logger = {
    logs: [],
    logLevel: {
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR',
        DEBUG: 'DEBUG'
    },
    
    log: function(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.logs.push(logEntry);
        
        // Format console output
        const formattedMessage = `[${timestamp}] [${level}] ${message}`;
        
        switch(level) {
            case this.logLevel.INFO:
                console.log('%c' + formattedMessage, 'color: #4B70F5', data || '');
                break;
            case this.logLevel.WARN:
                console.warn('%c' + formattedMessage, 'color: #FFA500', data || '');
                break;
            case this.logLevel.ERROR:
                console.error('%c' + formattedMessage, 'color: #FF0000', data || '');
                break;
            case this.logLevel.DEBUG:
                console.debug('%c' + formattedMessage, 'color: #00FFFF', data || '');
                break;
        }
        
        // Store logs in localStorage (limited to last 100 entries)
        if (this.logs.length > 100) {
            this.logs.shift();
        }
        localStorage.setItem('bluemods_logs', JSON.stringify(this.logs));
        
        return logEntry;
    },
    
    info: function(message, data = null) {
        return this.log(this.logLevel.INFO, message, data);
    },
    
    warn: function(message, data = null) {
        return this.log(this.logLevel.WARN, message, data);
    },
    
    error: function(message, data = null) {
        return this.log(this.logLevel.ERROR, message, data);
    },
    
    debug: function(message, data = null) {
        return this.log(this.logLevel.DEBUG, message, data);
    },
    
    clearLogs: function() {
        this.logs = [];
        localStorage.removeItem('bluemods_logs');
    },
    
    getLogs: function() {
        return this.logs;
    },
    
    trackPageView: function(pageName) {
        this.info(`Page viewed: ${pageName}`);
    },
    
    trackEvent: function(category, action, label = null) {
        this.info(`Event: ${category} - ${action}`, label);
    }
};

// Initialize logs from localStorage if available
window.onload = function() {
    try {
        const storedLogs = localStorage.getItem('bluemods_logs');
        if (storedLogs) {
            Logger.logs = JSON.parse(storedLogs);
        }
        
        // Track page view
        const pagePath = window.location.pathname;
        const pageName = pagePath === '/' || pagePath === '/index.html' ? 'Home' : 
            pagePath.replace(/\//g, '').replace('.html', '');
        Logger.trackPageView(pageName);
        
        // Load stored counter
        const storedCounter = localStorage.getItem('visitCounter');
        if (storedCounter) {
            visitCounter = parseInt(storedCounter);
        } else {
            visitCounter = 0;
        }
        updateCounter();
        setInterval(updateCounter, 30000);
    } catch (error) {
        console.error('Error initializing logger:', error);
    }
};

//============================= Loading Screen =============================//
document.documentElement.classList.add('no-scroll'); // Add to <html>
document.body.classList.add('no-scroll'); // Add to <body>

setTimeout(() => {
    document.getElementById('loadingtime').style.display = 'none';
    document.documentElement.classList.remove('no-scroll'); // Remove from <html>
    document.body.classList.remove('no-scroll'); // Remove from <body>
    Logger.info('Page fully loaded');
}, 3000);

const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
    Logger.trackEvent('Navigation', 'Menu Toggle', menuIcon.classList.contains('bx-x') ? 'opened' : 'closed');
}

//============================= scrolling sections active link =============================//
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

let visitCounter = 0;

function updateCounter() {
    visitCounter++;
    const visitCounterElement = document.getElementById('visitCounter');
    if (visitCounterElement) {
        visitCounterElement.textContent = visitCounter;
    }
    localStorage.setItem('visitCounter', visitCounter);
}

window.onload = function () {
    const storedCounter = localStorage.getItem('visitCounter');
    if (storedCounter) {
        visitCounter = parseInt(storedCounter);
    } else {
        visitCounter = 0;
    }
    updateCounter();

    setInterval(updateCounter, 30000);
};

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });

            if (id === 'home') {
                updateCounter();
            }
        }
    });

    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 0);

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

//============================= scroll reveal =============================//
ScrollReveal({
    reset: false,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading, .about-content, .home-document-content', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .headingg', { origin: 'left' });
ScrollReveal().reveal('.home-content p', { origin: 'right' });

//============================= typed js =============================//
const typed = new Typed('.multiple-text', {
    strings: ['BlueShadow.', 'Trokkk.'],
    typeSpeed: 99.9,
    backSpeed: 100,
    backDelay: 2000,
    loop: true
});

//
// Download
//

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

document.addEventListener('mousedown', (event) => {
    if (event.button === 1) {
        event.preventDefault();
    }
});

document.querySelectorAll('a').forEach(link => {
    link.removeAttribute('target');
});


function openLink(link) {
    if (!link) {
        console.log("Link is null");
        return;
    }
    window.open(link, "_self");
}


function openLink(link, pageName = null) {
    try {
        if (!link) {
            Logger.error("Navigation error: Link is null");
            return;
        }
        
        Logger.trackEvent('Navigation', 'Page Change', pageName || link);
        window.open(link, "_self");
    } catch (error) {
        Logger.error("Navigation error", error);
    }
}

function openSoon() {
    openLink("soon.html", "Coming Soon");
}

function openError() {
    openLink("error.html", "Error");
}

function openChangelogs() {
    openLink("changelogs.html", "Changelogs");
}

function openDocument() {
    openLink("document.html", "Documents");
}

function openDownload() {
    Logger.trackEvent('Download', 'BlueMods Package', 'v5.7.0');
    openLink("https:\/\/github.com/BlueModsYT/BlueMods/releases/download/v5.7.0/BlueModsBeta-v5.7.0.mcpack", "Download");
}

function openAndroid() {
    openLink("downloads.html", "Android Downloads");
}

function openAlliances() {
    openLink("alliances.html", "Alliances");
}

function openAbout() {
    openLink("about.html", "About Us");
}

function openGithub() {
    Logger.trackEvent('External', 'GitHub Visit');
    openLink("https:\/\/github.com/BlueModsYT/BlueMods", "GitHub");
}

function openYoutube() {
    Logger.trackEvent('External', 'YouTube Visit');
    openLink("https:\/\/youtube.com/@BlueModsYT", "YouTube");
}

function openTiktok() {
    Logger.trackEvent('External', 'TikTok Visit');
    openLink("https:\/\/tiktok.com/@bluemodsyt", "TikTok");
}

function openFacebook() {
    Logger.trackEvent('External', 'Facebook Visit');
    openLink("https:\/\/facebook.com/profile.php?id=61566407283474", "Facebook");
}

function openDiscord() {
    Logger.trackEvent('External', 'Discord Visit');
    openLink("https:\/\/discord.gg/bluemods-anticheat-913049851531522078", "Discord");
}

function openGoBack() {
    openLink("index.html", "Home");
}

function openInviteBot() {
    Logger.trackEvent('External', 'Discord Bot Invitation');
    openLink("https:\/\/discord.com/application-directory/976530144741195817", "Invite Bot");
}

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

const validPaths = [
    '/',
    '/bluemods/index.html',
    '/bluemods/soon.html',
    '/bluemods/not_found.html',
    '/bluemods/changelogs.html',
    '/bluemods/alliances.html',
    '/bluemods/document.html',
    '/bluemods/main.html',
    '/bluemods/document',
    '/bluemods/alliances',
    '/bluemods/changelogs',
    '/bluemods/main',
    '/bluemods/soon',
    '/not_found',
    '/bluemods',
    '/bluemods/'
    
];

const currentPath = window.location.pathname;

if (!validPaths.includes(currentPath)) {
    window.location.href = 'not_found.html';
}
