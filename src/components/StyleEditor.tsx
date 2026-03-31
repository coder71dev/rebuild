import React from "react";

interface Props {
  style: React.CSSProperties;
  onChange: (style: React.CSSProperties) => void;
}

export function StyleEditor({ style, onChange }: Props) {
  const handleChange = (key: keyof React.CSSProperties, value: string) => {
    const newStyle = { ...style };
    if (!value) {
      delete newStyle[key];
    } else {
      (newStyle as any)[key] = value;
    }
    onChange(newStyle);
  };

  return (
    <div className="space-y-5">
      {/* Margin */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Margin
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Top (e.g. 1rem)"
            value={style.marginTop || ""}
            onChange={(e) => handleChange("marginTop", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Right"
            value={style.marginRight || ""}
            onChange={(e) => handleChange("marginRight", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Bottom"
            value={style.marginBottom || ""}
            onChange={(e) => handleChange("marginBottom", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Left"
            value={style.marginLeft || ""}
            onChange={(e) => handleChange("marginLeft", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Padding
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Top (e.g. 1rem)"
            value={style.paddingTop || ""}
            onChange={(e) => handleChange("paddingTop", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Right"
            value={style.paddingRight || ""}
            onChange={(e) => handleChange("paddingRight", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Bottom"
            value={style.paddingBottom || ""}
            onChange={(e) => handleChange("paddingBottom", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Left"
            value={style.paddingLeft || ""}
            onChange={(e) => handleChange("paddingLeft", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
            Text Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.color || "#000000"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-8 h-8 cursor-pointer rounded border-0 p-0"
            />
            <input
              type="text"
              placeholder="#000000"
              value={style.color || ""}
              onChange={(e) => handleChange("color", e.target.value)}
              className="flex-1 w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
            Background
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.backgroundColor || "#ffffff"}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="w-8 h-8 cursor-pointer rounded border-0 p-0"
            />
            <input
              type="text"
              placeholder="#ffffff"
              value={style.backgroundColor || ""}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="flex-1 w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase"
            />
          </div>
        </div>
      </div>

      {/* Border & Radius */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Border Radius
        </label>
        <input
          type="text"
          placeholder="e.g. 8px, 50%, 1rem"
          value={style.borderRadius || ""}
          onChange={(e) => handleChange("borderRadius", e.target.value)}
          className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Border
        </label>
        <input
          type="text"
          placeholder="e.g. 1px solid #e5e7eb"
          value={style.border || ""}
          onChange={(e) => handleChange("border", e.target.value)}
          className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Typography */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Typography
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Font Size (e.g. 1.5rem)"
            value={style.fontSize || ""}
            onChange={(e) => handleChange("fontSize", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Font Weight (e.g. 600)"
            value={style.fontWeight || ""}
            onChange={(e) => handleChange("fontWeight", e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
