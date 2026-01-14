import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export function loadTheme(themes?: string[]): string {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const stylesDir = path.resolve(__dirname, './styles');

    // Default behavior if no themes provided
    const themeList = (themes && themes.length > 0) 
      ? themes 
      : ['astro-base.css', 'astro-theme-light.css'];

    let cssContent = '';

    for (const item of themeList) {
      let filePath = item;
      
      // If it looks like a simple filename (no path separators), check the internal styles dir first
      if (!item.includes('/') && !item.includes('\\')) {
         const internalPath = path.join(stylesDir, item);
         if (fs.existsSync(internalPath)) {
             filePath = internalPath;
         }
      }

      if (fs.existsSync(filePath)) {
        cssContent += fs.readFileSync(filePath, 'utf-8') + '\n';
      } else {
        console.warn(`Theme file not found: ${filePath} (original: ${item})`);
      }
    }

    return cssContent;
  } catch (e) {
    console.warn('Failed to load chart styles:', e);
    return '';
  }
}