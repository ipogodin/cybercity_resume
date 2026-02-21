# CyberCity CV Review Plan

This document contains a list of vulnerabilities, code style flaws, and improvement suggestions found during the review of the CyberCity CV project. We will go over these items one by one and mark them as done.

## 1. Vulnerabilities
- [x] **Potential API Server Error (DDoS vector):** In `src/routes/api/terminal/+server.js`, `command.trim()` will throw an exception if `command` is sent as an array or object instead of a string, causing a 500 error.
- [x] **Missing Content Security Policy (CSP):** The project lacks robust HTTP headers or meta tags for CSP. Adding CSP will protect against unexpected XSS or data injections.
- [x] **Missing Rate Limiting:** The terminal API endpoint (`/api/terminal`) has no rate-limiting, which could be spammed.

## 2. Code Style Flaws
- [x] **Inline Hardcoded Configs:** `src/routes/+page.svelte` has hardcoded literal values for tutorial timings (`1600`, `4000`, `20`, `100`). These should be moved to a configuration file or constants.
- [x] **Unnecessary Array Re-creations:** `getHubSigns()` is called in the template and creates a new array configuration on every call. It should be defined as a static constant outside the component logic or as a reactive derived value.
- [x] **onMount Cleanup Pattern:** In `+page.svelte`, the `cleanup` function assigned in `onMount` can simply be returned from the `onMount` callback itself, which is the idiomatic Svelte way to handle component destruction cleanup.

## 3. Improvement Suggestions
- [x] **SEO & OpenGraph Tags:** `src/app.html` (and specific route `<svelte:head>` blocks) lack meta descriptions and OG tags (social share images). This is essential for a CV shared on platforms like LinkedIn.
- [x] **Accessibility (A11y):** The terminal `<input>` in `ContactTerminal.svelte` lacks a distinct `aria-label` or `<label>` tag for screen readers.
- [x] **Asset Preloading:** Background scenes (like `/images/scenes/main_hub_scene.png`) should be explicitly preloaded in `<svelte:head>` to eliminate flickering when the user first reaches the application.
- [x] **Terminal Tab Completion Feature:** In `ContactTerminal.svelte` (Line 215), the `Tab` key event is intercepted but tab completion isn't implemented. Adding this would enhance the hacker aesthetic.
