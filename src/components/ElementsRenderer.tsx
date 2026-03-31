import React from "react";
import { ElementData } from "./ElementsEditor";

interface ElementsRendererProps {
  elements: ElementData[];
}

export function ElementsRenderer({ elements }: ElementsRendererProps) {
  if (!elements || elements.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {elements.map((el) => {
        const { type, props } = el;
        
        const alignClass = 
          props.align === "center" ? "mx-auto text-center justify-center" :
          props.align === "right" ? "ml-auto text-right justify-end" :
          "mr-auto text-left justify-start";

        switch (type) {
          case "heading":
            const Tag = props.level as keyof JSX.IntrinsicElements || "h2";
            const sizeClass = 
              props.level === "h1" ? "text-4xl md:text-5xl font-extrabold" :
              props.level === "h2" ? "text-3xl md:text-4xl font-bold" :
              props.level === "h3" ? "text-2xl md:text-3xl font-bold" :
              "text-xl md:text-2xl font-semibold";
            return (
              <Tag key={el.id} className={`${sizeClass} ${alignClass} w-full`} style={{ color: props.color }}>
                {props.text}
              </Tag>
            );
            
          case "text":
            return (
              <p key={el.id} className={`text-base md:text-lg ${alignClass} w-full leading-relaxed`} style={{ color: props.color }}>
                {props.text}
              </p>
            );
            
          case "image":
            const imgRoundedClass = 
              props.rounded === "full" ? "rounded-full" :
              props.rounded === "md" ? "rounded-xl" : "rounded-none";
            return (
              <div key={el.id} className={`flex w-full ${alignClass}`}>
                <img 
                  src={props.src} 
                  alt={props.alt || ""} 
                  className={`object-cover shadow-sm ${imgRoundedClass}`} 
                  style={{ width: props.width || "100%", maxWidth: "100%" }} 
                />
              </div>
            );
            
          case "video":
            const vidRoundedClass = 
              props.rounded === "full" ? "rounded-full" :
              props.rounded === "md" ? "rounded-xl" : "rounded-none";
            return (
              <div key={el.id} className={`flex w-full ${alignClass}`}>
                <video 
                  src={props.src} 
                  controls={props.controls} 
                  className={`shadow-sm ${vidRoundedClass}`} 
                  style={{ width: props.width || "100%", maxWidth: "100%" }} 
                />
              </div>
            );
            
          case "button":
            const btnVariantClass = 
              props.variant === "secondary" ? "bg-gray-200 text-gray-900 hover:bg-gray-300" :
              props.variant === "outline" ? "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50" :
              "bg-blue-600 text-white hover:bg-blue-700";
            return (
              <div key={el.id} className={`flex w-full ${alignClass}`}>
                <a 
                  href={props.link || "#"} 
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${btnVariantClass}`}
                >
                  {props.text}
                </a>
              </div>
            );
            
          default:
            return null;
        }
      })}
    </div>
  );
}
