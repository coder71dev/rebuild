/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BlockData } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Preview } from "./components/Preview";
import {
  Save,
  Monitor,
  Smartphone,
  Tablet,
  LayoutTemplate,
} from "lucide-react";
import { blockRegistry } from "./blocks/registry";

export default function App() {
  const [blocks, setBlocks] = useState<BlockData[]>([
    {
      id: "initial-hero",
      type: "hero",
      props: {
        title: "Welcome to the Page Builder",
        subtitle:
          "Select this section to edit its properties, or add new sections from the sidebar.",
        buttonText: "Start Building",
        buttonLink: "#",
        alignment: "center",
        bgColor: "#ffffff",
        textColor: "#111827",
      },
    },
    {
      id: "initial-features",
      type: "features",
      props: {
        title: "Why Choose Us",
        columns: "3",
        bgColor: "#f9fafb",
        items: [
          {
            title: "Live Editing",
            description: "See your changes instantly as you type.",
          },
          {
            title: "Drag & Drop",
            description: "Easily reorder sections to build the perfect layout.",
          },
          {
            title: "Export Ready",
            description: "Save your page data as JSON for your backend.",
          },
        ],
      },
    },
  ]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [activeTab, setActiveTab] = useState<"content" | "styles">("content");
  const [selectedElementKey, setSelectedElementKey] = useState<string>("");

  const handleBlockSelect = (id: string | null) => {
    setSelectedBlockId(id);
    setSelectedElementKey("");
  };

  const handleElementSelect = (blockId: string, key: string) => {
    setSelectedBlockId(blockId);
    setSelectedElementKey(key);
    setActiveTab("styles");
  };

  const addBlock = (type: string) => {
    const def = blockRegistry[type];
    if (!def) return;

    const newBlock: BlockData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      props: def.fields.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.default }),
        {},
      ),
    };
    setBlocks([...blocks, newBlock]);
    handleBlockSelect(newBlock.id);
  };

  const updateBlock = (id: string, props: any) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, props } : b)));
  };

  const updateBlockStyle = (
    id: string,
    elementKey: string,
    newStyle: React.CSSProperties,
  ) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            styles: {
              ...(b.styles || {}),
              [elementKey]: newStyle,
            },
          };
        }
        return b;
      }),
    );
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) handleBlockSelect(null);
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index < 0) return;
    if (direction === "up" && index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
      setBlocks(newBlocks);
    } else if (direction === "down" && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];
      setBlocks(newBlocks);
    }
  };

  const handleSave = () => {
    const pageData = { blocks };
    console.log("Saving page data:", JSON.stringify(pageData, null, 2));
    alert(
      "Page data saved! Check console for JSON output. This JSON can be passed to your Laravel Inertia backend.",
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 font-sans text-gray-900">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-inner">
            <LayoutTemplate size={18} />
          </div>
          <span className="font-semibold text-gray-800 tracking-tight">
            Page Builder
          </span>
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setPreviewMode("desktop")}
            className={`p-1.5 rounded-md transition-all ${previewMode === "desktop" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            title="Desktop Preview"
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => setPreviewMode("tablet")}
            className={`p-1.5 rounded-md transition-all ${previewMode === "tablet" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            title="Tablet Preview"
          >
            <Tablet size={18} />
          </button>
          <button
            onClick={() => setPreviewMode("mobile")}
            className={`p-1.5 rounded-md transition-all ${previewMode === "mobile" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            title="Mobile Preview"
          >
            <Smartphone size={18} />
          </button>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Save size={16} />
          Save Page
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelect={handleBlockSelect}
          onAdd={addBlock}
          onUpdate={updateBlock}
          onUpdateStyle={updateBlockStyle}
          onRemove={removeBlock}
          onMove={moveBlock}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedElementKey={selectedElementKey}
          setSelectedElementKey={setSelectedElementKey}
        />
        <Preview
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelect={handleBlockSelect}
          onUpdate={updateBlock}
          onElementSelect={handleElementSelect}
          previewMode={previewMode}
        />
      </div>
    </div>
  );
}
