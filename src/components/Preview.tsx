import React from "react";
import { BlockData } from "../types";
import { blockRegistry } from "../blocks/registry";
import { Plus } from "lucide-react";
import { Frame } from "./Frame";

interface PreviewProps {
  blocks: BlockData[];
  selectedBlockId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, props: any) => void;
  onElementSelect: (blockId: string, key: string) => void;
  previewMode: "desktop" | "tablet" | "mobile";
}

export function Preview({
  blocks,
  selectedBlockId,
  onSelect,
  onUpdate,
  onElementSelect,
  previewMode,
}: PreviewProps) {
  const getPreviewClasses = () => {
    switch (previewMode) {
      case "mobile":
        return "w-[375px] h-[812px] shadow-2xl rounded-xl border border-gray-200 my-4 md:my-8 shrink-0";
      case "tablet":
        return "w-[768px] h-[1024px] shadow-2xl rounded-xl border border-gray-200 my-4 md:my-8 shrink-0";
      case "desktop":
      default:
        return "w-full h-full border-0";
    }
  };

  return (
    <div className={`flex-1 bg-gray-100 overflow-y-auto flex justify-center ${previewMode === "desktop" ? "items-stretch" : "items-start p-4 md:p-8"}`}>
      <div
        className={`${getPreviewClasses()} bg-white overflow-hidden flex flex-col transition-all duration-300 ease-in-out relative`}
      >
        {/* Content Area */}
        <Frame className="w-full h-full flex-1 border-0 bg-white block">
          <div
            className="flex-1 relative bg-white min-h-screen"
            onClick={() => onSelect(null)}
          >
            {blocks.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col gap-4">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50">
                <Plus size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium">
                Add sections from the sidebar to build your page
              </p>
            </div>
          ) : (
            blocks.map((block) => {
              const def = blockRegistry[block.type];
              if (!def) return null;
              const isSelected = selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  className={`relative group cursor-pointer transition-all duration-200 ${isSelected ? "ring-2 ring-blue-500 ring-inset z-10" : "hover:ring-2 hover:ring-blue-300 hover:ring-inset z-0"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(block.id);
                  }}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-br-md z-20 shadow-sm flex items-center gap-1">
                      <def.icon size={12} />
                      {def.name}
                    </div>
                  )}
                  <div
                    className={
                      isSelected
                        ? "opacity-100"
                        : "opacity-100 group-hover:opacity-95"
                    }
                  >
                    <def.component
                      blockId={block.id}
                      data={block.props}
                      styles={block.styles}
                      onChange={(newData) => onUpdate(block.id, newData)}
                      onElementSelect={(key) => onElementSelect(block.id, key)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
        </Frame>
      </div>
    </div>
  );
}
