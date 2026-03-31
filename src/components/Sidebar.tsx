import React, { useState, useEffect } from "react";
import { BlockData } from "../types";
import { blockRegistry } from "../blocks/registry";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Layers,
  Palette,
  Type as TypeIcon,
} from "lucide-react";
import { FieldEditor } from "./FieldEditor";
import { StyleEditor } from "./StyleEditor";

interface SidebarProps {
  blocks: BlockData[];
  selectedBlockId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (type: string) => void;
  onUpdate: (id: string, props: any) => void;
  onUpdateStyle: (id: string, elementKey: string, style: any) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  activeTab: "content" | "styles";
  setActiveTab: (tab: "content" | "styles") => void;
  selectedElementKey: string;
  setSelectedElementKey: (key: string) => void;
}

export function Sidebar({
  blocks,
  selectedBlockId,
  onSelect,
  onAdd,
  onUpdate,
  onUpdateStyle,
  onRemove,
  onMove,
  activeTab,
  setActiveTab,
  selectedElementKey,
  setSelectedElementKey,
}: SidebarProps) {
  const [view, setView] = useState<"layers" | "add">("layers");

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  useEffect(() => {
    if (selectedBlock) {
      const def = blockRegistry[selectedBlock.type];
      if (def && selectedElementKey) {
        if (Array.isArray(def.styleableElements)) {
          const isValid = def.styleableElements.some(
            (el) => el.key === selectedElementKey,
          );
          if (!isValid) {
            setSelectedElementKey("");
          }
        }
      }
    }
  }, [
    selectedBlockId,
    selectedBlock,
    selectedElementKey,
    setSelectedElementKey,
  ]);

  if (selectedBlock) {
    const def = blockRegistry[selectedBlock.type];
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <def.icon size={18} className="text-blue-600" />
            {def.name}
          </h2>
          <button
            onClick={() => onSelect(null)}
            className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 shrink-0">
          <button
            className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === "content" ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("content")}
          >
            <TypeIcon size={14} /> Content
          </button>
          <button
            className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === "styles" ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("styles")}
          >
            <Palette size={14} /> Styles
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === "content" ? (
            def.fields.map((field) => (
              <FieldEditor
                key={field.name}
                field={field}
                value={selectedBlock.props[field.name]}
                onChange={(val) =>
                  onUpdate(selectedBlock.id, {
                    ...selectedBlock.props,
                    [field.name]: val,
                  })
                }
              />
            ))
          ) : (
            <div>
              {(() => {
                const baseStyleableElements = typeof def.styleableElements === 'function'
                  ? def.styleableElements(selectedBlock.props, selectedBlock.styles)
                  : def.styleableElements || [];

                const displayElements = [...baseStyleableElements];
                if (selectedElementKey && !displayElements.some(el => el.key === selectedElementKey)) {
                  displayElements.push({ key: selectedElementKey, label: `Selected: ${selectedElementKey}` });
                }

                return displayElements.length > 0 ? (
                  <>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Select Element to Style
                    </label>
                    <select
                      value={selectedElementKey}
                      onChange={(e) => setSelectedElementKey(e.target.value)}
                      className="w-full mb-6 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Choose an element --</option>
                      {displayElements.map((el) => (
                        <option key={el.key} value={el.key}>
                          {el.label}
                        </option>
                      ))}
                    </select>

                    {selectedElementKey && (
                      <StyleEditor
                        style={selectedBlock.styles?.[selectedElementKey] || {}}
                        onChange={(newStyle) =>
                          onUpdateStyle(
                            selectedBlock.id,
                            selectedElementKey,
                            newStyle,
                          )
                        }
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    This section has no styleable elements defined.
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => onRemove(selectedBlock.id)}
            className="w-full py-2 px-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-md flex items-center justify-center gap-2 transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Remove Section
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${view === "layers" ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          onClick={() => setView("layers")}
        >
          Sections
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${view === "add" ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          onClick={() => setView("add")}
        >
          Add New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === "layers" ? (
          <div className="p-3 space-y-2">
            {blocks.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Layers className="mb-3 opacity-20" size={48} />
                <p className="text-sm">No sections yet.</p>
                <button
                  onClick={() => setView("add")}
                  className="mt-4 text-sm text-blue-600 font-medium hover:underline"
                >
                  Add your first section
                </button>
              </div>
            ) : (
              blocks.map((block, index) => {
                const def = blockRegistry[block.type];
                if (!def) return null;
                return (
                  <div
                    key={block.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedBlockId === block.id ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"}`}
                    onClick={() => onSelect(block.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-md ${selectedBlockId === block.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                      >
                        <def.icon size={16} />
                      </div>
                      <span className="font-medium text-sm text-gray-700">
                        {def.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMove(block.id, "up");
                        }}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMove(block.id, "down");
                        }}
                        disabled={index === blocks.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="p-3 grid grid-cols-2 gap-3">
            {Object.values(blockRegistry).map((def) => (
              <button
                key={def.type}
                onClick={() => {
                  onAdd(def.type);
                  setView("layers");
                }}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm transition-all gap-3 group"
              >
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors text-gray-500">
                  <def.icon size={24} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {def.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
