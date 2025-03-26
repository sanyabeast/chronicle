# Chronicle

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-blue)](https://sanyabeast.github.io/chronicle/dist/index.html)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-green)](https://github.com/sanyabeast/chronicle)

## Overview

Chronicle is a personal portfolio and showcase application built with Vue.js. It serves as a centralized hub for various projects, demos, tools, and experiments. The application is organized as a collection of "applets" - each representing a different project or tool that can be launched and interacted with.

## Features

### Applet System
- **Modular Architecture**: Each project or tool is encapsulated as an "applet" with its own dedicated view and functionality
- **Categorized Browsing**: Applets are organized by categories like projects, demos, experiments, tools, and services
- **Rich Metadata**: Each applet includes metadata such as title, description, preview images, tags, and documentation

### Integrated Tools
- **Maze Generator**: Procedural maze generation with multiple implementation examples (Python, GDScript, TypeScript)
- **A* Pathfinder**: Interactive demonstration of the A* pathfinding algorithm
- **Norm Mapa Tool**: Normal map generation utility
- **Polar Picture Tool**: Image transformation tool
- **Seamless Texture Generator**: Create tileable textures
- **Retroid Maker**: Retro-style image effects
- **Shader View**: Interactive shader viewer and editor

### Project Showcases
- **Brickscape**: Voxel-based procedural generation demo
- **Match3**: Classic match-3 game
- **Forest Lads**: Game demo
- **Hill Rider**: Game demo
- **Retro Engine**: Game engine demo
- **Euphoria**: Experimental demo
- **Plot3**: 3D charting and plotting library
- **Middlenight**: Retro-style Unity game

### Additional Features
- **3D Model Viewer**: View and interact with 3D models
- **Web Frame**: Embedded browser for viewing external web content
- **Package Explorer**: Browse and access project assets and resources
- **Shader Support**: Custom shader system with GLSL support
- **Markdown Documentation**: Integrated Markdown rendering for project documentation

## Technical Details

### Technology Stack
- **Frontend Framework**: Vue.js
- **Routing**: Vue Router
- **State Management**: Vuex
- **3D Graphics**: Three.js
- **Syntax Highlighting**: highlight.js
- **Markdown Rendering**: Showdown
- **Configuration**: YAML-based applet configuration

### Project Structure
- **src/**: Source code
  - **assets/**: Static assets, images, shaders, and documentation
  - **components/**: Reusable Vue components
  - **router/**: Routing configuration and applet definitions
  - **store/**: Vuex state management
  - **views/**: Vue components for different views
    - **applets/**: Individual applet implementations
  - **tools/**: Utility functions and helpers

## Getting Started

### Prerequisites
- Node.js and npm

### Installation
```bash
# Clone the repository
git clone https://github.com/sanyabeast/chronicle.git

# Navigate to the project directory
cd chronicle

# Install dependencies
npm install

# Start the development server
npm run serve
```

### Building for Production
```bash
# Build the project
npm run build
```

## Usage

1. Navigate to the main page to see the "About" section
2. Browse the "Applets" catalog to explore available projects and tools
3. Click on any applet to view its details and documentation
4. Use the "Launch" button to start the selected applet

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- GitHub: [sanyabeast](https://github.com/sanyabeast)
- LinkedIn: [sanyabeast](https://www.linkedin.com/in/sanyabeast/)
- Email: [purpltie@outlook.com](mailto:purpltie@outlook.com?subject=chronicle)
