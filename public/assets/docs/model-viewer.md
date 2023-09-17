ModelViewer3D: A Sophisticated 3D Model Viewing Component

## Overview:

The ModelViewer3D component is a specialized module designed for the intuitive visualization and interaction of 3D models within the browser environment.

## Core Features:

- Integrated Components: Incorporates the ThreeRenderer for model rendering and the Preloader to showcase load status.

- State Management: Manages multiple states including drag status, mouse modes, camera modes, flashlight visibility, and loading states among others.

- Responsive Design: Seamlessly adapts to mobile devices with a computed property that identifies mobile devices.

- Dynamic Controls: Offers a suite of orbit_controls for model navigation which includes rotation, zooming, panning, and auto-rotate capabilities. The system also provides real-time flashlight toggle and camera resetting features.

- Intelligent Rendering: Adapts rendering modes on-the-fly and manages background visuals through HDRI (High Dynamic Range Imaging) sourcing.

- File Handling: Enables file uploads, drag and drop functionality, and loading from different sources including HDR and GLTF file types.

- Lifecycle Methods: Properly initializes key event listeners, models, and lighting on mounting, and ensures clean up before component destruction.

- Event Handlers & Methods: Employs a multitude of methods ranging from file uploads, scene clearing, camera resets, keyboard interactions to toggling between rendering modes.