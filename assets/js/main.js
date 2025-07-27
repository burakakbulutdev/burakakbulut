// Language switching functionality
let currentLanguage = 'tr';

const translations = {
    tr: {
        'Lütfen Bekle': 'Lütfen Bekle',
        'Mesajınız Gönderildi': 'Mesajınız Gönderildi',
        'Bir Hata Oluştu': 'Bir Hata Oluştu',
        'Bir Şeyler Ters Gitti': 'Bir Şeyler Ters Gitti'
    },
    en: {
        'Lütfen Bekle': 'Please Wait',
        'Mesajınız Gönderildi': 'Your Message Has Been Sent',
        'Bir Hata Oluştu': 'An Error Occurred',
        'Bir Şeyler Ters Gitti': 'Something Went Wrong'
    }
};

const cvFiles = {
    tr: 'assets/files/cv.pdf',
    en: 'assets/files/cv_en.pdf'
};

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update all elements with data-tr and data-en attributes
    const elements = document.querySelectorAll('[data-tr][data-en]');
    elements.forEach(element => {
        const text = lang === 'tr' ? element.getAttribute('data-tr') : element.getAttribute('data-en');
        element.textContent = text;
    });
    
    // Update CV link
    const cvLink = document.getElementById('cv-link');
    if (cvLink) {
        cvLink.href = cvFiles[lang];
    }
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update page title
    document.title = lang === 'tr' 
        ? 'Burak Akbulut - Game Developer' 
        : 'Burak Akbulut - Game Developer';
        
    // Update page language attribute
    document.documentElement.lang = lang;
}

// Save language preference to memory (simulating localStorage for artifacts)
let savedLanguage = 'tr';

function saveLanguagePreference(lang) {
    savedLanguage = lang;
}

function loadLanguagePreference() {
    return savedLanguage;
}

// Language button event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load saved language preference
    const savedLang = loadLanguagePreference();
    if (savedLang) {
        switchLanguage(savedLang);
    }
    
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
            saveLanguagePreference(lang);
        });
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Skills animation
const observeSkills = () => {
    const skillsSection = document.querySelector('#skills');
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200);
                });
            }
        });
    }, { threshold: 0.5 });

    observer.observe(skillsSection);
};

// Project cards click functionality
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        if (url) {
            window.open(url, '_blank');
        }
    });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section');
const navLinksForHighlight = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinksForHighlight.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact form functionality (from provided files)
const form = document.getElementById("form");
const result = document.getElementById("result");

if (form && result) {
    form.addEventListener("submit", function (e) {
        const formData = new FormData(form);
        e.preventDefault();
        var object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        var json = JSON.stringify(object);
        result.innerHTML = translations[currentLanguage]['Lütfen Bekle'];

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"  
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = translations[currentLanguage]['Mesajınız Gönderildi'];
                result.classList.remove("text-red-500");
                result.classList.add("text-green-500");
            } else {
                console.log(response);
                result.innerHTML = translations[currentLanguage]['Bir Hata Oluştu'];
                result.classList.remove("text-green-500");
                result.classList.add("text-red-500");
            }
        })
        .catch((error) => {
            console.log(error);
            result.innerHTML = translations[currentLanguage]['Bir Şeyler Ters Gitti'];
        })
        .then(function () {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 5000);
        });
    });
}

// Initialize functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    observeSkills();
});