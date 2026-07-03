# 📋 Kanban Task Management Board

A sleek, premium Kanban task management application built using modern Angular. The application features support for custom boards, column creation, detailed task details, subtask tracking, dark/light theme switching, and seamless drag-and-drop mechanics.

---

## ✨ Features

- **Interactive Kanban Board**: Dynamic board layouts that scale to fit any viewport screen size.
- **Drag and Drop**: Seamlessly move tasks between columns or reorder them within a column using `@angular/cdk/drag-drop`.
- **Dynamic Board Management**:
  - Add, edit, and delete boards.
  - Custom column additions and updates.
- **Task Management**:
  - Add detailed tasks with titles, descriptions, and customizable subtasks.
  - Mark subtasks as completed directly from the task detail modal.
  - Move tasks manually or edit/delete tasks.
- **Theme Toggle**: Beautiful dark and light modes styled with cohesive CSS variables.
- **State Persistence**: All boards, columns, tasks, and settings are saved automatically using `localStorage`.

---

## 🛠️ Technology Stack

- **Framework**: [Angular v21](https://angular.dev/) (Standalone Components, Signals, Computed properties)
- **Drag and Drop**: [@angular/cdk](https://material.angular.io/cdk/categories)
- **Styling**: Vanilla CSS with custom design system variables
- **Testing**: [Vitest](https://vitest.dev/)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd kanban-app
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start a local development server, run:
```bash
npm run start
```
Once started, navigate to `http://localhost:4200/` in your browser. The application will reload automatically upon modifying files.

### Building

To build the project run:
```bash
npm run build
```
Build outputs will be compiled and stored inside the `dist/kanban-app` directory.

### Running Tests

To run unit tests using the Vitest test runner:
```bash
npm run test
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── components/       # Reusable UI elements (cards, headers, buttons)
│   ├── layout/           # Sidebar and header layouts
│   ├── pages/            # Core pages (board page layout)
│   ├── services/         # State management services (boards.service.ts)
│   ├── app.routes.ts     # Router configuration
│   ├── app.ts            # Main application bootstrap component
│   └── app.css           # Global layout styling
├── data/
│   └── data.json         # Mock data fallback
└── models/
    └── boards.model.ts   # Board model typescript interfaces
```
