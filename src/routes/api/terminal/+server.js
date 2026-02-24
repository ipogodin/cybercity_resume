import { json } from '@sveltejs/kit';

/**
 * Terminal Command API - Easter Egg Commands
 * Server-side handling to keep commands secret from client inspection
 */

// Easter egg commands - these won't be visible in client-side code
const COMMANDS = {
    help: {
        description: 'Display available commands',
        response: [
            { type: 'info',   text: 'Available commands:', instant: true },
            { type: 'system', text: '  help                           - Display this help message', instant: true },
            { type: 'system', text: '  whoami                         - Display user information', instant: true },
            { type: 'system', text: '  get contact data               - Get resume download', instant: true },
            { type: 'system', text: '  get contact data --detailed    - Full contact information', instant: true },
            { type: 'system', text: '  sudo get contact data --detailed - Admin access contact info', instant: true },
            { type: 'system', text: '  date                           - Show current date and time', instant: true },
            { type: 'system', text: '  skills                         - Quick access to skills section', instant: true },
            { type: 'system', text: '  projects                       - Quick access to projects section', instant: true },
            { type: 'system', text: '  experience                     - Quick access to experience section', instant: true },
            { type: 'system', text: '  clear                          - Clear terminal screen', instant: true },
            { type: 'system', text: '  matrix                         - Enter the Matrix...', instant: true },
            { type: 'system', text: '  coffee                         - ☕', instant: true },
            { type: 'system', text: '  quote                          - Random tech quote', instant: true },
            { type: 'system', text: '  hack                           - Try to hack the mainframe', instant: true },
            { type: 'system', text: '  konami                         - Easter egg!', instant: true },
            { type: 'system', text: '  donate                         - Best ROI donation in the world so far', instant: true },
            { type: 'system', text: '  vim                            - Experience vim', instant: true },
            { type: 'system', text: '  git blame                      - Who wrote this?', instant: true },
            { type: 'system', text: '  sudo make me a sandwich        - xkcd #149', instant: true },
            { type: 'system', text: '  42                             - The answer', instant: true },
            { type: 'system', text: '  git log                        - Commit history', instant: true },
            { type: 'system', text: '  ssh illia@meta.com             - Connect to Meta', instant: true },
            { type: 'system', text: '  uptime                         - System uptime', instant: true },
            { type: 'system', text: '  cat /etc/motd                  - Message of the day', instant: true }
        ]
    },

    whoami: {
        description: 'Display user information',
        response: [
            { type: 'success', text: 'User: Illia Pogodin' },
            { type: 'info', text: 'Role: Senior Backend Engineer @ Meta' },
            { type: 'info', text: 'Experience: 15+ years' },
            { type: 'info', text: 'Location: Bellevue, WA' },
            { type: 'info', text: 'Status: Open to opportunities' }
        ]
    },

    'get contact data': {
        description: 'Get contact resume download',
        response: [
            { type: 'error', text: 'Access denied.' },
        ]
    },

    'get contact data --detailed': {
        description: 'Get detailed contact information',
        response: [
            { type: 'error', text: 'Access denied.' },
        ]
    },

    'sudo get contact data --detailed': {
        description: 'Get contact information with sudo',
        response: [
            { type: 'success', text: '200 OK' },
            { type: 'contact-info' }
        ]
    },

    date: {
        description: 'Show current date and time',
        response: [
            { type: 'success', text: `${new Date().toString()}` }
        ]
    },

    skills: {
        description: 'Navigate to skills section',
        response: [
            { type: 'success', text: 'Initiating navigation to Skills District...' },
            { type: 'info', text: 'Redirecting in 2 seconds...' }
        ],
        navigate: '/skills'
    },

    projects: {
        description: 'Navigate to projects section',
        response: [
            { type: 'success', text: 'Initiating navigation to Projects Alley...' },
            { type: 'info', text: 'Redirecting in 2 seconds...' }
        ],
        navigate: '/projects'
    },

    experience: {
        description: 'Navigate to experience section',
        response: [
            { type: 'success', text: 'Initiating navigation to Experience Avenue...' },
            { type: 'info', text: 'Redirecting in 2 seconds...' }
        ],
        navigate: '/experience'
    },

    education: {
        description: 'Navigate to education section',
        response: [
            { type: 'success', text: 'Initiating navigation to Education Quarter...' },
            { type: 'info', text: 'Redirecting in 2 seconds...' }
        ],
        navigate: '/education'
    },

    hub: {
        description: 'Return to main hub',
        response: [
            { type: 'success', text: 'Returning to Main Hub...' },
            { type: 'info', text: 'Redirecting in 2 seconds...' }
        ],
        navigate: '/'
    },

    donate: {
        description: 'Support Ukraine - Donate to Sternenko Fund',
        response: [
            { type: 'success',       text: '💙💛 Support Ukraine 💛💙',                      speed: 'human', delayAfter: 600  },
            { type: 'ukraine-wave',  duration: 3500 },
            { type: 'system',        text: '' },
            { type: 'system',        text: 'Connecting to Sternenko Fund data feed...',       speed: 'fast',  delayAfter: 500  },
            { type: 'success',       text: 'Feed connected.',                                 speed: 'fast',  delayAfter: 300  },
            { type: 'system',        text: '' },
            { type: 'info',          text: 'Field: Frontline equipment & soldier welfare',    speed: 'fast',  delayAfter: 250  },
            { type: 'info',          text: 'Transparency: 100% — all spending published',     speed: 'fast',  delayAfter: 250  },
            { type: 'info',          text: 'Overhead: near zero — volunteer-run',             speed: 'fast',  delayAfter: 250  },
            { type: 'system',        text: '' },
            { type: 'info',          text: 'ROI: highest verified impact per dollar donated', speed: 'human', delayAfter: 700  },
            { type: 'system',        text: '' },
            { type: 'donate-button', url: 'https://www.sternenkofund.org/en/donate' }
        ]
    },

    clear: {
        description: 'Clear terminal screen',
        response: [
            { type: 'system', text: 'Terminal cleared.' }
        ],
        clear: true
    },

    sasha: {
        description: 'Easter egg',
        response: [
            { type: 'system',        text: 'Looking up user profile...',   speed: 'fast',  delayAfter: 500  },
            { type: 'system',        text: 'Profile found.',               speed: 'fast',  delayAfter: 200  },
            { type: 'glitch-static', duration: 1500 },
            { type: 'info',          text: 'PIDIK.',                       speed: 'human', delayAfter: 1200 },
            { type: 'system',        text: 'Assessment stands.',           speed: 'fast',  delayAfter: 0    }
        ]
    },

    zhenia: {
        description: 'Easter egg',
        response: [
            { type: 'system',         text: 'Querying relationship_db...',         speed: 'fast',  delayAfter: 400  },
            { type: 'info',           text: 'Loading 7 years of evidence...',      speed: 'fast',  delayAfter: 300  },
            { type: 'typing-bubbles', duration: 2000 },
            { type: 'info',           text: 'Analyzing response patterns...',      speed: 'fast',  delayAfter: 600  },
            { type: 'success',        text: 'Often responds to messages.',         speed: 'human', delayAfter: 600  },
            { type: 'system',         text: '(spelling: trying harder)',           speed: 'fast',  delayAfter: 0    }
        ]
    },

    zhenya: {
        description: 'Easter egg',
        response: [
            { type: 'system',         text: 'Querying relationship_db...',         speed: 'fast',  delayAfter: 400  },
            { type: 'info',           text: 'Loading 7 years of evidence...',      speed: 'fast',  delayAfter: 300  },
            { type: 'typing-bubbles', duration: 2000 },
            { type: 'info',           text: 'Analyzing response patterns...',      speed: 'fast',  delayAfter: 600  },
            { type: 'success',        text: 'Often responds to messages.',         speed: 'human', delayAfter: 600  },
            { type: 'system',         text: '(spelling: inconsistent)',            speed: 'fast',  delayAfter: 0    }
        ]
    },

    matrix: {
        description: 'Enter the Matrix',
        response: [
            { type: 'system',  text: 'Requesting elevated access...',                            speed: 'fast',  delayAfter: 500  },
            { type: 'success', text: 'Auth token accepted.',                                     speed: 'fast',  delayAfter: 400  },
            { type: 'system',  text: 'Probing layer 3 firewall...',                              speed: 'fast',  delayAfter: 700  },
            { type: 'success', text: 'Firewall bypassed. Tunneling into core...',                speed: 'fast',  delayAfter: 800  },
            { type: 'info',    text: 'Depth: 1 / 7   [>          ]',                            speed: 'fast',  delayAfter: 200  },
            { type: 'info',    text: 'Depth: 2 / 7   [==>        ]',                            speed: 'fast',  delayAfter: 200  },
            { type: 'info',    text: 'Depth: 3 / 7   [=====>     ]',                            speed: 'fast',  delayAfter: 200  },
            { type: 'info',    text: 'Depth: 4 / 7   [========>  ]',                            speed: 'fast',  delayAfter: 300  },
            { type: 'info',    text: 'Depth: 5 / 7   [==========>]',                            speed: 'fast',  delayAfter: 500  },
            { type: 'error',   text: 'WARNING: Anomalous signal detected on channel 0x4D',      speed: 'fast',  delayAfter: 600  },
            { type: 'system',  text: 'Initiating deep-layer scan...',                            speed: 'fast',  delayAfter: 400  },
            { type: 'matrix-rain', duration: 6000 },
            { type: 'error',   text: '⚠ SYSTEM OVERLOAD — buffer saturated',                    overlay: true, speed: 'fast',  delayBefore: 100, delayAfter: 500 },
            { type: 'error',   text: 'CRITICAL: heap corruption @ 0xDEADBEEF  [pid 1337]',      overlay: true, speed: 'fast',  delayAfter: 450  },
            { type: 'error',   text: 'Kernel panic — not syncing: fatal exception in interrupt', overlay: true, speed: 'fast',  delayAfter: 500  },
            { type: 'system',  text: 'Emergency shutdown initiated...',                          overlay: true, speed: 'fast',  delayAfter: 1000 },
            { type: 'terminal-reboot', delayBefore: 200 }
        ]
    },

    coffee: {
        description: 'Get some coffee',
        response: [
            { type: 'system',          text: 'Brewing protocol initiated...',                speed: 'fast',  delayAfter: 400  },
            { type: 'info',            text: 'Water temp: 94°C  [optimal]',                  speed: 'fast',  delayAfter: 300  },
            { type: 'info',            text: 'Grind: medium-coarse  |  Dose: 18g',           speed: 'fast',  delayAfter: 300  },
            { type: 'system',          text: 'Brewing... [          ] 0%',                   speed: 'fast',  delayAfter: 200  },
            { type: 'system',          text: 'Brewing... [███       ] 30%',                  speed: 'fast',  delayAfter: 200  },
            { type: 'system',          text: 'Brewing... [██████    ] 60%',                  speed: 'fast',  delayAfter: 200  },
            { type: 'system',          text: 'Brewing... [█████████ ] 90%',                  speed: 'fast',  delayAfter: 300  },
            { type: 'success',         text: 'Brewing... [██████████] 100%  DONE',           speed: 'fast',  delayAfter: 300  },
            { type: 'steam-particles', duration: 3000 },
            { type: 'info',            text: '       ) ) )',                                  speed: 'fast',  delayAfter: 60   },
            { type: 'info',            text: '      ( ( (',                                  speed: 'fast',  delayAfter: 60   },
            { type: 'info',            text: '    .________.',                                speed: 'fast',  delayAfter: 60   },
            { type: 'info',            text: "    |        |]",                              speed: 'fast',  delayAfter: 60   },
            { type: 'info',            text: '    \\        /',                              speed: 'fast',  delayAfter: 60   },
            { type: 'info',            text: "     `------'",                                speed: 'fast',  delayAfter: 300  },
            { type: 'success',         text: '☕  Ready. Productivity: +100%',               speed: 'human', delayAfter: 400  },
            { type: 'info',            text: 'Side effects: strong opinions, fast typing.',  speed: 'human', delayAfter: 0    }
        ]
    },

    quote: {
        description: 'Random tech quote',
        response: () => {
            const quotes = [
                { text: '"Talk is cheap. Show me the code." - Linus Torvalds', type: 'info' },
                { text: '"The best error message is the one that never shows up." - Thomas Fuchs', type: 'info' },
                { text: '"First, solve the problem. Then, write the code." - John Johnson', type: 'info' },
                { text: '"Code is like humor. When you have to explain it, it\'s bad." - Cory House', type: 'info' },
                { text: '"Make it work, make it right, make it fast." - Kent Beck', type: 'info' },
                { text: '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler', type: 'info' },
                { text: '"Simplicity is the soul of efficiency." - Austin Freeman', type: 'info' }
            ];
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            const match = q.text.match(/^"(.+)"\s*[-—]\s*(.+)$/);
            const body = match ? `"${match[1]}"` : q.text;
            const attr = match ? `— ${match[2]}` : '';
            return [
                { type: 'system',        text: 'Querying wisdom database...',  speed: 'fast',  delayAfter: 400 },
                { type: 'info',          text: 'Scanning 10,000 engineers...',  speed: 'fast',  delayAfter: 300 },
                { type: 'circuit-pulse', duration: 2500 },
                { type: 'success',       text: 'Signal acquired.',              speed: 'fast',  delayAfter: 500 },
                { type: 'system',        text: '' },
                { type: 'info',          text: body,                            speed: 'human', delayAfter: 400 },
                { type: 'system',        text: `        ${attr}`,               speed: 'fast',  delayAfter: 0   }
            ];
        }
    },

    hack: {
        description: 'Hack the mainframe',
        response: [
            { type: 'system',  text: 'Initializing exploit framework v4.2.0...',           speed: 'fast',  delayAfter: 600  },
            { type: 'info',    text: 'Scanning target: cyber.city (127.0.0.1)',             speed: 'fast',  delayAfter: 400  },
            { type: 'info',    text: 'Open ports: 22/ssh  80/http  443/https  1337/???',    speed: 'fast',  delayAfter: 700  },
            { type: 'success', text: 'Vulnerability found: CVE-2077-31337 (CRITICAL 10.0)', speed: 'fast',  delayAfter: 800  },
            { type: 'system',  text: 'Injecting payload...',                                speed: 'human', delayAfter: 900  },
            { type: 'info',    text: 'Bypassing firewall... [████████████] 100%',           speed: 'fast',  delayAfter: 700  },
            { type: 'success', text: 'Shell established. root@cyber.city:~#',               speed: 'fast',  delayAfter: 600  },
            { type: 'success', text: 'Exfiltrating data...',                                speed: 'human', delayAfter: 400  },
            { type: 'scan-grid', duration: 4000 },
            { type: 'error',   text: '⚠ ALERT: Intrusion detected on YOUR system',         speed: 'fast',  delayAfter: 400  },
            { type: 'error',   text: 'Honeypot triggered. Logging attacker...',             speed: 'fast',  delayAfter: 300  },
            { type: 'system',  text: 'Your IP: 192.168.1.1  MAC: DE:AD:BE:EF:CA:FE',       speed: 'fast',  delayAfter: 500  },
            { type: 'system',  text: 'Browser fingerprint: captured.',                      speed: 'fast',  delayAfter: 400  },
            { type: 'system',  text: 'Keystroke dynamics: logged.',                         speed: 'fast',  delayAfter: 400  },
            { type: 'error',   text: 'URANUS protocol engaged. FBI called.',                speed: 'fast',  delayAfter: 600  },
            { type: 'success', text: 'Just kidding. Nice try though. 😈',                   speed: 'human', delayAfter: 0    }
        ]
    },

    konami: {
        description: 'Konami code Easter egg',
        response: [
            { type: 'system',      text: 'Input sequence detected...',             speed: 'fast',  delayAfter: 400  },
            { type: 'info',        text: '↑',                                       speed: 'human', delayAfter: 120  },
            { type: 'info',        text: '↑ ↑',                                     speed: 'human', delayAfter: 120  },
            { type: 'info',        text: '↑ ↑ ↓',                                   speed: 'human', delayAfter: 120  },
            { type: 'info',        text: '↑ ↑ ↓ ↓',                                 speed: 'human', delayAfter: 120  },
            { type: 'info',        text: '↑ ↑ ↓ ↓ ← →',                            speed: 'human', delayAfter: 120  },
            { type: 'info',        text: '↑ ↑ ↓ ↓ ← → ← →',                       speed: 'human', delayAfter: 120  },
            { type: 'info',        text: '↑ ↑ ↓ ↓ ← → ← → B A',                   speed: 'human', delayAfter: 300  },
            { type: 'pixel-burst', duration: 2500 },
            { type: 'error',       text: '--- CHEAT MODE ACTIVATED ---',             speed: 'fast',  delayAfter: 500  },
            { type: 'system',      text: 'Patching reality.exe...',                  speed: 'fast',  delayAfter: 600  },
            { type: 'success',     text: '✓ Years of experience:    15  →  9000',   speed: 'fast',  delayAfter: 200  },
            { type: 'success',     text: '✓ Bugs written:           ???  →  0',     speed: 'fast',  delayAfter: 200  },
            { type: 'success',     text: '✓ Stack Overflow tabs:    47   →  ∞',     speed: 'fast',  delayAfter: 200  },
            { type: 'success',     text: '✓ Coffee consumed (L):    1200 →  MAX',   speed: 'fast',  delayAfter: 400  },
            { type: 'info',        text: '+30 lives added. Use them wisely.',        speed: 'human', delayAfter: 0    }
        ]
    },

    ping: {
        description: 'Ping the server',
        response: [
            { type: 'system',        text: 'TRACEROUTE cyber.city — max 10 hops',          speed: 'fast', delayAfter: 300 },
            { type: 'network-pulse', duration: 4000 },
            { type: 'info',    text: '  1  gateway.local          0.4ms',                   speed: 'fast', delayAfter: 500 },
            { type: 'info',    text: '  2  seattle-core.nw        2.1ms',                   speed: 'fast', delayAfter: 500 },
            { type: 'info',    text: '  3  pacific-spine.net      8.7ms',                   speed: 'fast', delayAfter: 600 },
            { type: 'info',    text: '  4  neon-district.cyber   12.3ms',                   speed: 'fast', delayAfter: 600 },
            { type: 'info',    text: '  5  rain-relay.city       14.0ms',                   speed: 'fast', delayAfter: 700 },
            { type: 'success', text: '  6  cyber.city (127.0.0.1) 0.042ms  ← home',        speed: 'fast', delayAfter: 500 },
            { type: 'system',  text: '' },
            { type: 'info',    text: '6 hops. 0% packet loss. All packets accounted for.',  speed: 'fast', delayAfter: 0   }
        ]
    },

    sudo: {
        description: 'Try to use sudo',
        response: [
            { type: 'error', text: 'sudo what? Nope. Denied. D-E-N-I-E-D!' },
        ]
    },

    'rm -rf /': {
        description: 'Dangerous command',
        response: [
            { type: 'system',   text: 'Executing...',                                               speed: 'fast', delayAfter: 300 },
            { type: 'error',    text: "removed '/bin/sh'",                                          speed: 'fast', delayAfter: 80  },
            { type: 'error',    text: "removed '/usr/bin/python'",                                  speed: 'fast', delayAfter: 80  },
            { type: 'error',    text: "removed '/home/guest/cybercity/experience/meta.json'",       speed: 'fast', delayAfter: 80  },
            { type: 'error',    text: "removed '/home/guest/cybercity/experience/google.json'",     speed: 'fast', delayAfter: 80  },
            { type: 'error',    text: "removed '/home/guest/cybercity/projects/...' [47 items]",    speed: 'fast', delayAfter: 80  },
            { type: 'error',    text: "removed '/home/guest/cybercity/skills/...' [230 items]",     speed: 'fast', delayAfter: 80  },
            { type: 'error',    text: "removed '/static/resume.pdf'",                               speed: 'fast', delayAfter: 200 },
            { type: 'file-rain', duration: 3500 },
            { type: 'success',  text: '⚡ SYSTEM GUARDIAN — deletion halted at 73%',               speed: 'fast', delayAfter: 500 },
            { type: 'system',   text: 'Initiating rollback from snapshot...',                       speed: 'fast', delayAfter: 400 },
            { type: 'info',     text: 'Restoring files... [████████████] 100%',                    speed: 'fast', delayAfter: 400 },
            { type: 'success',  text: 'All files restored. resume.pdf: intact.',                    speed: 'fast', delayAfter: 400 },
            { type: 'info',     text: 'Damage assessment: 0 bytes lost. Nice try though. 🛡️',      speed: 'human', delayAfter: 0  }
        ]
    },

    ls: {
        description: 'List directory contents',
        response: [
            { type: 'info', text: 'total 64' },
            { type: 'info', text: 'drwxr-xr-x  experience/' },
            { type: 'info', text: 'drwxr-xr-x  skills/' },
            { type: 'info', text: 'drwxr-xr-x  projects/' },
            { type: 'info', text: 'drwxr-xr-x  education/' },
            { type: 'info', text: '-rw-r--r--  resume.pdf' }
        ]
    },

    pwd: {
        description: 'Print working directory',
        response: [
            { type: 'info', text: '/home/guest/cybercity/contact' }
        ]
    },

    neofetch: {
        description: 'System information',
        response: [
            { type: 'info', text: '╭───────────────────────────────╮', speed: 'fast', delayAfter: 60 },
            { type: 'info', text: '│  CyberCity Terminal v2.0.77  │', speed: 'fast', delayAfter: 60 },
            { type: 'info', text: '├───────────────────────────────┤', speed: 'fast', delayAfter: 60 },
            { type: 'info', text: '│ OS: CyberOS 2077              │', speed: 'fast', delayAfter: 60 },
            { type: 'info', text: '│ Kernel: Neon-5.15.0           │', speed: 'fast', delayAfter: 60 },
            { type: 'info', text: '│ Shell: cybershell             │', speed: 'fast', delayAfter: 60 },
            { type: 'info', text: '│ CPU: Neural Processor X99     │', speed: 'fast', delayAfter: 60 },
            { type: 'info', text: '│ Memory: ∞ GB                  │', speed: 'fast', delayAfter: 60 },
            { type: 'info', text: '╰───────────────────────────────╯', speed: 'fast', delayAfter: 0  }
        ]
    },

    vim: {
        description: 'Open vim',
        response: [
            { type: 'system',       text: 'Opening vim...',                                  speed: 'fast',  delayAfter: 500  },
            { type: 'vim-takeover', duration: 3000 },
            { type: 'info',    text: '~',                                                     speed: 'fast',  delayAfter: 60   },
            { type: 'info',    text: '~',                                                     speed: 'fast',  delayAfter: 60   },
            { type: 'info',    text: '~',                                                     speed: 'fast',  delayAfter: 60   },
            { type: 'info',    text: '"[No Name]" -- INSERT --',                              speed: 'fast',  delayAfter: 800  },
            { type: 'error',   text: 'How do I exit this thing',                              speed: 'human', delayAfter: 1000 },
            { type: 'error',   text: ':q',                                                    speed: 'human', delayAfter: 400  },
            { type: 'error',   text: 'E: No write since last change. Add ! to override',     speed: 'fast',  delayAfter: 600  },
            { type: 'error',   text: ':q!',                                                   speed: 'human', delayAfter: 300  },
            { type: 'success', text: 'Vim closed.',                                           speed: 'fast',  delayAfter: 400  },
            { type: 'info',    text: 'Time elapsed: 47 minutes.',                             speed: 'human', delayAfter: 0    }
        ]
    },

    'git blame': {
        description: 'Show git blame',
        response: [
            { type: 'system',          text: 'Analyzing repository guilt...',                speed: 'fast',  delayAfter: 500  },
            { type: 'blame-waterfall', duration: 3000 },
            { type: 'info',    text: 'a3f2c1d (Illia Pogodin 2024-11-03) Fixed null ptr',    speed: 'fast',  delayAfter: 80   },
            { type: 'info',    text: 'b9e14aa (Illia Pogodin 2024-11-03) Fixed the fix',     speed: 'fast',  delayAfter: 80   },
            { type: 'info',    text: 'c7f99b2 (Illia Pogodin 2024-11-04) Reverted fix',      speed: 'fast',  delayAfter: 80   },
            { type: 'info',    text: 'd0b3312 (Illia Pogodin 2024-11-04) Re-applied fix',    speed: 'fast',  delayAfter: 80   },
            { type: 'info',    text: 'e2218fc (Illia Pogodin 2024-11-05) THIS IS THE FIX',   speed: 'fast',  delayAfter: 80   },
            { type: 'info',    text: 'f11a091 (Illia Pogodin 2025-01-14) Removed the fix',   speed: 'fast',  delayAfter: 300  },
            { type: 'system',  text: '' },
            { type: 'error',   text: 'All 2,847 lines: Illia Pogodin.',                      speed: 'fast',  delayAfter: 400  },
            { type: 'info',    text: 'No one else to blame. This is his house.',              speed: 'human', delayAfter: 0    }
        ]
    },

    'sudo make me a sandwich': {
        description: 'xkcd #149',
        response: [
            { type: 'system',         text: '[sudo] password for guest: ',   speed: 'fast',  delayAfter: 1200 },
            { type: 'success',        text: 'Authentication successful.',    speed: 'fast',  delayAfter: 400  },
            { type: 'sandwich-build', duration: 2500 },
            { type: 'success',        text: 'Okay.',                         speed: 'human', delayAfter: 400  },
            { type: 'info',           text: '(see also: xkcd.com/149)',      speed: 'fast',  delayAfter: 0    }
        ]
    },

    42: {
        description: 'The answer',
        response: [
            { type: 'system',          text: 'Initializing Deep Thought v2.0...',    speed: 'fast',  delayAfter: 500  },
            { type: 'info',            text: 'Processing Ultimate Question...',       speed: 'fast',  delayAfter: 400  },
            { type: 'info',            text: 'ETA: 7.5 million years',               speed: 'fast',  delayAfter: 300  },
            { type: 'system',          text: 'Applying time compression...',         speed: 'fast',  delayAfter: 400  },
            { type: 'galaxy-converge', duration: 4000 },
            { type: 'success',         text: 'The answer is: 42',                    speed: 'human', delayAfter: 500  },
            { type: 'system',          text: 'Note: the Question remains unknown.',  speed: 'fast',  delayAfter: 0    }
        ]
    },

    'git log': {
        description: 'Show git log',
        response: [
            { type: 'commit-graph', duration: 3000 },
            { type: 'system',  text: 'commit f9a2c31 (HEAD -> main)',                               speed: 'fast', delayAfter: 60  },
            { type: 'info',    text: 'feat: implement distributed consensus algorithm',              speed: 'fast', delayAfter: 60  },
            { type: 'system',  text: 'commit d7b1190',                                               speed: 'fast', delayAfter: 60  },
            { type: 'info',    text: 'fix: resolve race condition in payment service',               speed: 'fast', delayAfter: 60  },
            { type: 'system',  text: 'commit c43e882',                                               speed: 'fast', delayAfter: 60  },
            { type: 'info',    text: 'fix: actually fix it this time',                               speed: 'fast', delayAfter: 60  },
            { type: 'system',  text: 'commit b812aa1',                                               speed: 'fast', delayAfter: 60  },
            { type: 'info',    text: 'fix: i have no idea why this works but it does',               speed: 'fast', delayAfter: 60  },
            { type: 'system',  text: 'commit a1c9de4',                                               speed: 'fast', delayAfter: 60  },
            { type: 'info',    text: 'wip wip wip',                                                  speed: 'fast', delayAfter: 60  },
            { type: 'system',  text: 'commit 9ff0012',                                               speed: 'fast', delayAfter: 60  },
            { type: 'info',    text: 'final',                                                        speed: 'fast', delayAfter: 60  },
            { type: 'system',  text: 'commit 8d3b771',                                               speed: 'fast', delayAfter: 60  },
            { type: 'info',    text: 'final FINAL',                                                  speed: 'fast', delayAfter: 60  },
            { type: 'system',  text: 'commit 7a2c109',                                               speed: 'fast', delayAfter: 200 },
            { type: 'info',    text: 'okay this is actually final for real this time I promise',     speed: 'fast', delayAfter: 0   }
        ]
    },

    'ssh illia@meta.com': {
        description: 'Connect to Meta',
        response: [
            { type: 'system',      text: 'Connecting to meta.com (157.240.x.x)...',          speed: 'fast',  delayAfter: 700  },
            { type: 'success',     text: 'SSH handshake complete. TLS 1.3.',                  speed: 'fast',  delayAfter: 400  },
            { type: 'system',      text: '[2FA] Push notification sent to device...',         speed: 'fast',  delayAfter: 1200 },
            { type: 'success',     text: 'Authentication successful.',                        speed: 'fast',  delayAfter: 300  },
            { type: 'packet-flow', duration: 3000 },
            { type: 'info',        text: 'Welcome to Meta Corp Internal Network.',            speed: 'fast',  delayAfter: 300  },
            { type: 'info',        text: 'Last login: today, as usual.',                      speed: 'fast',  delayAfter: 300  },
            { type: 'system',      text: '' },
            { type: 'error',       text: '⚠ You are not supposed to see this. Logging off.', speed: 'human', delayAfter: 500  },
            { type: 'system',      text: 'Connection closed by remote host.',                 speed: 'fast',  delayAfter: 0    }
        ]
    },

    uptime: {
        description: 'Show system uptime',
        response: [
            { type: 'heartbeat-monitor', duration: 2500 },
            { type: 'info',    text: ' 23:47:12 up 15 years, 3 months, 14 days',         speed: 'fast',  delayAfter: 200 },
            { type: 'info',    text: ' load average: 0.01, 0.01, 0.00',                  speed: 'fast',  delayAfter: 200 },
            { type: 'system',  text: '' },
            { type: 'info',    text: 'This machine has been coding since 2010.',          speed: 'fast',  delayAfter: 300 },
            { type: 'success', text: 'No crashes. No burnout. No days off.',              speed: 'human', delayAfter: 0   }
        ]
    },

    'cat /etc/motd': {
        description: 'Show message of the day',
        response: [
            { type: 'system',        text: '--- /etc/motd ---',                         speed: 'fast',  delayAfter: 300 },
            { type: 'text-coalesce', duration: 3000 },
            { type: 'info',          text: '' },
            { type: 'info',          text: '  Write code that lasts.',                  speed: 'human', delayAfter: 400 },
            { type: 'info',          text: '  Ship things that matter.',                speed: 'human', delayAfter: 400 },
            { type: 'info',          text: '  Debug with patience.',                    speed: 'human', delayAfter: 600 },
            { type: 'info',          text: '' },
            { type: 'system',        text: '— /etc/motd, last updated: always',         speed: 'fast',  delayAfter: 0  }
        ]
    },

    '': {
        description: 'Empty command',
        response: [
            { type: 'error', text: 'Command cannot be empty.' },
        ]
    }
};

// Handle POST requests from terminal
export async function POST({ request }) {
    try {
        const { command } = await request.json();

        if (!command) {
            return json({
                success: false,
                error: 'No command provided'
            });
        }

        const trimmedCommand = command.trim().toLowerCase();

        // Check if command exists
        const commandsMap = /** @type {Record<string, any>} */ (COMMANDS);
        if (commandsMap[trimmedCommand]) {
            const commandData = commandsMap[trimmedCommand];
            let response = commandData.response;

            // Handle dynamic responses (functions)
            if (typeof response === 'function') {
                response = response();
            }

            return json({
                success: true,
                response,
                navigate: commandData.navigate || null,
                external: commandData.external || false,
                clear: commandData.clear || false
            });
        }

        // Command not found
        return json({
            success: false,
            response: [
                { type: 'error', text: 'Command not found.' },
            ]
        });
    } catch (error) {
        console.error('Terminal API error:', error);
        return json({
            success: false,
            response: [
                {
                    type: 'error',
                    text: 'Internal server error. Please try again.'
                }
            ]
        }, { status: 500 });
    }
}
