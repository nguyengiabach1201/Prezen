import { BrowserFinder } from '@agent-infra/browser-finder';

const finder = new BrowserFinder();

// Find any available browser (tries Chrome -> Edge -> Firefox)
const browser = finder.findBrowser();
console.log(browser.path); // "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
console.log(browser.type); // "chrome"