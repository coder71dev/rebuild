import React from "react";
import { Layout } from "lucide-react";
import { BlockDefinition } from "../types";
import { ElementsRenderer } from "../components/ElementsRenderer";

export const SectionBlock: BlockDefinition = {
  type: "section",
  name: "Custom Section",
  icon: Layout,
  styleableElements: [
    { key: "wrapper", label: "Section Wrapper" },
    { key: "container", label: "Inner Container" },
  ],
  fields: [
    {
      name: "bgColor",
      label: "Background Color",
      type: "color",
      default: "#ffffff",
    },
    {
      name: "maxWidth",
      label: "Max Width",
      type: "select",
      options: [
        { label: "Small (640px)", value: "max-w-screen-sm" },
        { label: "Medium (768px)", value: "max-w-screen-md" },
        { label: "Large (1024px)", value: "max-w-screen-lg" },
        { label: "Extra Large (1280px)", value: "max-w-screen-xl" },
        { label: "Full Width", value: "max-w-full" },
      ],
      default: "max-w-screen-lg",
    },
    {
      name: "padding",
      label: "Vertical Padding",
      type: "select",
      options: [
        { label: "None", value: "py-0" },
        { label: "Small", value: "py-8" },
        { label: "Medium", value: "py-16" },
        { label: "Large", value: "py-24" },
        { label: "Extra Large", value: "py-32" },
      ],
      default: "py-16",
    },
    {
      name: "elements",
      label: "Section Elements",
      type: "elements",
      default: [],
    },
  ],
  component: ({ data, styles, onElementSelect }) => {
    return (
      <section
        style={{
          backgroundColor: data.bgColor,
          ...styles?.wrapper,
        }}
        className={`${data.padding || "py-16"} px-6 flex flex-col items-center w-full`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            onElementSelect?.("wrapper");
          }
        }}
      >
        <div 
          className={`w-full ${data.maxWidth || "max-w-screen-lg"} mx-auto`}
          style={styles?.container}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              onElementSelect?.("container");
            }
          }}
        >
          {(!data.elements || data.elements.length === 0) ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-400 bg-gray-50/50">
              <p className="text-sm font-medium">Empty Section</p>
              <p className="text-xs mt-1">Add elements from the sidebar to build this section.</p>
            </div>
          ) : (
            <ElementsRenderer elements={data.elements} />
          )}
        </div>
      </section>
    );
  },
};
