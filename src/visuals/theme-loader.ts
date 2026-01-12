import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export function loadTheme(customThemePath?: string): string {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Default Styles Path (relative to this loader file)
    // Assuming structure: src/visuals/theme-loader.ts -> ../styles/
    const stylesDir = path.resolve(__dirname, '../styles');
    
    const base = fs.readFileSync(path.join(stylesDir, 'astro-base.css'), 'utf-8');
    const defaultTheme = fs.readFileSync(path.join(stylesDir, 'astro-theme-light.css'), 'utf-8');
    
    let userTheme = '';
    if (customThemePath) {
      if (fs.existsSync(customThemePath)) {
        userTheme = fs.readFileSync(customThemePath, 'utf-8');
      } else {
        console.warn(`Custom theme file not found: ${customThemePath}`);
      }
    }

    // Combine: Default Vars + Base Rules + (Optional Override Vars)
    // User theme comes last to override variables.
    return defaultTheme + '\n' + base + '\n' + userTheme;
  } catch (e) {
    console.warn('Failed to load chart styles:', e);
    return '';
  }
}
