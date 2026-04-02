# Implementation Plan: Visual Page Builder

## Overview

Incremental delivery across three phases. Each phase produces a working, integrated slice of the builder. TypeScript + React 18 on the frontend; Laravel 13 + PHPUnit on the backend.

---

## Phase 1 — Core Scaffold

### Tasks

- [x] 1. Define core TypeScript types and data models
  - Create `resources/js/components/page-builder/types.ts` with `NodeId`, `Viewport`, `SectionNode`, and `PageSchema` interfaces
  - Export all types from a barrel file
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.1 Write property test for SectionNode structural invariant
    - **Property 3: SectionNode structural invariant**
    - **Validates: Requirements 2.2, 4.4**

- [x] 2. Implement PageStore with Zustand and zundo
  - Create `resources/js/components/page-builder/store/PageStore.ts`
  - Implement all actions: `addSection`, `removeSection`, `reorderSections`, `updateNode`, `selectNode`, `deselectNode`, `setViewport`, `importHtmlSection`, `duplicateSection`, `exportSchema`
  - Wrap with `zundo` temporal middleware, history limit 50
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 13.1, 13.4_

  - [x] 2.1 Write property test for NodeId uniqueness invariant
    - **Property 1: SectionNode uniqueness invariant**
    - **Validates: Requirements 2.3, 5.3**

  - [x] 2.2 Write property test for exportSchema round-trip
    - **Property 2: PageStore serialisation round-trip**
    - **Validates: Requirements 2.5, 11.2, 11.3**

  - [x] 2.3 Write property test for store state setter correctness
    - **Property 4: Store state setter correctness**
    - **Validates: Requirements 3.2, 3.3**

  - [x] 2.4 Write property test for section reorder correctness
    - **Property 6: Section reorder correctness**
    - **Validates: Requirements 5.6**

  - [x] 2.5 Write property test for delete removes section and all descendants
    - **Property 7: Delete removes section and all descendants**
    - **Validates: Requirements 5.4**

  - [x] 2.6 Write property test for duplicate produces new unique NodeIds
    - **Property 8: Duplicate produces new unique NodeIds**
    - **Validates: Requirements 5.3**

  - [x] 2.7 Write property test for export schema excludes UI-only metadata
    - **Property 9: Export schema excludes UI-only metadata**
    - **Validates: Requirements 5.7, 11.2**

- [x] 3. Implement preset section factories
  - Create `resources/js/components/page-builder/presets/hero.ts`, `features.ts`, `cta.ts`
  - Each factory returns a fully-formed `SectionNode` with `type: 'preset'`, default `classes`, and `children`
  - _Requirements: 4.1, 4.2, 4.4_

  - [x] 3.1 Write property test for preset addition appends correct type
    - **Property 5: Preset addition appends correct type**
    - **Validates: Requirements 4.2, 4.4**

- [x] 4. Build three-panel layout and Toolbar shell
  - Create `resources/js/components/page-builder/PageBuilder.tsx` with the root three-panel flex layout (Sidebar 240px, Canvas flex-1, Inspector 320px)
  - Create `resources/js/components/page-builder/Toolbar.tsx` with viewport toggle icons, Undo/Redo buttons, and Publish button (wired to store actions)
  - Register global `keydown` listeners for `Ctrl+Z` / `Ctrl+Shift+Z` in `PageBuilder`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.6, 3.7_

  - [x] 4.1 Write unit tests for keyboard shortcuts
    - Test `Ctrl+Z` triggers undo and `Ctrl+Shift+Z` triggers redo
    - _Requirements: 3.6, 3.7_

- [x] 5. Build Sidebar with preset cards
  - Create `resources/js/components/page-builder/Sidebar.tsx`
  - Render Hero, Features, CTA as clickable cards that dispatch `addSection` with the corresponding factory output
  - Render primitive list items as drag sources (stub drag behaviour — full DnD wired in Phase 3)
  - Include "Paste HTML" button (opens modal — wired in Phase 2)
  - _Requirements: 4.1, 4.2, 4.3_

  - [x] 5.1 Write unit test for Sidebar preset and primitive listing
    - Verify all three presets and all eight primitives are rendered
    - _Requirements: 4.1, 9.1_

