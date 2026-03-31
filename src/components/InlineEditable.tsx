import React, { useEffect, useRef, useState } from "react";

interface Props {
  tagName: React.ElementType;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  onSelect?: () => void;
}

export function InlineEditable({
  tagName: Tag,
  value,
  onChange,
  className,
  style,
  placeholder,
  onSelect,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const ref = useRef<HTMLElement>(null);

  // Sync external value changes when not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (ref.current && ref.current.innerText !== value) {
      onChange(ref.current.innerText);
    }
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => {
        setIsEditing(true);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onBlur={handleBlur}
      className={`outline-none hover:ring-2 hover:ring-blue-400/50 focus:ring-2 focus:ring-blue-500 transition-all cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 ${className || ""}`}
      style={style}
      data-placeholder={placeholder || "Type here..."}
      dangerouslySetInnerHTML={{ __html: localValue }}
    />
  );
}
