// 1. DYNAMIC BACKGROUND (Particle Network)
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

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

        for (let i = 0; i < 70; i++) particles.push(new Particle());

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                // Connect particles
                for (let j = index + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance/120})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();

        // 2. TYPING EFFECT
        const texts = ["Security First", "Bug Hunter",];
        let count = 0;
        let index = 0;
        let isDeleting = false;
        const typingElement = document.querySelector('.typing');

        function type() {
            const currentText = texts[count % texts.length];
            typingElement.textContent = isDeleting 
                ? currentText.substring(0, index--) 
                : currentText.substring(0, index++);

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && index === currentText.length + 1) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                count++;
                typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000);

        // 3. 3D CARD TILT EFFECT
        const cards = document.querySelectorAll('.tilt-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Smoother rotation
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });

        // 4. SMOOTH SCROLL WITH OFFSET & ACTIVE LINKS
        const navLinks = document.querySelectorAll('a[data-target]');
        const navHeight = document.querySelector('header').offsetHeight;

        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                
                window.scrollTo({
                    top: targetSection.offsetTop - navHeight + 5,
                    behavior: 'smooth'
                });

                // Close mobile menu
                document.getElementById('nav-menu').classList.remove('active');
            });
        });

        // 5. INTERSECTION OBSERVER (Scroll Reveal & Nav Highlight)
        const sections = document.querySelectorAll('section');
        const reveals = document.querySelectorAll('.reveal');

        const observerOptions = {
            root: null,
            rootMargin: `-${navHeight}px 0px 0px 0px`,
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Handle Scroll Reveal
                if (entry.isIntersecting && entry.target.classList.contains('reveal')) {
                    entry.target.classList.add('active');
                }
                
                // Handle Active Nav
                if (entry.isIntersecting && entry.target.tagName.toLowerCase() === 'section') {
                    const id = entry.target.getAttribute('id');
                    document.querySelectorAll('nav a').forEach(a => {
                        a.classList.remove('active');
                        if (a.getAttribute('data-target') === id) {
                            a.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => observer.observe(sec));
        reveals.forEach(rev => observer.observe(rev));

        // 6. MOBILE MENU TOGGLE
        const menuToggle = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
