# Changelog

All notable changes to the Flood Evacuation Dashboard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Future features and improvements planned
- Additional visualization options
- Enhanced data filtering capabilities

## [0.2.0] - 2024-12-13

### Added
- Dark mode toggle functionality
- Last updated timestamp display
- Tooltips for data visualization
- Responsive design improvements
- Static JSON data structure

### Changed
- Moved from direct API calls to static JSON data
- Reorganized file structure for better maintainability
- Updated visualization layouts for better responsiveness

### Fixed
- CORS issues with external API
- Mobile layout issues
- Chart rendering on different screen sizes

## [0.1.0] - 2024-12-13

### Added
- Initial project setup
- Basic dashboard layout
- D3.js integration for data visualization
- Bar chart for evacuee distribution
- Pie chart for PPS distribution
- Data table for detailed information
- Basic CSS styling
- Project documentation
  - CONCEPT.md for project overview
  - PLAN.md for implementation details
  - Initial README.md

### Features
- Summary statistics cards
  - Total PPS count
  - Total evacuees
  - Total families affected
- Interactive visualizations
  - Bar chart for evacuee distribution
  - Pie chart for PPS distribution
- Responsive layout
- Basic dark/light mode support

### Technical
- Project structure setup
- GitHub Pages configuration
- D3.js implementation
- CSS Grid/Flexbox layout
- Mobile-first responsive design

## Types of Changes

### Added
- New features
- New components
- New dependencies
- New documentation

### Changed
- Updates to existing functionality
- Dependency updates
- Documentation improvements
- Performance improvements

### Deprecated
- Features that will be removed in upcoming releases
- Old APIs or components being phased out

### Removed
- Deprecated features
- Old dependencies
- Unused code

### Fixed
- Bug fixes
- Performance issues
- Security vulnerabilities

### Security
- Security-related changes
- Vulnerability patches
- Authentication updates

## Version Guidelines

### Version Format: MAJOR.MINOR.PATCH

- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality additions
- PATCH version for backwards-compatible bug fixes

## Commit Message Format

### Format: [type] description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code refactoring
- perf: Performance improvements
- test: Adding or updating tests
- chore: Maintenance tasks

## Example Commit Messages
- feat: Add dark mode toggle
- fix: Resolve CORS issues with API
- docs: Update installation instructions
- style: Format dashboard.js
- refactor: Reorganize data processing logic
- perf: Optimize chart rendering
- test: Add unit tests for data processing
- chore: Update dependencies

## Release Process

1. Update version number in relevant files
2. Update CHANGELOG.md with new version
3. Create release tag
4. Push changes and tags
5. Create GitHub release
6. Deploy to production

## Note

This CHANGELOG is maintained by the project maintainers. For any questions or concerns about the changes listed here, please open an issue on the project repository.

[Unreleased]: https://github.com/username/banjir/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/username/banjir/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/username/banjir/releases/tag/v0.1.0
