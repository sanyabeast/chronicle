# Overview:

A project aimed at visualizing an infinite voxel world. The world procedurally generates based on set rules, accommodating parameters from base noise to structure altitude considerations.

![Screenshot](assets/docs/image/brickscape_006.png "Screenshot")

# Key Features:

- Procedural Generation: Presupposes the placement of full structures, such as a group of blocks, during generation. This includes predefined structures like trees (shown in the demo).

### Visualization Technique: Utilizes Three.js for visualization. Block rendering employs:

![alt text](assets/docs/image/brickscape_003.png "Chunk rendering including empty blocks")

- Instanced geometry
- Custom shaders
- Instance attributes
  
This combination allows extensive control over block attributes while ensuring efficient resource usage.
The chunk organization closely mirrors the processes observed in Minecraft™.

# Performance Optimizations:

![alt text](assets/docs/image/brickscape_004.gif "Chunks Loading")
![alt text](assets/docs/image/brickscape_005.gif "Chunks Loading")

Tasks like chunk generation and updates are spread asynchronously over time. This minimizes heavy peak loads, preventing application freezes.
Rendering, while resource-intensive, is optimized for efficiency in a JavaScript environment.
Occlusion-Type Shading: A shading method based on neighboring blocks and their positions. It offers a visually appealing effect, adding depth to the imagery.

# Demo Exploration Modes:

![alt text](assets/docs/image/brickscape_001.png "Bird's-Eye View")
![alt text](assets/docs/image/brickscape_002.png "First-Person View")

Bird's-Eye View (MapControls): An aerial perspective of the voxel world.



First-Person View: Features basic character-block collision and allows activities like walking, running, and jumping.


*Prototyped and implemented by [@sanyabeast](mailto:purpltie@outlook.com?subject=chronicle)*