import React, { useState } from "react";
import { Plus, X, Type, Heading, Image as ImageIcon, Video, MousePointerClick, ChevronUp, ChevronDown } from "lucide-react";

export type ElementType = "text" | "heading" | "image" | "video" | "button";

export interface ElementData {
  id: string;
  type: ElementType;
  props: any;
}

interface ElementsEditorProps {
  label: string;
  elements: ElementData[];
  onChange: (elements: ElementData[]) => void;
}

const ELEMENT_TYPES: { type: ElementType; label: string; icon: any; defaultProps: any }[] = [
  { type: "heading", label: "Heading", icon: Heading, defaultProps: { text: "New Heading", level: "h2", align: "left", color: "#111827" } },
  { type: "text", label: "Text", icon: Type, defaultProps: { text: "Add your text here...", align: "left", color: "#4B5563" } },
  { type: "image", label: "Image", icon: ImageIcon, defaultProps: { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", alt: "Placeholder", width: "100%", rounded: "none" } },
  { type: "video", label: "Video", icon: Video, defaultProps: { src: "https://www.w3schools.com/html/mov_bbb.mp4", controls: true, width: "100%", rounded: "none" } },
  { type: "button", label: "Button", icon: MousePointerClick, defaultProps: { text: "Click Me", link: "#", variant: "primary", align: "left" } },
];

export function ElementsEditor({ label, elements = [], onChange }: ElementsEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addElement = (type: ElementType) => {
    const def = ELEMENT_TYPES.find((t) => t.type === type);
    if (!def) return;
    
    const newElement: ElementData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      props: { ...def.defaultProps },
    };
    
    onChange([...(elements || []), newElement]);
    setShowAddMenu(false);
  };

  const updateElement = (id: string, props: any) => {
    onChange(elements.map((el) => (el.id === id ? { ...el, props } : el)));
  };

  const removeElement = (id: string) => {
    onChange(elements.filter((el) => el.id !== id));
  };

  const moveElement = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const newElements = [...elements];
      [newElements[index - 1], newElements[index]] = [newElements[index], newElements[index - 1]];
      onChange(newElements);
    } else if (direction === "down" && index < elements.length - 1) {
      const newElements = [...elements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      onChange(newElements);
    }
  };

  const renderElementFields = (el: ElementData) => {
    switch (el.type) {
      case "heading":
        return (
          <>
            <input type="text" value={el.props.text} onChange={(e) => updateElement(el.id, { ...el.props, text: e.target.value })} className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-xs" placeholder="Heading text" />
            <div className="flex gap-2">
              <select value={el.props.level} onChange={(e) => updateElement(el.id, { ...el.props, level: e.target.value })} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs">
                <option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option>
              </select>
              <select value={el.props.align} onChange={(e) => updateElement(el.id, { ...el.props, align: e.target.value })} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs">
                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
              </select>
            </div>
          </>
        );
      case "text":
        return (
          <>
            <textarea value={el.props.text} onChange={(e) => updateElement(el.id, { ...el.props, text: e.target.value })} rows={3} className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-xs" placeholder="Text content" />
            <select value={el.props.align} onChange={(e) => updateElement(el.id, { ...el.props, align: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded text-xs">
              <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
            </select>
          </>
        );
      case "image":
      case "video":
        return (
          <>
            <input type="text" value={el.props.src} onChange={(e) => updateElement(el.id, { ...el.props, src: e.target.value })} className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-xs" placeholder="Media URL" />
            <div className="flex gap-2">
              <input type="text" value={el.props.width} onChange={(e) => updateElement(el.id, { ...el.props, width: e.target.value })} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs" placeholder="Width (e.g. 100%, 300px)" />
              <select value={el.props.rounded} onChange={(e) => updateElement(el.id, { ...el.props, rounded: e.target.value })} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs">
                <option value="none">Square</option><option value="md">Rounded</option><option value="full">Circle</option>
              </select>
            </div>
          </>
        );
      case "button":
        return (
          <>
            <input type="text" value={el.props.text} onChange={(e) => updateElement(el.id, { ...el.props, text: e.target.value })} className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-xs" placeholder="Button text" />
            <input type="text" value={el.props.link} onChange={(e) => updateElement(el.id, { ...el.props, link: e.target.value })} className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-xs" placeholder="Link URL" />
            <div className="flex gap-2">
              <select value={el.props.variant} onChange={(e) => updateElement(el.id, { ...el.props, variant: e.target.value })} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs">
                <option value="primary">Primary</option><option value="secondary">Secondary</option><option value="outline">Outline</option>
              </select>
              <select value={el.props.align} onChange={(e) => updateElement(el.id, { ...el.props, align: e.target.value })} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs">
                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <label className="block text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">
        {label}
      </label>
      
      <div className="space-y-3 mb-3">
        {(elements || []).map((el, index) => {
          const def = ELEMENT_TYPES.find(t => t.type === el.type);
          const Icon = def?.icon || Type;
          
          return (
            <div key={el.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 relative group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <Icon size={14} /> {def?.label}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveElement(index, "up")} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp size={14} /></button>
                  <button onClick={() => moveElement(index, "down")} disabled={index === elements.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown size={14} /></button>
                  <button onClick={() => removeElement(el.id)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button>
                </div>
              </div>
              {renderElementFields(el)}
            </div>
          );
        })}
      </div>

      <div className="relative">
        {showAddMenu ? (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
            <div className="p-2 grid grid-cols-2 gap-1">
              {ELEMENT_TYPES.map((def) => (
                <button
                  key={def.type}
                  onClick={() => addElement(def.type)}
                  className="flex items-center gap-2 p-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-left"
                >
                  <def.icon size={14} /> {def.label}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowAddMenu(false)}
              className="w-full p-2 border-t border-gray-100 text-xs text-center text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : null}
        <button
          onClick={() => setShowAddMenu(true)}
          className="w-full py-2 border border-dashed border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1 bg-white"
        >
          <Plus size={14} /> Add Element
        </button>
      </div>
    </div>
  );
}
