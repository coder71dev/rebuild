import React from "react";
import { List } from "lucide-react";
import { BlockDefinition } from "../types";
import { InlineEditable } from "../components/InlineEditable";

export const FeaturesBlock: BlockDefinition = {
  type: "features",
  name: "Features Grid",
  icon: List,
  styleableElements: [
    { key: "wrapper", label: "Section Wrapper" },
    { key: "title", label: "Section Title" },
    { key: "card", label: "Feature Card" },
    { key: "cardTitle", label: "Feature Title" },
    { key: "cardDesc", label: "Feature Description" },
  ],
  fields: [
    {
      name: "title",
      label: "Section Title",
      type: "text",
      default: "Our Features",
    },
    {
      name: "columns",
      label: "Columns",
      type: "select",
      options: [
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
      default: "3",
    },
    {
      name: "bgColor",
      label: "Background Color",
      type: "color",
      default: "#ffffff",
    },
    {
      name: "items",
      label: "Feature Items",
      type: "list",
      subFields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          default: "Feature Title",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          default: "Feature description goes here.",
        },
      ],
      default: [
        {
          title: "Fast Performance",
          description: "Optimized for speed and efficiency.",
        },
        {
          title: "Secure by Default",
          description: "Built with enterprise-grade security.",
        },
        {
          title: "24/7 Support",
          description: "Our team is always here to help you.",
        },
      ],
    },
  ],
  component: ({ data, styles, onChange, onElementSelect }) => {
    const cols =
      data.columns === "2"
        ? "md:grid-cols-2"
        : data.columns === "4"
          ? "md:grid-cols-4"
          : "md:grid-cols-3";

    return (
      <div
        style={{ backgroundColor: data.bgColor, ...styles?.wrapper }}
        className="py-16 px-6 text-gray-900"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            onElementSelect?.("wrapper");
          }
        }}
      >
        <div className="max-w-6xl mx-auto">
          {data.title && (
            <InlineEditable
              tagName="h2"
              value={data.title}
              onChange={(val) => onChange?.({ ...data, title: val })}
              onSelect={() => onElementSelect?.("title")}
              style={styles?.title}
              className="text-3xl font-bold text-center mb-12"
            />
          )}
          <div className={`grid grid-cols-1 ${cols} gap-8`}>
            {data.items?.map((item: any, i: number) => (
              <div
                key={i}
                style={styles?.card}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    e.stopPropagation();
                    onElementSelect?.("card");
                  }
                }}
                className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <InlineEditable
                  tagName="h3"
                  value={item.title}
                  onChange={(val) => {
                    const newItems = [...data.items];
                    newItems[i] = { ...item, title: val };
                    onChange?.({ ...data, items: newItems });
                  }}
                  onSelect={() => onElementSelect?.("cardTitle")}
                  style={styles?.cardTitle}
                  className="text-xl font-semibold mb-3"
                />
                <InlineEditable
                  tagName="p"
                  value={item.description}
                  onChange={(val) => {
                    const newItems = [...data.items];
                    newItems[i] = { ...item, description: val };
                    onChange?.({ ...data, items: newItems });
                  }}
                  onSelect={() => onElementSelect?.("cardDesc")}
                  style={styles?.cardDesc}
                  className="text-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
