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
            { type: 'info', text: 'Available commands:' },
            { type: 'system', text: '  help                           - Display this help message' },
            { type: 'system', text: '  whoami                         - Display user information' },
            { type: 'system', text: '  get contact data               - Get resume download' },
            { type: 'system', text: '  get contact data --detailed    - Full contact information' },
            { type: 'system', text: '  sudo get contact data --detailed - Admin access contact info' },
            { type: 'system', text: '  date                           - Show current date and time' },
            { type: 'system', text: '  skills                         - Quick access to skills section' },
            { type: 'system', text: '  projects                       - Quick access to projects section' },
            { type: 'system', text: '  experience                     - Quick access to experience section' },
            { type: 'system', text: '  clear                          - Clear terminal screen' },
            { type: 'system', text: '  matrix                         - Enter the Matrix...' },
            { type: 'system', text: '  coffee                         - ☕' },
            { type: 'system', text: '  quote                          - Random tech quote' },
            { type: 'system', text: '  hack                           - Try to hack the mainframe' },
            { type: 'system', text: '  konami                         - Easter egg!' },
            { type: 'system', text: '  donate                         - Best ROI donation in the world so far' }
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
            { type: 'success', text: '💙💛 Thank you for your interest in supporting Ukraine! 💛💙' },
            { type: 'system', text: '' },
            { type: 'info', text: 'Sternenko Fund - Best ROI donation in the world' },
            { type: 'system', text: '' },
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
            { type: 'info', text: 'PIDIK.' }
        ],
    },

    zhenia: {
        description: 'Easter egg',
        response: [
            { type: 'info', text: 'Often responds to my messages.' }
        ],
    },

    zhenya: {
        description: 'Easter egg',
        response: [
            { type: 'info', text: 'Zaebav spellingom, but often responds to my messages.' }
        ],
    },

    matrix: {
        description: 'Enter the Matrix',
        response: [
            { type: 'success', text: 'Wake up, Neo...' },
            { type: 'info', text: 'The Matrix has you...' },
            { type: 'success', text: 'Follow the white rabbit. 🐰' },
            { type: 'system', text: 'Knock, knock, Neo.' }
        ]
    },

    coffee: {
        description: 'Get some coffee',
        response: [
            { type: 'success', text: '☕ Brewing fresh coffee...' },
            { type: 'info', text: 'Coffee ready! Productivity +100%' }
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
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            return [randomQuote];
        }
    },

    hack: {
        description: 'Hack the mainframe',
        response: [
            { type: 'system', text: 'Initializing hack sequence...' },
            { type: 'info', text: 'Scanning for vulnerabilities...' },
            { type: 'success', text: 'Bypassing firewall... [████████] 100%' },
            { type: 'info', text: 'Accessing mainframe...' },
            { type: 'error', text: 'Failed URANUS protocol.' },
            { type: 'error', text: 'ACCESS DENIED' },
        ]
    },

    konami: {
        description: 'Konami code Easter egg',
        response: [
            { type: 'success', text: '🎮 KONAMI CODE ACTIVATED! 🎮' },
            { type: 'info', text: '⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️ ⬅️ ➡️ 🅱️ 🅰️' },
            { type: 'success', text: 'You unlocked: +30 Lives!' },
        ]
    },

    ping: {
        description: 'Ping the server',
        response: [
            { type: 'success', text: 'PING cyber.city (127.0.0.1) 56(84) bytes of data.' },
            { type: 'info', text: '64 bytes from cyber.city: icmp_seq=1 ttl=64 time=0.042 ms' },
            { type: 'info', text: '64 bytes from cyber.city: icmp_seq=2 ttl=64 time=0.039 ms' },
            { type: 'info', text: '64 bytes from cyber.city: icmp_seq=3 ttl=64 time=0.041 ms' }
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
            { type: 'error', text: 'ERROR: Permission denied' },
            { type: 'system', text: 'Detected destructive command!' },
            { type: 'info', text: 'System protection: ENGAGED' },
            { type: 'success', text: 'Nothing was harmed. Nice try though! 🛡️' }
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
            { type: 'info', text: '╭───────────────────────────────╮' },
            { type: 'info', text: '│  CyberCity Terminal v2.0.77  │' },
            { type: 'info', text: '├───────────────────────────────┤' },
            { type: 'info', text: '│ OS: CyberOS 2077              │' },
            { type: 'info', text: '│ Kernel: Neon-5.15.0           │' },
            { type: 'info', text: '│ Shell: cybershell             │' },
            { type: 'info', text: '│ CPU: Neural Processor X99     │' },
            { type: 'info', text: '│ Memory: ∞ GB                  │' },
            { type: 'info', text: '╰───────────────────────────────╯' }
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
        if (COMMANDS[trimmedCommand]) {
            const commandData = COMMANDS[trimmedCommand];
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
