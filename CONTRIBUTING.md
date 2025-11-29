# Contributing to Money Management App

Thank you for your interest in contributing to the Money Management App! We welcome contributions from the community to make this project better.

## 🤝 How to Contribute

### 1. Reporting Bugs
If you find a bug, please create a new issue on GitHub describing:
*   The steps to reproduce the bug.
*   The expected behavior.
*   Screenshots or error logs (if applicable).

### 2. Suggesting Features
We love new ideas! Open a "Feature Request" issue to discuss your idea before you start coding.

### 3. Code Contributions
1.  **Fork the repository** to your own GitHub account.
2.  **Clone the project** to your local machine.
3.  **Create a new branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
4.  **Make your changes** and commit them:
    ```bash
    git commit -m "feat: Add amazing feature"
    ```
5.  **Push to your branch**:
    ```bash
    git push origin feature/amazing-feature
    ```
6.  **Open a Pull Request** on GitHub.

## 🧑‍💻 Development Guidelines

### Code Style
*   We use **TypeScript** for type safety. Please ensure no `any` types are used unless absolutely necessary.
*   We use **Tailwind CSS** for styling. Follow standard utility class naming.
*   **Linting:** Run `npm run lint` before committing to ensure your code follows the project's standards.

### Database Changes
*   If you modify `db/schema.ts`, you MUST run `npx drizzle-kit push` to update the database schema.
*   Ensure all database queries use **Drizzle ORM** or parameterized SQL to prevent injection.

### Testing
*   Manually verify your changes in both **Light** and **Dark** modes.
*   Check responsiveness on **Mobile** view (using browser dev tools).

## 📄 License
By contributing, you agree that your contributions will be licensed under the MIT License.
