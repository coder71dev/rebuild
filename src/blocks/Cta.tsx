import React from "react";
import { Megaphone } from "lucide-react";
import { BlockDefinition } from "../types";
import { InlineEditable } from "../components/InlineEditable";

export const CtaBlock: BlockDefinition = {
  type: "cta",
  name: "Call to Action",
  icon: Megaphone,
  styleableElements: [
    { key: "wrapper", label: "Section Wrapper" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle" },
    { key: "button", label: "Button" },
  ],
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      default: "Ready to get started?",
    },
    {
      name: "subtitle",
      label: "Subtitle",
      type: "text",
      default: "Join thousands of satisfied customers today.",
    },
    {
      name: "buttonText",
      label: "Button Text",
      type: "text",
      default: "Sign Up Now",
    },
    { name: "buttonLink", label: "Button Link", type: "text", default: "#" },
    {
      name: "bgColor",
      label: "Background Color",
      type: "color",
      default: "#2563eb",
    },
    {
      name: "textColor",
      label: "Text Color",
      type: "color",
      default: "#ffffff",
    },
  ],
  component: ({ data, styles, onChange, onElementSelect }) => {
    return (
      <div
        style={{
          backgroundColor: data.bgColor,
          color: data.textColor,
          ...styles?.wrapper,
        }}
        className="py-20 px-6 text-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            onElementSelect?.("wrapper");
          }
        }}
      >
        <div className="max-w-4xl mx-auto">
          <InlineEditable
            tagName="h2"
            value={data.title}
            onChange={(val) => onChange?.({ ...data, title: val })}
            onSelect={() => onElementSelect?.("title")}
            style={styles?.title}
            className="text-3xl md:text-5xl font-bold mb-4"
          />
          <InlineEditable
            tagName="p"
            value={data.subtitle}
            onChange={(val) => onChange?.({ ...data, subtitle: val })}
            onSelect={() => onElementSelect?.("subtitle")}
            style={styles?.subtitle}
            className="text-xl opacity-90 mb-8"
          />
          <InlineEditable
            tagName="a"
            value={data.buttonText}
            onChange={(val) => onChange?.({ ...data, buttonText: val })}
            onSelect={() => onElementSelect?.("button")}
            style={styles?.button}
            className="inline-block px-8 py-4 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          />
        </div>
      </div>
    );
  },
};
