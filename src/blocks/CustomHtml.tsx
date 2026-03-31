import React from "react";
import { Code } from "lucide-react";
import { BlockDefinition } from "../types";

function getCssSelector(el: HTMLElement, boundary: HTMLElement): string {
  if (el === boundary) return "wrapper";
  let path = [];
  let current: HTMLElement | null = el;
  while (current && current !== boundary) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    } else {
      let sibling = current;
      let nth = 1;
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling as HTMLElement;
        if (sibling.tagName === current.tagName) nth++;
      }
      selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    current = current.parentElement;
  }
  return path.join(" > ");
}

function cssPropertiesToString(styles: React.CSSProperties) {
  return Object.entries(styles).map(([k, v]) => {
    const cssKey = k.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
    return `${cssKey}: ${v};`;
  }).join(" ");
}

export const CustomHtmlBlock: BlockDefinition = {
  type: "customHtml",
  name: "Custom HTML",
  icon: Code,
  styleableElements: (data, styles) => {
    const elements = [{ key: "wrapper", label: "Section Wrapper" }];
    if (styles) {
      Object.keys(styles).forEach(key => {
        if (key !== "wrapper") {
          elements.push({ key, label: `Element: ${key}` });
        }
      });
    }
    return elements;
  },
  fields: [
    {
      name: "html",
      label: "HTML Code",
      type: "code",
      default:
        '<div class="p-8 text-center bg-gray-50 rounded-xl border border-gray-200">\n  <h2 class="text-2xl font-bold text-gray-800 mb-2">Custom HTML Section</h2>\n  <p class="text-gray-600">Paste your Tailwind CSS HTML structure here.</p>\n</div>',
    },
    {
      name: "bgColor",
      label: "Background Color",
      type: "color",
      default: "transparent",
    },
  ],
  component: ({ blockId, data, styles, onElementSelect, onChange }) => {
    const innerStyles = styles ? Object.entries(styles).filter(([k]) => k !== "wrapper").map(([selector, cssProps]) => {
      return `#block-${blockId} ${selector} { ${cssPropertiesToString(cssProps)} }`;
    }).join("\n") : "";

    return (
      <>
        {innerStyles && <style>{innerStyles}</style>}
        <div
          id={`block-${blockId}`}
          style={{ backgroundColor: data.bgColor, ...styles?.wrapper }}
          onClick={(e) => {
            e.stopPropagation();
            const selector = getCssSelector(e.target as HTMLElement, e.currentTarget);
            onElementSelect?.(selector);
          }}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            onChange?.({ ...data, html: e.currentTarget.innerHTML });
          }}
          className="relative group/html cursor-pointer outline-none"
          dangerouslySetInnerHTML={{ __html: data.html || "" }}
        />
      </>
    );
  },
};
