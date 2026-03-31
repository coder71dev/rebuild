import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { BlockDefinition } from "../types";
import { InlineEditable } from "../components/InlineEditable";

export const ImageTextBlock: BlockDefinition = {
  type: "imageText",
  name: "Image & Text",
  icon: ImageIcon,
  styleableElements: [
    { key: "wrapper", label: "Section Wrapper" },
    { key: "title", label: "Title" },
    { key: "content", label: "Content" },
    { key: "image", label: "Image" },
  ],
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      default: "Discover Our Story",
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      default:
        "We build amazing products that help you grow your business and achieve your goals faster than ever before.",
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text",
      default:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "imagePosition",
      label: "Image Position",
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
      default: "right",
    },
    {
      name: "bgColor",
      label: "Background Color",
      type: "color",
      default: "#ffffff",
    },
  ],
  component: ({ data, styles, onChange, onElementSelect }) => {
    const isLeft = data.imagePosition === "left";
    return (
      <div
        style={{ backgroundColor: data.bgColor, ...styles?.wrapper }}
        className="py-16 px-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            onElementSelect?.("wrapper");
          }
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div
            className={`w-full md:w-1/2 ${isLeft ? "md:order-1" : "md:order-2"}`}
          >
            <img
              src={data.imageUrl}
              alt={data.title}
              style={styles?.image}
              onClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("image");
              }}
              className="w-full h-auto rounded-2xl shadow-lg object-cover aspect-[4/3] cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all"
            />
          </div>
          <div
            className={`w-full md:w-1/2 ${isLeft ? "md:order-2" : "md:order-1"}`}
          >
            <InlineEditable
              tagName="h2"
              value={data.title}
              onChange={(val) => onChange?.({ ...data, title: val })}
              onSelect={() => onElementSelect?.("title")}
              style={styles?.title}
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
            />
            <InlineEditable
              tagName="p"
              value={data.content}
              onChange={(val) => onChange?.({ ...data, content: val })}
              onSelect={() => onElementSelect?.("content")}
              style={styles?.content}
              className="text-lg text-gray-600 leading-relaxed"
            />
          </div>
        </div>
      </div>
    );
  },
};
