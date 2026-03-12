// --- 1. Background Image Rotation ---
// Put URLs or local paths to your Minecraft images here
const images = [
    'images/bg3.jpg', 
    'images/bg2.jpg',
    'images/bg3.jpg'
];

let currentImgIndex = 0;
const layer1 = document.getElementById('bg-layer-1');
const layer2 = document.getElementById('bg-layer-2');
let isLayer1Active = true;

// Set initial background
layer1.style.backgroundImage = `url(${images[0]})`;

function switchBackground() {
    currentImgIndex = (currentImgIndex + 1) % images.length;
    const nextImage = `url(${images[currentImgIndex]})`;

    if (isLayer1Active) {
        layer2.style.backgroundImage = nextImage;
        layer2.classList.add('active');
        layer1.classList.remove('active');
    } else {
        layer1.style.backgroundImage = nextImage;
        layer1.classList.add('active');
        layer2.classList.remove('active');
    }
    isLayer1Active = !isLayer1Active;
}

// Switch background every 7 seconds
setInterval(switchBackground, 7000);


// --- 2. Load JSON Data & Build Wiki ---
let wikiData = {};

async function loadWiki() {
    try {
        const response = await fetch('data/wiki.json');
        wikiData = await response.json();
        
        buildNavigation();
        loadArticle('home'); // Load the "home" key by default
    } catch (error) {
        document.getElementById('article-title').innerText = "Error Loading Data";
        document.getElementById('article-body').innerHTML = "<p>Make sure you are running this through a local web server, not just double-clicking the HTML file.</p>";
        console.error("Error fetching JSON:", error);
    }
}

function buildNavigation() {
    const navList = document.getElementById('nav-list');
    navList.innerHTML = ''; // Clear out

    for (const key in wikiData) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.innerText = wikiData[key].title;
        a.dataset.key = key; // Store the JSON key in the link
        
        a.addEventListener('click', (e) => {
            // Remove active class from all links
            document.querySelectorAll('#nav-list a').forEach(link => link.classList.remove('active-link'));
            // Add active class to clicked link
            e.target.classList.add('active-link');
            // Load the content
            loadArticle(e.target.dataset.key);
        });

        li.appendChild(a);
        navList.appendChild(li);
    }
}

function loadArticle(key) {
    const article = wikiData[key];
    if (article) {
        document.getElementById('article-title').innerText = article.title;
        document.getElementById('article-body').innerHTML = article.content;
    }
}

// Start everything up
loadWiki();
