const canvas = document.getElementById('particle-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff66';
        ctx.fill();
    }
}

function animateCanvas() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        for (let j = index + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / 120})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animateCanvas);
}

if (canvas && ctx) {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    for (let i = 0; i < 70; i++) particles.push(new Particle());
    animateCanvas();
}

const navLinks = document.querySelectorAll('a[data-target]');
const header = document.querySelector('header');
const navHeight = header ? header.offsetHeight : 80;

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        const targetId = link.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        e.preventDefault();
        window.scrollTo({
            top: targetSection.offsetTop - navHeight + 5,
            behavior: 'smooth'
        });

        const navMenu = document.getElementById('nav-menu');
        if (navMenu) navMenu.classList.remove('active');
    });
});

const sections = document.querySelectorAll('section');
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('reveal')) {
            entry.target.classList.add('active');
        }

        if (entry.isIntersecting && entry.target.tagName.toLowerCase() === 'section') {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('nav a[data-target]').forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('data-target') === id) {
                    a.classList.add('active');
                }
            });
        }
    });
}, {
    root: null,
    rootMargin: `-${navHeight}px 0px 0px 0px`,
    threshold: 0.2
});

sections.forEach(sec => observer.observe(sec));
reveals.forEach(rev => observer.observe(rev));

const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}
