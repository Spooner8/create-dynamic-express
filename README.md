# create-dynamic-express

Easily create a new project based on the [Dynamic Express Boilerplate](https://github.com/Spooner8/dynamic-express-boilerplate) template.

This CLI tool will prompt you for your project name and configuration options, then generate a ready-to-use Express.js + TypeScript project with your chosen features.

## 📦 Installation
```bash
npx create-dynamic-express
```
Follow the prompts to customize your project (name, description, port, database, features, etc).

## 🐳 Quick Start Docker
If you want to run your project in Docker, you can use the provided `docker-compose.yaml` file.
To build and run your project in Docker, follow these steps:

1. **Configure your environment and start developing!**

    Edit the `api.env` and `db.env` file as needed (see the boilerplate README for details).

2. **Start the Docker containers:**

    ```bash
    docker-compose up -d --build
    ```
    Or with multiple apis:
    ```bash
    docker-compose up -d --build --scale api=2
    ```

## Development Setup
1. **Install dependencies:**
    ```bash
    cd <your-project-name>
    npm install
    ```

2. **Configure your environment and start developing!**
    - Edit the `.env` file as needed (see the boilerplate README for details).

3. **Start the development server:**
    ```bash
    npm run dev
    ```
    **Note:** You need a running PostgreSQL database for the application to work. You can use Docker to run a PostgreSQL container. There is a `docker-compose.db.yaml` file included in the boilerplate that you can use to start a PostgreSQL instance. (Make sure to adjust the database connection settings in your `.env` file accordingly.)

## ⚠️ Important Notes

- **Logger as a Service (LAAS):**
  - If you do **not** enable LAAS, you must adjust the `nginx.conf` file so that the logger is not expected by the load balancer. Comment out or remove the relevant logger configuration lines.

- **Google Auth:**
  - If you enable Google Auth, you must set up a Client ID, Client Secret, and Callback URL in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Enter these values in your `.env` file.

- **RBAC (Role-Based Access Control):**
  - Even if you choose not to use RBAC, roles and permissions will still be created in the database. If you never intend to use RBAC, you should actively remove or clean up these roles and permissions in your project.
  Following files should be removed:
    - `src/router/permissions.ts`
    - `src/router/roles.ts`
    - `src/services/crud/permissions.ts`
    - `src/services/crud/roles.ts`
    - `src/services/docs/routes/permissions.ts`
    - `src/services/docs/routes/roles.ts`

    Refactor:
    - `src/services/docs/components.ts` Remove Roles and Permissions as schemas.
    - `src/services/docs/swagger.ts` Remove related paths and imports.
    - `src/services/docs/tags.ts` Remove Roles and Permissions tags.
    - `src/services/api.ts` Remove the if-block that checks for RBAC and remove the imports.
    - `src/services/default-data.ts` Remove permissions and roles from the default data.
    - `src/services/init-database.ts` Cleanup the roles and permissions creation logic.
    - `src/middleware/protection.ts` Remove import and the logic in functions after the `if (!RBAC)` bock.
    - `prisma/schema.prisma` Remove the roles and permissions models and their relations to Users.

    ***Please tell me if i missed any files for this cleanup.***


## 📦 What you get

- A full-featured Express.js + TypeScript project
- Authentication, RBAC, PostgreSQL/Prisma, monitoring, logging, Docker support, and more
- Easily customizable and extensible structure
- All features and options are configurable at project creation

For more details and configuration options, see the [Dynamic Express Boilerplate README](https://github.com/Spooner8/dynamic-express-boilerplate#readme).

---

**Note:** This tool is the fastest way to start a modern Express.js project with best practices and production-ready features, tailored to your needs.
