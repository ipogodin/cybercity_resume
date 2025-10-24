# Interactive Terminal Feature

## 🎮 Overview

Added an interactive, fully functional terminal to the Contact page that maintains the cyberpunk aesthetic while allowing users to type commands and discover Easter eggs.

**Completed:** October 24, 2025

---

## ✨ Key Features

### 1. **Interactive Input**
- Real terminal-like input field with blinking cursor
- Command history navigation (↑/↓ arrows)
- Auto-scroll to bottom as content grows
- Visual feedback during command processing

### 2. **Easter Egg Commands (Server-Side)**
All commands are handled server-side at `/api/terminal` so users can't inspect them in client code:

#### Navigation Commands
- `skills` - Navigate to Skills District
- `projects` - Navigate to Projects Alley  
- `experience` - Navigate to Experience Avenue
- `education` - Navigate to Education Quarter
- `hub` - Return to Main Hub

#### Information Commands
- `help` - Show all available commands
- `whoami` - Display user/engineer information
- `date` - Show current date and time
- `ls` - List directory contents
- `pwd` - Print working directory
- `neofetch` - System information in ASCII art

#### Fun Easter Eggs
- `matrix` - Enter the Matrix with Neo quotes
- `coffee` - Get virtual coffee ☕
- `quote` - Random tech/programming quotes
- `hack` - Try to hack the mainframe (with funny response)
- `konami` - Konami code Easter egg 🎮
- `ping` - Ping the cyber.city server
- `sudo` - Try to use sudo (denied with humor)
- `rm -rf /` - Dangerous command (protected with humor)

#### Utility Commands
- `clear` - Clear terminal screen
- `[Enter]` on empty line - Does nothing (like real terminal)

### 3. **Smart Keyboard Navigation**
- **Terminal Focused:** WASD/Arrow keys type into terminal, navigation disabled
- **Terminal Unfocused:** WASD/Arrow keys navigate between sections
- **ESC Key:** Unfocuses terminal when focused, returns to hub when not
- Seamless switching between terminal mode and navigation mode

### 4. **UX Enhancements**
- Click anywhere on terminal body to focus input
- Placeholder text: "Type 'help' for commands..."
- Command disabled during processing (prevents spam)
- Custom cyan-glowing scrollbar
- Maintains all existing contact functionality (copy, download, social links)

---

## 🏗️ Architecture

### Files Modified/Created

#### 1. **`/src/routes/api/terminal/+server.js`** (NEW)
Server-side API endpoint that handles all terminal commands:
- Commands hidden from client-side inspection
- Returns typed responses with proper formatting
- Supports navigation redirects
- Handles clear screen command

#### 2. **`/src/lib/components/ContactTerminal.svelte`** (ENHANCED)
Enhanced terminal component:
- Added interactive input field
- Command execution via fetch API
- Command history (↑/↓ navigation)
- Auto-scroll to bottom
- Focus/blur event handlers
- Terminal click handler for easy focus

#### 3. **`/src/lib/utils/keyboard.js`** (ENHANCED)
Keyboard navigation utility updated:
- Added `isTerminalFocused` global flag
- Added `setTerminalFocused()` export function
- Navigation disabled when terminal is focused
- ESC key unfocuses terminal

#### 4. **`/src/routes/contact/+page.svelte`** (ENHANCED)
Contact page updated:
- Imports `setTerminalFocused` from keyboard utils
- Passes `onFocusChange` callback to ContactTerminal
- Resets terminal focus state on unmount

---

## 🎨 Visual Design

