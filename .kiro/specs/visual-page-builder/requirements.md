# Requirements Document

## Introduction

The Visual Page Builder is a production-grade, drag-and-drop page builder React component integrated into a Laravel 13 + Inertia.js 3 application. It provides WYSIWYG live preview, click-to-select element inspection, custom HTML import, scratch-built page composition from primitives, responsive viewport simulation, and JSON schema export to Laravel. The builder runs entirely client-side; no separate backend is required for the builder itself. On publish, the page schema is POSTed to a Laravel controller via Inertia.

## Glossary

- **Builder**: The Visual Page Builder React component and its sub-components.
- **Canvas**: The centre panel that renders the live preview of the current page.
- **SectionNode**: The core data model unit representing any element in the page tree (section, container, or primitive).
- **NodeId**: A unique string identifier assigned to every SectionNode.
- **Inspector**: The right-panel Style & Property Inspector that shows contextual controls for the selected element.
- **Sidebar**: The left-panel Component/Element Sidebar listing presets and primitives.
- **PageStore**: The Zustand store managing the page section tree, selection state, and undo/redo history.
- **Preset**: A pre-built section template (Hero, Features, CTA, etc.) available in the Sidebar.
- **Primitive**: A single-element building block (Text, Heading, Image, Video, Button, Divider, Container, Spacer).
- **Viewport**: The active responsive simulation width (mobile: 375px, tablet: 768px, desktop: full width).
- **Override**: A per-breakpoint inline style object stored on a SectionNode that supplements its Tailwind classes.
- **DOMParser**: The browser-native HTML parser used to convert pasted HTML into a SectionNode tree.
- **PageSchema**: The final JSON output representing the full page tree, suitable for storage and rendering.
- **InertiaController**: The Laravel controller that receives the published PageSchema via an Inertia POST request.
- **Laravel_AI_SDK**: The Laravel AI SDK package used for any AI-assisted content or layout suggestions.
- **Laravel_Boost**: The Laravel Boost package providing application scaffolding and utilities.

---

## Requirements

### Requirement 1: Three-Panel Layout

**User Story:** As a content editor, I want a persistent three-panel layout, so that I can access the element sidebar, live canvas, and style inspector simultaneously without navigating away.

#### Acceptance Criteria

1. THE Builder SHALL render a full-viewport container with three persistent panels: a left Sidebar (240px fixed width), a centre Canvas, and a right Inspector (320px fixed width).
2. THE Builder SHALL render all three panels simultaneously without collapsing any panel by default.
3. WHEN the browser viewport height changes, THE Canvas SHALL fill the remaining vertical space between the top toolbar and the bottom of the viewport.
4. THE Builder SHALL not require a page reload to reflect any panel interaction.

---

### Requirement 2: Page Data Model

**User Story:** As a developer, I want a typed SectionNode tree as the page data model, so that the entire page state is serialisable to JSON and portable to the Laravel backend.

#### Acceptance Criteria

1. THE PageStore SHALL represent the page as an ordered array of top-level SectionNode objects.
2. THE SectionNode SHALL contain the fields: `id` (string), `type` (`preset` | `custom-html` | `scratch`), `tag` (string), `textContent` (optional string), `attrs` (optional `Record<string, string>`), `classes` (string array), `overrides` (object with optional keys `base`, `sm`, `md`, `lg` each typed as `React.CSSProperties`), and `children` (SectionNode array).
3. THE PageStore SHALL assign a unique NodeId to every SectionNode at creation time.
4. THE PageStore SHALL support nested SectionNode trees of arbitrary depth.
5. THE PageStore SHALL expose the full page tree as a serialisable plain object with no circular references.

---

### Requirement 3: Zustand State Management

**User Story:** As a developer, I want a Zustand store managing all page and selection state, so that any component can read or mutate state without prop drilling.

#### Acceptance Criteria

1. THE PageStore SHALL be implemented using Zustand with functional selectors.
2. THE PageStore SHALL track the currently selected NodeId (or `null` when nothing is selected).
3. THE PageStore SHALL track the active Viewport (`mobile` | `tablet` | `desktop`).
4. THE PageStore SHALL expose actions: `addSection`, `removeSection`, `reorderSections`, `updateNode`, `selectNode`, `deselectNode`, `setViewport`, `importHtmlSection`, `duplicateSection`.
5. THE PageStore SHALL integrate the `zundo` temporal middleware to support undo and redo of all state mutations.
6. WHEN `Ctrl+Z` is pressed, THE Builder SHALL undo the last state mutation.
7. WHEN `Ctrl+Shift+Z` is pressed, THE Builder SHALL redo the last undone state mutation.

