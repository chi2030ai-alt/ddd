# Developer & AI Agent Guidelines (Lock Manifest)

The application visual styling and layout are currently **LOCKED**. Future development cycles must strictly adhere to the rules below:

## 1. Locked Assets & Layouts (禁止改动布局、颜色、风格)
- Do NOT alter page wrappers, colors, dark/light themes, or spacing.
- Keep the existing sidebar tab structure intact.
- Do NOT rewrite or redesign existing styled panels or introduce a clean new design language.

## 2. Permitted Enhancements (只允许补全数据与状态)
- **Functional Completion only:** Update data states, add backend connections, API bridges, local storage, or CRUD capabilities.
- **Loading & Error Handling:** Connect loaders, pending/spinner states, and error handling dialogues.
- **Interactive State Binding:** Ensure real items (such as product and order state lists) sync seamlessly to connected microservices.
- Ensure all Google Drive, Gmail, and Google Keep integrations utilize cache-safe in-memory or session storage.
