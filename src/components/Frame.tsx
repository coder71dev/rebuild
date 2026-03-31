import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface FrameProps {
  children: React.ReactNode;
  className?: string;
}

export function Frame({ children, className }: FrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let observer: MutationObserver | null = null;

    const setupDocument = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Inject Tailwind CDN to support arbitrary pasted Tailwind classes
      // that might not be present in the parent's compiled CSS.
      if (!doc.getElementById('tailwind-cdn')) {
        const script = doc.createElement('script');
        script.id = 'tailwind-cdn';
        script.src = 'https://cdn.tailwindcss.com';
        doc.head.appendChild(script);
      }

      const updateStyles = () => {
        // Vite injects styles via CSSOM (insertRule), so cloneNode() on <style> 
        // tags often results in empty tags. We must extract the actual cssRules.
        let cssText = 'body { margin: 0; background: white; min-height: 100vh; }\n';

        // Copy standard link tags (e.g., Google Fonts)
        document.head.querySelectorAll('link[rel="stylesheet"]').forEach(node => {
          const href = (node as HTMLLinkElement).href;
          if (href && !doc.querySelector(`link[href="${href}"]`)) {
            doc.head.appendChild(node.cloneNode(true));
          }
        });

        // Extract all rules from parent stylesheets
        for (let i = 0; i < document.styleSheets.length; i++) {
          const sheet = document.styleSheets[i];
          try {
            const rules = sheet.cssRules || sheet.rules;
            if (rules) {
              for (let j = 0; j < rules.length; j++) {
                cssText += rules[j].cssText + '\n';
              }
            }
          } catch (e) {
            // Ignore cross-origin stylesheet errors
          }
        }

        let styleEl = doc.getElementById('sync-styles');
        if (!styleEl) {
          styleEl = doc.createElement('style');
          styleEl.id = 'sync-styles';
          doc.head.appendChild(styleEl);
        }
        
        if (styleEl.innerHTML !== cssText) {
          styleEl.innerHTML = cssText;
        }
      };

      updateStyles();

      // Debounce the observer to prevent performance issues on rapid DOM changes
      let timeout: ReturnType<typeof setTimeout>;
      observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(updateStyles, 50);
      });

      observer.observe(document.head, { childList: true, subtree: true });

      setMountNode(doc.body);
    };

    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      setupDocument();
    } else {
      iframe.addEventListener('load', setupDocument);
    }

    return () => {
      if (observer) observer.disconnect();
      iframe.removeEventListener('load', setupDocument);
    };
  }, []);

  return (
    <iframe 
      ref={iframeRef} 
      className={className} 
      title="Preview Frame" 
      srcDoc="<!DOCTYPE html><html><head></head><body></body></html>"
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}
