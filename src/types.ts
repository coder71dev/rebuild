import React from "react";

export type FieldType =
  | "text"
  | "textarea"
  | "color"
  | "select"
  | "image"
  | "list"
  | "code"
  | "elements";

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: FieldOption[];
  default?: any;
  subFields?: Field[]; // For list type
}

export interface StyleableElement {
  key: string;
  label: string;
}

export interface BlockProps {
  blockId: string;
  data: any;
  styles?: Record<string, React.CSSProperties>;
  onChange?: (newData: any) => void;
  onElementSelect?: (key: string) => void;
}

export interface BlockDefinition {
  type: string;
  name: string;
  icon: any; // LucideIcon
  fields: Field[];
  styleableElements?: StyleableElement[] | ((data: any, styles?: Record<string, React.CSSProperties>) => StyleableElement[]);
  component: React.FC<BlockProps>;
}

export interface BlockData {
  id: string;
  type: string;
  props: Record<string, any>;
  styles?: Record<string, React.CSSProperties>;
}

export interface PageData {
  title: string;
  blocks: BlockData[];
}