---

### Requirement 4: Preset Sections

**User Story:** As a content editor, I want to add pre-built section presets from the sidebar, so that I can quickly scaffold common page layouts without building from scratch.

#### Acceptance Criteria

1. THE Sidebar SHALL list the following preset section types: Hero, Features, CTA.
2. WHEN a preset is clicked in the Sidebar, THE PageStore SHALL append a new SectionNode of `type: 'preset'` to the page tree with the preset's default SectionNode structure.
3. THE Canvas SHALL render the newly added preset section immediately after it is added to the PageStore.
4. THE SectionNode for each preset SHALL include a default set of `classes` and `children` matching the preset's visual template.

---

### Requirement 5: Section Management

**User Story:** As a content editor, I want to reorder, duplicate, collapse, and delete sections, so that I can organise the page layout efficiently.

#### Acceptance Criteria

1. THE Canvas SHALL render a header bar above each top-level section containing: a section label, a collapse toggle, a duplicate action, and a delete action.
2. WHEN the collapse toggle is activated, THE Canvas SHALL hide the section's content while keeping the header bar visible.
3. WHEN the duplicate action is activated, THE PageStore SHALL insert a deep copy of the section with new unique NodeIds immediately after the original.
4. WHEN the delete action is activated, THE PageStore SHALL remove the section and all its descendant SectionNodes from the page tree.
5. THE Builder SHALL implement vertical drag-and-drop reordering of top-level sections using `@dnd-kit/sortable`.
6. WHEN a section is reordered via drag-and-drop, THE PageStore SHALL update the section order to reflect the new position.
7. THE section header bar SHALL NOT be included in the exported PageSchema or final rendered output.
8. WHEN a section wrapper (not a child element) is clicked, THE PageStore SHALL select the section's NodeId and THE Inspector SHALL display wrapper-level controls.
9. THE Canvas SHALL support sections nested inside other sections.

---

### Requirement 6: Live Inline Editing

**User Story:** As a content editor, I want to click any text element on the canvas and type directly, so that I can edit copy without opening a separate modal or form.

#### Acceptance Criteria

