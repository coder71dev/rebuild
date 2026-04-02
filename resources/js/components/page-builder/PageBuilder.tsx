import React, { useEffect } from 'react';
import { usePageStore } from './store/PageStore';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { Inspector } from './Inspector';
import type { PageSchema } from './types';

export interface PageBuilderProps {
  initialSchema?: PageSchema;
  publishUrl: string;
  aiSuggestUrl: string;
}

export function PageBuilder({ initialSchema, publishUrl, aiSuggestUrl }: PageBuilderProps) {
  const addSection = usePageStore((s) => s.addSection);
  const viewport = usePageStore((s) => s.viewport);

  // Load initial schema into the store on first mount
  useEffect(() => {
    if (initialSchema) {
      initialSchema.sections.forEach((section) => addSection(section));
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register global keyboard shortcuts for undo / redo
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (!ctrlOrCmd) return;

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        usePageStore.temporal.getState().undo();
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault();
        usePageStore.temporal.getState().redo();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Toolbar publishUrl={publishUrl} />

      {/* Three-panel layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar — 240px fixed */}
        <div
          aria-label="Sidebar"
          style={{
            width: '240px',
            flexShrink: 0,
            borderRight: '1px solid #e5e7eb',
            overflowY: 'auto',
            background: '#f9fafb',
          }}
        >
          <Sidebar />
        </div>

        {/* Centre Canvas — flex-1 */}
        <div
          aria-label="Canvas"
          style={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Canvas viewport={viewport} />
        </div>

        {/* Right Inspector — 320px fixed */}
        <div
          aria-label="Inspector"
          style={{
            width: '320px',
            flexShrink: 0,
            borderLeft: '1px solid #e5e7eb',
            overflowY: 'auto',
            background: '#ffffff',
          }}
        >
          <Inspector aiSuggestUrl={aiSuggestUrl} />
        </div>
      </div>
    </div>
  );
}
