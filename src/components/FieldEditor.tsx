import React from "react";
import { Field } from "../types";
import { X, Plus } from "lucide-react";
import { ElementsEditor } from "./ElementsEditor";

interface FieldEditorProps {
  key?: string | number;
  field: Field;
  value: any;
  onChange: (value: any) => void;
}

export function FieldEditor({ field, value, onChange }: FieldEditorProps) {
  if (field.type === "elements") {
    return (
      <ElementsEditor
        label={field.label}
        elements={value || []}
        onChange={onChange}
      />
    );
  }

  if (field.type === "text") {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }

  if (field.type === "code") {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-100"
          placeholder="Paste HTML here..."
        />
      </div>
    );
  }

  if (field.type === "color") {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
          />
        </div>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "list") {
    const items = value || [];
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          {field.label}
        </label>
        <div className="space-y-3">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 relative group"
            >
              <button
                onClick={() => {
                  const newItems = [...items];
                  newItems.splice(index, 1);
                  onChange(newItems);
                }}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove item"
              >
                <X size={14} />
              </button>
              <div className="space-y-2 mt-2">
                {field.subFields?.map((subField) => (
                  <div key={subField.name}>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">
                      {subField.label}
                    </label>
                    {subField.type === "text" ? (
                      <input
                        type="text"
                        value={item[subField.name] || ""}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index] = {
                            ...newItems[index],
                            [subField.name]: e.target.value,
                          };
                          onChange(newItems);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : subField.type === "textarea" ? (
                      <textarea
                        value={item[subField.name] || ""}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index] = {
                            ...newItems[index],
                            [subField.name]: e.target.value,
                          };
                          onChange(newItems);
                        }}
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newItem = field.subFields?.reduce(
                (acc, f) => ({ ...acc, [f.name]: f.default || "" }),
                {},
              );
              onChange([...items, newItem]);
            }}
            className="w-full py-2 border border-dashed border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1 bg-white"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>
    );
  }

  return null;
}
