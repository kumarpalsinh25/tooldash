# Tooldash v2

A modern, fast, and beautiful collection of developer tools built with Next.js, Tailwind CSS, and Lucide Icons.

## Architecture

This project is designed to be easily extensible. Here is the core structure:

- **Registry**: `src/data/tools-registry.ts` is the single source of truth for all tools. It defines metadata, categories, and search logic.
- **Dynamic Routing**: `src/app/tools/[toolId]` handles the rendering of individual tools based on the registry.
- **Components**:
  - `src/components/tools/`: Contains individual tool implementations (e.g., `base64-encoder.tsx`).
  - `src/components/ui/`: Shared UI components (Button, Input, Typography, etc.).
  - `src/lib/category-icons.ts`: Centralized mapping of icons to tool categories.

## Contribution Guide (For Future AI Agents & Developers)

### How to Add a New Tool

Follow these steps to add a new tool to the platform:

1.  **Define Category (Optional)**: If the tool belongs to a new category, add it to `ToolCategory` in `src/lib/category-icons.ts` and assign a Lucide icon.
2.  **Create Tool Component**:
    - Create a new file in `src/components/tools/` (e.g., `my-new-tool.tsx`).
    - Use shared UI components from `@/components/ui/*`.
    - Use `CopyButton` from `@/components/copy-button` for all "Copy to Clipboard" actions.
    - Use `CodeEditor` from `@/components/code-editor` for code-related inputs/outputs.
3.  **Register the Tool**:
    - Add the tool metadata to the `tools` array in `src/data/tools-registry.ts`.
    - Import and add your tool component to the `TOOL_COMPONENTS` mapping in `src/app/tools/[toolId]/page.tsx`.
4.  **Verify**:
    - Run `yarn lint` to ensure there are no type errors or linting issues.
    - Test the tool in the browser at `/tools/my-new-tool`.

### Design Principles

- **Use Lucide Icons**: Import icons from `lucide-react`. Use `CATEGORY_ICONS` or `getCategoryIcon()` for category-related icons.
- **Consistent UI**: Always use the predefined components in `src/components/ui`. Avoid ad-hoc styling where a component exists.
- **Aesthetics**: Maintain the premium, dark-themed aesthetic with smooth transitions and hover effects.
- **Formatting**: Use `Typography` for all text to ensure consistent scale and weight.

## Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Lint and type-check
yarn lint
```
