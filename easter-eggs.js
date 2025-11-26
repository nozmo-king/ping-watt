// Easter Eggs and Interactive Surprises
(function() {
    'use strict';

    // Easter Egg 1: Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.body.classList.toggle('konami');
                konamiIndex = 0;
                showMessage('KONAMI CODE ACTIVATED!');
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Easter Egg 2: Matrix Rain on Double Click
    let clickCount = 0;
    let clickTimer = null;

    document.addEventListener('click', () => {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            document.body.classList.toggle('matrix');
            clickCount = 0;
            showMessage('MATRIX MODE TOGGLED');
        }
    });

    // Easter Egg 3: Inverted Colors on Alt+I
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'i') {
            document.body.classList.toggle('inverted');
            showMessage('COLORS INVERTED');
        }
    });

    // Easter Egg 4: Secret Message on typing "ping"
    let typedKeys = [];
    const secretWord = 'ping';

    document.addEventListener('keydown', (e) => {
        // Only track alphanumeric keys
        if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
            typedKeys.push(e.key.toLowerCase());
            
            // Keep only last 10 keys
            if (typedKeys.length > 10) {
                typedKeys.shift();
            }
            
            // Check if secret word is in the typed keys
            const typedString = typedKeys.join('');
            if (typedString.includes(secretWord)) {
                showSecretMessage();
                typedKeys = [];
            }
        }
    });

    // Easter Egg 5: Cursor Trail
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 't') {
            document.body.classList.toggle('cursor-trail');
            if (document.body.classList.contains('cursor-trail')) {
                initCursorTrail();
                showMessage('CURSOR TRAIL ACTIVATED');
            } else {
                removeCursorTrail();
                showMessage('CURSOR TRAIL DEACTIVATED');
            }
        }
    });

    // Easter Egg 6: Random glitch effect on Ctrl+G
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'g') {
            e.preventDefault();
            triggerGlitch();
        }
    });

    // Easter Egg 7: Time-based message
    function checkTime() {
        const hour = new Date().getHours();
        
        if (hour >= 2 && hour < 4) {
            // Late night easter egg
            if (!sessionStorage.getItem('lateNightMessageShown')) {
                setTimeout(() => {
                    showMessage('Still awake? The best discoveries happen at 3am.');
                    sessionStorage.setItem('lateNightMessageShown', 'true');
                }, 5000);
            }
        }
    }

    checkTime();

    // Helper Functions
    function showMessage(text) {
        const existingMessage = document.getElementById('easter-egg-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.id = 'easter-egg-message';
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #000;
            color: #fff;
            border: 1px solid #fff;
            padding: 1rem 2rem;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            letter-spacing: 2px;
            z-index: 10000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    function showSecretMessage() {
        const messages = [
            'PONG',
            'YOU FOUND ME',
            'THE WATT IS STRONG WITH THIS ONE',
            'KEEP EXPLORING',
            'TRY ALT+I',
            'TRY ALT+T',
            'TRY CTRL+G',
            'THE GRAPH KNOWS ALL'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showMessage(randomMessage);
    }

    function triggerGlitch() {
        const elements = document.querySelectorAll('h1, h2, h3, .outline-text');
        elements.forEach(el => {
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = 'glitch 0.3s ease';
            }, 10);
            setTimeout(() => {
                el.style.animation = '';
            }, 300);
        });
        showMessage('GLITCH TRIGGERED');
    }

    // Cursor Trail Effect
    let trailElements = [];
    let cursorTrailActive = false;

    function initCursorTrail() {
        cursorTrailActive = true;
        document.addEventListener('mousemove', drawTrail);
    }

    function removeCursorTrail() {
        cursorTrailActive = false;
        document.removeEventListener('mousemove', drawTrail);
        trailElements.forEach(el => el.remove());
        trailElements = [];
    }

    function drawTrail(e) {
        if (!cursorTrailActive) return;

        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            animation: trailFade 1s ease forwards;
        `;

        document.body.appendChild(trail);
        trailElements.push(trail);

        setTimeout(() => {
            trail.remove();
            const index = trailElements.indexOf(trail);
            if (index > -1) {
                trailElements.splice(index, 1);
            }
        }, 1000);

        // Limit number of trail elements
        if (trailElements.length > 50) {
            const oldTrail = trailElements.shift();
            oldTrail.remove();
        }
    }

    // Add necessary animations via style tag
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }

        @keyframes trailFade {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.5);
            }
        }
    `;
    document.head.appendChild(style);

    // Easter Egg 8: Developer Console Message
    console.log('%c PING WATT ', 'background: #000; color: #fff; font-size: 20px; padding: 10px; border: 1px solid #fff;');
    console.log('%c Welcome to the source! ', 'background: #000; color: #fff; font-size: 14px; padding: 5px;');
    console.log('%c Looking for easter eggs? Try these:', 'background: #000; color: #fff; font-size: 12px; padding: 5px;');
    console.log('%c - Type "ping" anywhere', 'color: #fff; font-size: 11px;');
    console.log('%c - Konami Code (↑↑↓↓←→←→BA)', 'color: #fff; font-size: 11px;');
    console.log('%c - Double click anywhere', 'color: #fff; font-size: 11px;');
    console.log('%c - Alt+I for inverted colors', 'color: #fff; font-size: 11px;');
    console.log('%c - Alt+T for cursor trail', 'color: #fff; font-size: 11px;');
    console.log('%c - Ctrl+G for glitch effect', 'color: #fff; font-size: 11px;');
    console.log('%c Happy exploring! ', 'background: #000; color: #fff; font-size: 12px; padding: 5px; border: 1px solid #fff;');

    // Easter Egg 9: Secret Dev Tools
    window.pw = {
        reveal: function() {
            console.log('Available commands:');
            console.log('pw.invert() - Toggle inverted colors');
            console.log('pw.matrix() - Toggle matrix effect');
            console.log('pw.glitch() - Trigger glitch');
            console.log('pw.trail() - Toggle cursor trail');
            console.log('pw.stats() - Show site stats');
        },
        invert: function() {
            document.body.classList.toggle('inverted');
        },
        matrix: function() {
            document.body.classList.toggle('matrix');
        },
        glitch: function() {
            triggerGlitch();
        },
        trail: function() {
            document.body.classList.toggle('cursor-trail');
            if (document.body.classList.contains('cursor-trail')) {
                initCursorTrail();
            } else {
                removeCursorTrail();
            }
        },
        stats: function() {
            console.log('Site Statistics:');
            console.log('- Elements:', document.querySelectorAll('*').length);
            console.log('- Links:', document.querySelectorAll('a').length);
            console.log('- Images:', document.querySelectorAll('img').length);
            console.log('- Scripts:', document.querySelectorAll('script').length);
            console.log('- Stylesheets:', document.querySelectorAll('link[rel="stylesheet"]').length);
        }
    };

    console.log('%c Type pw.reveal() for secret commands ', 'background: #000; color: #0f0; font-size: 11px; padding: 5px;');

})();