- [x] 6. Build Canvas with SectionRenderer and SectionHeader
  - Create `resources/js/components/page-builder/Canvas.tsx` and `SectionRenderer.tsx`
  - `SectionRenderer` recursively renders the `SectionNode` tree, merging `classes` and `overrides[activeBreakpoint]` into `style`
  - Set `contenteditable="true"` on text-bearing tags (`h1–h6`, `p`, `span`, `a`, `li`, `button`)
  - Render selection outline (2px solid #3B82F6) on the selected node
  - Create `SectionHeader.tsx` with collapse toggle, duplicate, and delete actions
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.3, 6.8_

  - [x] 6.1 Write property test for contenteditable applied to text-bearing nodes only
    - **Property 10: contenteditable applied to text-bearing nodes only**
    - **Validates: Requirements 6.1, 6.3**

  - [x] 6.2 Write unit tests for SectionHeader actions
    - Test collapse toggle hides content, duplicate inserts copy, delete removes section
    - _Requirements: 5.2, 5.3, 5.4_

- [x] 7. Implement inline editing with commit and debounce
  - Wire `onBlur` on `contenteditable` elements to dispatch `updateNode` with the new `textContent`
  - Wire `onInput` with a 150ms debounce to dispatch `updateNode` per keystroke
  - Wire click-outside on Canvas to dispatch `deselectNode`
  - _Requirements: 6.2, 6.5, 6.6, 6.7_

  - [x] 7.1 Write unit tests for inline editing behaviour
    - Test blur commits textContent, debounce fires at 150ms, click-outside deselects
    - _Requirements: 6.5, 6.6, 6.7_

- [x] 8. Build Inspector with three tabs and style controls
  - Create `resources/js/components/page-builder/Inspector.tsx` with Content, Style, and Layout tabs
  - Implement Typography, Colour & Background, Spacing, Border & Radius, Size & Layout, and Effects control groups
  - Each control change dispatches `updateNode` with the updated `overrides` patch
  - Implement "Reset to default" that removes the property from `overrides`
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10_

  - [x] 8.1 Write property test for Inspector override applied to correct breakpoint key
    - **Property 11: Inspector override applied to correct breakpoint key**
    - **Validates: Requirements 7.9, 7.12, 10.5**

  - [x] 8.2 Write property test for reset removes property from overrides
    - **Property 12: Reset removes property from overrides**
    - **Validates: Requirements 7.10**

  - [x] 8.3 Write unit tests for Inspector tab rendering
    - Verify all three tabs render and controls are present
    - _Requirements: 7.1, 7.2_

- [x] 9. Checkpoint — Phase 1 complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 2 — Custom HTML + Responsive

### Tasks

- [x] 10. Implement HTML sanitisation utility
  - Create `resources/js/components/page-builder/utils/sanitise.ts`
  - Strip `<script>` elements, `on*` event attributes, and `javascript:` URI schemes
  - _Requirements: 8.2, 15.1, 15.2, 15.3_

  - [x] 10.1 Write property test for HTML sanitisation removes all script content
    - **Property 13: HTML sanitisation removes all script content**
    - **Validates: Requirements 8.2, 15.1, 15.2, 15.3**

- [x] 11. Implement HTML parser and serialiser utilities
  - Create `resources/js/components/page-builder/utils/parser.ts`
  - Try `DOMParser` first; fall back to `htmlparser2` on failure or `parseerror` document
  - Create `resources/js/components/page-builder/utils/serialiser.ts` with `serialiseNodes` pretty-printer
  - _Requirements: 8.3, 12.1, 12.2, 12.5_

  - [x] 11.1 Write property test for HTML parser round-trip
    - **Property 15: HTML parser round-trip**
    - **Validates: Requirements 12.1, 12.2, 12.3**

  - [x] 11.2 Write property test for script tags absent from parsed SectionNode tree
    - **Property 16: Script tags absent from parsed SectionNode tree**
    - **Validates: Requirements 12.4, 15.1, 15.3**

  - [x] 11.3 Write unit test for DOMParser fallback to htmlparser2
    - Simulate DOMParser failure and verify htmlparser2 is used
    - _Requirements: 12.5_

- [x] 12. Wire `importHtmlSection` in PageStore and build HtmlImportModal
  - Implement `importHtmlSection` in `PageStore`: sanitise → parse → assign NodeIds → append as `type: 'custom-html'` section
  - Create `resources/js/components/page-builder/HtmlImportModal.tsx` with textarea and Import button
  - Display descriptive error if both parsers fail
  - Wire "Paste HTML" button in Sidebar to open the modal
  - _Requirements: 8.1, 8.3, 8.4, 8.5_

  - [x] 12.1 Write property test for imported HTML stored as SectionNode tree, not raw HTML
    - **Property 14: Imported HTML stored as SectionNode tree, not raw HTML**
    - **Validates: Requirements 8.4**

  - [x] 12.2 Write unit test for HtmlImportModal open/close behaviour
    - Verify modal opens on "Paste HTML" click and closes on cancel
    - _Requirements: 8.1_

- [x] 13. Implement responsive viewport simulation with container queries
  - In `Canvas.tsx`, inject a scoped `<style>` element with container-query rules driven by the active `viewport` value
  - Constrain canvas width to 375px (mobile), 768px (tablet), or 100% (desktop) and centre horizontally
  - Ensure `SectionRenderer` applies the correct `overrides` breakpoint key (`sm`, `md`, `base`) based on active viewport
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 8.6_

  - [x] 13.1 Write unit tests for viewport width constraints
    - Verify canvas width changes to correct values for each viewport preset
    - _Requirements: 10.1, 10.2_

- [x] 14. Implement Laravel backend — PageBuilderController and Page model
  - Create `app/Models/Page.php` with `schema` JSON cast and `published_at` column
  - Create migration for `pages` table (`id`, `title`, `schema`, `published_at`, `timestamps`)
  - Create `app/Http/Controllers/PageBuilderController.php` with `publish` action
  - Validate PageSchema server-side; reject payloads containing script-bearing content
  - Register Inertia route `POST /pages/publish`
  - _Requirements: 11.4, 11.5, 15.4_

  - [x] 14.1 Write Laravel feature tests for PageBuilderController
    - Test successful publish persists schema, test script-bearing payload is rejected with 422
    - _Requirements: 11.4, 11.5, 15.4_

- [x] 15. Wire Publish action end-to-end
  - In `Toolbar.tsx`, call `store.exportSchema()` then `Inertia.router.post(publishUrl, schema)`
  - Handle `onError` callback: display toast notification without mutating store state
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6_

  - [x] 15.1 Write unit tests for Publish flow
    - Test successful POST, test error shows notification and retains state
    - _Requirements: 11.4, 11.6_

- [x] 16. Checkpoint — Phase 2 complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 3 — Scratch Builder + Export

### Tasks

- [x] 17. Implement primitive factories
  - Create `resources/js/components/page-builder/primitives/index.ts` with `primitiveFactories` map for all eight primitive types
  - Each factory returns a minimal `SectionNode` with `type: 'scratch'`, correct `tag`, empty `classes`, and empty `children`
  - _Requirements: 9.1_

- [x] 18. Implement drag-and-drop for section reorder and primitive drop
  - Wrap `Canvas` in `<DndContext>` from `@dnd-kit/core`
  - Wrap top-level sections in `<SortableContext>` for vertical reorder; dispatch `reorderSections` on drag end
  - Make Sidebar primitive items draggable sources
  - Handle drop over a Container node: dispatch `updateNode` to append primitive as child (Property 17)
  - Handle drop between top-level sections: dispatch `addSection` with a new `scratch` section wrapping the primitive (Property 18)
  - Render drop-zone indicators during drag-over
  - _Requirements: 5.5, 5.6, 9.2, 9.3, 9.4, 9.5_

  - [x] 18.1 Write property test for primitive drop into Container appends as child
    - **Property 17: Primitive drop into Container appends as child**
    - **Validates: Requirements 9.3**

  - [x] 18.2 Write property test for primitive drop between sections creates scratch section
    - **Property 18: Primitive drop between sections creates scratch section**
    - **Validates: Requirements 9.4**

  - [x] 18.3 Write unit tests for drag-and-drop reorder
    - Test section reorder updates store order correctly
    - _Requirements: 5.5, 5.6_

- [x] 19. Implement undo/redo boundary behaviour
  - Verify `zundo` stays at earliest snapshot when undo is called with no history (no error thrown)
  - Verify `zundo` stays at latest snapshot when redo is called with no future history
  - _Requirements: 13.2, 13.3, 13.5_

  - [x] 19.1 Write property test for undo/redo round-trip
    - **Property 19: Undo/redo round-trip**
    - **Validates: Requirements 13.2, 13.3**

  - [x] 19.2 Write property test for undo reverts last mutation
    - **Property 20: Undo reverts last mutation**
    - **Validates: Requirements 13.2**

  - [x] 19.3 Write unit tests for undo history limit and boundary
    - Test 50-step limit, test undo at boundary stays at earliest state
    - _Requirements: 13.4, 13.5_

- [x] 20. Implement AI Suggest feature
  - Create `app/Http/Controllers/AISuggestController.php` with `suggest` action using Laravel AI SDK
  - Register route `POST /ai/suggest`
  - In `Inspector.tsx`, add "AI Suggest" button on Content tab for text-bearing nodes
  - POST `textContent` + element context via `Inertia.router.post(aiSuggestUrl, ...)`
  - Display suggestion as preview; on confirm dispatch `updateNode` with new `textContent`; on error show inline message and retain original
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 20.1 Write unit tests for AI Suggest flow
    - Test button visibility for text nodes, preview display, confirm updates store, failure retains original textContent
    - _Requirements: 14.1, 14.3, 14.4, 14.5_

  - [x] 20.2 Write Laravel feature tests for AISuggestController
    - Test successful suggestion response, test error handling
    - _Requirements: 14.2, 14.5_

- [x] 21. Final checkpoint — all phases complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with `numRuns: 100` and must include the comment tag `// Feature: visual-page-builder, Property N: <property_text>`
- Checkpoints at the end of each phase ensure incremental validation before proceeding
