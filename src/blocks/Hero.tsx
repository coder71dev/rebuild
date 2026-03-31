import React from "react";
import { Type } from "lucide-react";
import { BlockDefinition } from "../types";
import { InlineEditable } from "../components/InlineEditable";

export const HeroBlock: BlockDefinition = {
  type: "hero",
  name: "Hero Section",
  icon: Type,
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
      default: "Welcome to our site",
    },
    {
      name: "subtitle",
      label: "Subtitle",
      type: "textarea",
      default: "Discover our amazing products and services.",
    },
    {
      name: "buttonText",
      label: "Button Text",
      type: "text",
      default: "Get Started",
    },
    { name: "buttonLink", label: "Button Link", type: "text", default: "#" },
    {
      name: "alignment",
      label: "Alignment",
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
      default: "center",
    },
    {
      name: "bgColor",
      label: "Background Color",
      type: "color",
      default: "#f3f4f6",
    },
    {
      name: "textColor",
      label: "Text Color",
      type: "color",
      default: "#111827",
    },
  ],
  component: ({ data, styles, onChange, onElementSelect }) => {
    const alignClass =
      data.alignment === "left"
        ? "text-left items-start"
        : data.alignment === "right"
          ? "text-right items-end"
          : "text-center items-center";

    return (
      <div
        style={{
          backgroundColor: data.bgColor,
          color: data.textColor,
          ...styles?.wrapper,
        }}
        className={`py-20 px-6 flex flex-col ${alignClass}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            onElementSelect?.("wrapper");
          }
        }}
      >
        <InlineEditable
          tagName="h1"
          value={data.title}
          onChange={(val) => onChange?.({ ...data, title: val })}
          onSelect={() => onElementSelect?.("title")}
          style={styles?.title}
          className="text-4xl md:text-6xl font-bold mb-4"
        />
        <InlineEditable
          tagName="p"
          value={data.subtitle}
          onChange={(val) => onChange?.({ ...data, subtitle: val })}
          onSelect={() => onElementSelect?.("subtitle")}
          style={styles?.subtitle}
          className="text-lg md:text-xl mb-8 max-w-2xl opacity-80"
        />
        {data.buttonText && (
          <InlineEditable
            tagName="a"
            value={data.buttonText}
            onChange={(val) => onChange?.({ ...data, buttonText: val })}
            onSelect={() => onElementSelect?.("button")}
            style={styles?.button}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-block"
          />
        )}
      </div>
    );
  },
};