### Terminal Input Styling
- Green text (#00ff88) for user commands (matches hacker aesthetic)
- Cyan prompt symbol (`$`) 
- Blinking cyan cursor block (█)
- Transparent background (seamless with terminal)
- Placeholder text with reduced opacity

### Scrolling
- Max height: 600px (prevents infinite growth)
- Custom cyan scrollbar with glow effect
- Auto-scroll to bottom on new content
- Hover effect: scrollbar turns pink

### Response Types
Commands return different colored responses:
- `[SYS]` - Purple (system messages)
- `[OK]` - Green (success)
- `[FAIL]` - Pink (errors)
- `[INF]` - Yellow/Gold (information)

---

## 🔧 Technical Details

### Command Flow
1. User types command and presses Enter
2. Command added to terminal output with green text
3. API call to `/api/terminal` with command
4. Server processes and returns response
5. Response lines added to terminal output
6. Terminal scrolls to bottom
7. If navigation command, redirect after 2 seconds

### State Management
```javascript
let userInput = $state('');              // Current input value
let commandHistory = $state([]);         // Array of past commands
let historyIndex = $state(-1);           // Current position in history
let isProcessingCommand = $state(false); // Prevents spam
let terminalLines = $state([]);          // All terminal output
```

### Focus Management
```javascript
// Terminal component calls this on focus/blur
function handleTerminalFocusChange(focused) {
  setTerminalFocused(focused); // Updates global flag in keyboard.js
}
```

---

## 🧪 Testing Checklist

### Basic Functionality
- [x] Terminal input accepts text
- [x] Enter key executes command
- [x] Commands return proper responses
- [x] Terminal scrolls as content grows
- [x] Click terminal to focus input

### Command Testing
- [x] `help` - Shows all commands
- [x] `whoami` - Shows engineer info
- [x] Navigation commands work (skills, projects, etc.)
- [x] Easter eggs respond correctly (matrix, coffee, hack, etc.)
- [x] Invalid commands show "command not found"

### Keyboard Navigation
- [x] WASD navigation disabled when terminal focused
- [x] Arrow keys navigate history when terminal focused
- [x] ESC unfocuses terminal
- [x] WASD navigation works when terminal not focused
- [x] ESC returns to hub when terminal not focused

### Edge Cases
- [x] Empty command does nothing
- [x] Command during processing is disabled
- [x] Terminal unfocuses on page navigation
- [x] History navigation works correctly
- [x] Terminal maintains state during interaction

---

## 🚀 Usage Instructions

### For Users
1. Navigate to Contact page (press `D` or `→` from hub)
2. Wait for terminal animation to complete
3. Click anywhere on the terminal or start typing
4. Type `help` to see all available commands
5. Press `↑`/`↓` to navigate command history
6. Press `ESC` to exit terminal mode and resume WASD navigation

### Adding New Commands
Edit `/src/routes/api/terminal/+server.js`:

```javascript
const COMMANDS = {
  newcommand: {
    description: 'Description of command',
    response: [
      { type: 'success', text: 'Command executed!' },
      { type: 'info', text: 'Additional info' }
    ]
  }
};
```

Response types: `system`, `success`, `error`, `info`

Optional properties:
- `navigate: '/path'` - Redirects after 2 seconds
- `clear: true` - Clears terminal screen
- `response: () => [...]` - Dynamic responses (functions)

---

## 🎯 Future Enhancements (Optional)

- [ ] Tab completion for commands
- [ ] Command aliases (e.g., `h` for `help`)
- [ ] Persistent command history (localStorage)
- [ ] Terminal themes (color schemes)
- [ ] Typing sound effects
- [ ] Multi-line command support
- [ ] Command piping (`ls | grep`)
- [ ] More Easter eggs (discover over time)
- [ ] ASCII art responses
- [ ] Terminal recording/playback

---

## 📊 Impact

### User Experience
- **Engagement:** Users can explore and discover hidden features
- **Immersion:** Reinforces cyberpunk hacker theme
- **Interactivity:** Transforms static contact page into interactive experience
- **Discoverability:** Easter eggs encourage exploration

### Technical Benefits
- **Security:** Commands hidden server-side (can't be inspected)
- **Maintainability:** Easy to add/modify commands without client changes
- **Performance:** Minimal impact (only API calls on command execution)
- **Compatibility:** Works with existing keyboard navigation system

---

## 🐛 Known Issues

- None currently identified
- TypeScript warnings in keyboard.js and API (non-blocking, code works correctly)

---

## 📝 Notes

- Server must be running for commands to work (requires `/api/terminal` endpoint)
- Commands are case-insensitive
- Terminal clears on `clear` command only, not on navigation
- History persists during session but not across page reloads
- Mobile users can tap terminal to open keyboard

---

**Built with:** SvelteKit, JavaScript, Cyberpunk aesthetics ⚡

*"In the neon-lit streets of CyberCity, even the contact form is a terminal."* 🌃
