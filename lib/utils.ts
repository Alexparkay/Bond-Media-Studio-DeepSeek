import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
  "gray",
];

export const getPTag = () => {
  return `<p style="border-radius: 8px; text-align: center; font-size: 12px; color: #fff; margin-top: 16px;position: fixed; left: 8px; bottom: 8px; z-index: 10; background: rgba(0, 0, 0, 0.8); padding: 4px 8px;">Made with <img src="/bond-media-main-logo.svg" alt="Bond Media Studio Logo" style="width: 16px; height: 16px; vertical-align: middle;display:inline-block;margin-right:3px;filter:brightness(0) invert(1);"><a href="#" style="color: #fff;text-decoration: underline;" target="_blank" >Bond Media Studio</a></p>`;
};

/**
 * Injects JavaScript into HTML to handle navigation links within iframe
 * This prevents infinite loops and implements proper in-page navigation
 */
export const injectNavigationHandler = (html: string): string => {
  const navigationScript = `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        // Handle all link clicks
        document.addEventListener('click', function(e) {
          const link = e.target.closest('a');
          if (!link) return;
          
          const href = link.getAttribute('href');
          if (!href) return;
          
          // Handle hash links (scroll to sections)
          if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
          }
          
          // Handle internal navigation links (convert to hash links)
          const internalPages = ['features', 'pricing', 'about', 'contact', 'services', 'portfolio', 'team', 'blog'];
          const cleanHref = href.replace(/^\/+/, '').toLowerCase();
          
          if (internalPages.includes(cleanHref) || href.startsWith('/')) {
            e.preventDefault();
            
            // Try to find a section with matching id or data attribute
            let target = document.querySelector('#' + cleanHref) || 
                        document.querySelector('[data-section="' + cleanHref + '"]') ||
                        document.querySelector('section[id*="' + cleanHref + '"]') ||
                        document.querySelector('div[id*="' + cleanHref + '"]');
            
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              // If no specific section found, try to scroll to a section with similar content
              const allSections = document.querySelectorAll('section, div[class*="section"], .container, main > div');
              for (let section of allSections) {
                const text = section.textContent.toLowerCase();
                if (text.includes(cleanHref) || section.querySelector('h1, h2, h3')) {
                  const headings = section.querySelectorAll('h1, h2, h3');
                  for (let heading of headings) {
                    if (heading.textContent.toLowerCase().includes(cleanHref)) {
                      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      return;
                    }
                  }
                }
              }
              
              // If still no match, scroll to top
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
          }
          
          // Handle external links - prevent navigation that could cause loops
          if (href.includes('http') || href.includes('www.')) {
            e.preventDefault();
            // For demo purposes, we'll show an alert instead of opening external links
            alert('External link clicked: ' + href + '\\n\\nNote: External links are disabled in this demo.');
            return;
          }
          
          // Handle mailto and tel links normally
          if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            // Let these work normally
            return;
          }
          
          // For any other links, prevent default navigation
          e.preventDefault();
        });
        
        // Add smooth scrolling to existing hash links
        const hashLinks = document.querySelectorAll('a[href^="#"]');
        hashLinks.forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        });
      });
    </script>
  `;
  
  // Insert the script before the closing body tag
  if (html.includes('</body>')) {
    return html.replace('</body>', navigationScript + '\n</body>');
  } else if (html.includes('</html>')) {
    return html.replace('</html>', navigationScript + '\n</html>');
  } else {
    // If no body or html tag, append the script at the end
    return html + navigationScript;
  }
};