1. WHEN the Builder is in edit mode, THE Canvas SHALL render all text-bearing nodes (`h1`–`h6`, `p`, `span`, `a`, `li`, `button`) with the `contenteditable` attribute set to `true`.
2. WHEN a text element is clicked, THE Canvas SHALL focus the element for inline editing AND THE PageStore SHALL set the selected NodeId to that element's NodeId simultaneously.
3. THE Canvas SHALL render non-text elements (`img`, `video`, `div` containers) as selectable but SHALL NOT set `contenteditable` on them.
4. THE Canvas SHALL apply inline editing to text-bearing nodes in both preset sections and custom-HTML sections.
5. WHEN a `contenteditable` element loses focus (blur event), THE PageStore SHALL commit the updated `textContent` to the SectionNode.
6. WHILE a `contenteditable` element is being edited, THE PageStore SHALL commit the updated `textContent` to the SectionNode debounced at 150ms per keystroke.
7. WHEN a click occurs outside any element on the Canvas, THE PageStore SHALL set the selected NodeId to `null` and THE Inspector SHALL display page-level controls.
8. THE Canvas SHALL render a 2px solid blue (#3B82F6) absolutely-positioned outline overlay on the currently selected element.

---

### Requirement 7: Style & Property Inspector

**User Story:** As a content editor, I want a contextual inspector panel that shows style controls for the selected element, so that I can adjust appearance without writing CSS.

#### Acceptance Criteria

1. THE Inspector SHALL display three tabs: Content, Style, and Layout.
2. WHEN a SectionNode is selected, THE Inspector SHALL display controls relevant to that node's tag and type.
3. THE Inspector SHALL provide Typography controls: font size, font weight, line height, letter spacing, text align, text colour, text decoration, and text transform.
4. THE Inspector SHALL provide Colour & Background controls: background colour, background image URL, background size, and background position.
5. THE Inspector SHALL provide Spacing controls: padding per side (top, right, bottom, left) with a linked/unlinked toggle, and margin per side.
6. THE Inspector SHALL provide Border & Radius controls: border width per side, border style, border colour, and border radius per corner with a linked toggle.
7. THE Inspector SHALL provide Size & Layout controls: width, min-width, max-width, height, min-height, max-height, display mode (`block` | `flex` | `grid` | `inline` | `hidden`), and flex/grid sub-controls when the relevant display mode is active.
8. THE Inspector SHALL provide Effects controls: opacity, box-shadow, overflow, cursor, and z-index.
9. WHEN an Inspector control value changes, THE PageStore SHALL apply the override to the selected SectionNode's `overrides` object instantly without requiring a save action.
10. WHEN the "Reset to default" action is triggered for a property, THE PageStore SHALL remove that property from the SectionNode's `overrides` object.
11. THE Inspector SHALL correctly target SectionNodes originating from pasted custom HTML using their NodeId.
12. WHEN a Viewport other than desktop is active, THE Inspector SHALL store style overrides against the corresponding breakpoint key (`sm`, `md`, `lg`) in the SectionNode's `overrides` object.

---

### Requirement 8: Custom HTML Import

**User Story:** As a content editor, I want to paste any HTML + Tailwind snippet into the builder, so that I can reuse existing markup and make all its elements editable.

#### Acceptance Criteria

1. THE Sidebar SHALL provide a "Paste HTML" action that opens a modal containing a textarea and an "Import" button.
2. WHEN the "Import" button is clicked, THE Builder SHALL sanitise the pasted HTML by stripping all `<script>` tags and resolving relative URLs before parsing.
3. WHEN the "Import" button is clicked, THE Builder SHALL parse the sanitised HTML using the browser-native DOMParser into a SectionNode tree.
4. THE Builder SHALL store the parsed SectionNode tree in the PageStore as a new section of `type: 'custom-html'`; raw HTML strings SHALL NOT be stored.
5. THE Builder SHALL assign a unique NodeId to every node in the parsed SectionNode tree.
6. THE Canvas SHALL honour Tailwind responsive classes on pasted nodes using scoped container queries.
7. THE Canvas SHALL apply `contenteditable` inline editing to all text-bearing nodes in pasted HTML sections.
8. WHEN any pasted element is clicked, THE PageStore SHALL select that element's NodeId and THE Inspector SHALL display its controls.

---

### Requirement 9: Build from Scratch

**User Story:** As a content editor, I want to drag primitive elements from the sidebar onto the canvas, so that I can compose page sections without using presets or pasting HTML.

#### Acceptance Criteria

1. THE Sidebar SHALL list the following primitive elements: Text (`p`), Heading (`h1`–`h6`), Image (`img`), Video (`video`), Button (`button`), Divider (`hr`), Container (`div`), Spacer.
2. WHEN a primitive is dragged over an existing section on the Canvas, THE Canvas SHALL display drop-zone indicators showing valid insertion points.
3. WHEN a primitive is dropped inside a Container SectionNode, THE PageStore SHALL append the new primitive as a child of that Container.
4. WHEN a primitive is dropped between two top-level sections, THE PageStore SHALL create a new minimal section of `type: 'scratch'` containing the primitive.
5. THE Canvas SHALL support drag-and-drop reordering of elements within scratch-built sections using `@dnd-kit/sortable`.

---

### Requirement 10: Responsive Viewport Simulation

**User Story:** As a content editor, I want to toggle between mobile, tablet, and desktop viewport presets, so that I can verify the page layout at different screen sizes without leaving the builder.

#### Acceptance Criteria

1. THE Builder SHALL render a toolbar with three device icons representing: mobile (375px), tablet (768px), and desktop (full width).
2. WHEN a viewport icon is selected, THE Canvas SHALL constrain its width to the corresponding preset value and centre it horizontally.
3. THE Canvas SHALL simulate Tailwind responsive classes using dynamically injected scoped container queries rather than relying on browser viewport media queries.
4. THE Builder SHALL NOT render any browser chrome frame around the Canvas during viewport simulation.
5. WHEN a style override is applied while a non-desktop Viewport is active, THE PageStore SHALL store the override against the corresponding breakpoint key in the SectionNode's `overrides` object.

---

### Requirement 11: JSON Export and Laravel Publish

**User Story:** As a developer, I want the builder to export a typed JSON PageSchema and POST it to a Laravel controller, so that the page content can be persisted and rendered server-side.

#### Acceptance Criteria

1. THE Builder SHALL provide a "Publish" action in the toolbar.
2. WHEN the "Publish" action is triggered, THE Builder SHALL serialise the full PageStore section tree into a PageSchema JSON object.
3. THE PageSchema SHALL be a JSON-serialisable tree of SectionNode objects with no circular references, no React component references, and no DOM node references.
4. WHEN the "Publish" action is triggered, THE Builder SHALL POST the PageSchema to the InertiaController using Inertia's `router.post` method.
5. THE InertiaController SHALL accept the PageSchema payload and persist it using standard Laravel model persistence.
6. IF the POST request fails, THEN THE Builder SHALL display an error notification to the user without losing the current page state.

---

### Requirement 12: HTML Parser Round-Trip

**User Story:** As a developer, I want the HTML parser to produce a stable SectionNode tree, so that importing and re-exporting HTML produces equivalent output.

#### Acceptance Criteria

1. THE Builder SHALL parse valid HTML snippets into a SectionNode tree using the browser-native DOMParser.
2. THE Builder SHALL serialise a SectionNode tree back into an equivalent HTML string via a pretty-printer utility.
3. FOR ALL valid HTML snippets, parsing then serialising then parsing SHALL produce a SectionNode tree equivalent to the first parse (round-trip property).
4. WHEN an HTML snippet contains `<script>` tags, THE Builder SHALL strip them during sanitisation and the resulting SectionNode tree SHALL contain no script nodes.
5. IF the DOMParser fails to parse the input, THEN THE Builder SHALL fall back to the `htmlparser2` library and return a SectionNode tree or a descriptive error.

---

### Requirement 13: Undo / Redo

**User Story:** As a content editor, I want to undo and redo any change I make in the builder, so that I can experiment freely without fear of losing work.

#### Acceptance Criteria

1. THE PageStore SHALL record every state mutation as a discrete history entry using the `zundo` temporal middleware.
2. WHEN `Ctrl+Z` is pressed, THE PageStore SHALL revert to the previous history entry.
3. WHEN `Ctrl+Shift+Z` is pressed, THE PageStore SHALL advance to the next history entry.
4. THE Builder SHALL support at least 50 discrete undo steps.
5. WHEN the undo history is exhausted, THE Builder SHALL remain at the earliest recorded state without throwing an error.

---

### Requirement 14: Laravel AI SDK Integration

**User Story:** As a content editor, I want AI-assisted content suggestions for text elements, so that I can generate copy without leaving the builder.

#### Acceptance Criteria

1. THE Inspector SHALL provide an "AI Suggest" action for text-bearing SectionNodes when the Content tab is active.
2. WHEN the "AI Suggest" action is triggered, THE Builder SHALL POST the current `textContent` and element context to a Laravel controller that uses the Laravel_AI_SDK to generate a suggestion.
3. WHEN a suggestion is returned, THE Inspector SHALL display it as a preview before the user confirms or dismisses it.
4. WHEN the user confirms a suggestion, THE PageStore SHALL update the SectionNode's `textContent` with the suggested text.
5. IF the AI suggestion request fails, THEN THE Builder SHALL display an error notification and retain the original `textContent`.

---

### Requirement 15: Security and Sanitisation

**User Story:** As a developer, I want all user-supplied HTML to be sanitised before it enters the page tree, so that the builder cannot be used to inject malicious scripts.

#### Acceptance Criteria

1. WHEN HTML is imported via the "Paste HTML" modal, THE Builder SHALL strip all `<script>` elements and `on*` event attributes before parsing.
2. WHEN HTML is imported, THE Builder SHALL strip `javascript:` URI schemes from `href` and `src` attributes.
3. THE Builder SHALL not execute any JavaScript contained in pasted HTML at any point during import, storage, or rendering.
4. THE InertiaController SHALL validate the PageSchema payload server-side and reject any payload containing script-bearing content.
