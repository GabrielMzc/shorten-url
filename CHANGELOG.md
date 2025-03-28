# Changelog

## [Unreleased]
### Added
- Added unit tests for `UrlController` methods: `shortenUrlCreate`, `getAllUrls`, `updateUrl`, `deleteUrl`, and `redirectToOriginalUrl`.
- Mocked `UrlService` methods to isolate tests and ensure expected behavior.
- Included assertions for responses and method calls to verify controller functionality.
- Added Swagger documentation and configuration for better API visibility.
- Introduced a custom `baseUrl` decorator to save shortened URL with the base path.
- Configured `UrlController` and `UrlService` to handle the saving of shortened URLs with the base path.
- Implemented `JWT` authentication strategy and `jwtAuthGuard` for global app security.

### Changed
- Adjusted URL services to handle base paths more efficiently.
- Improved error handling in URL redirection logic.

## [1.0.0] - 2025-03-27
### Added
- Defined the basic structure of the NestJS project, including setup of modules and services.
- Developed core entities for the project to be used in the database, with models aligned to the PostgreSQL schema.
- Configured PostgreSQL connection using TypeORM and set up migrations for data operations.
- Started the development of the authentication module, including JWT authentication and user management.
