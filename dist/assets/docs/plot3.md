# Trading Chart Visualization Project

## Overview:

A project dedicated to the visualization of trading charts. This project serves as a library integrated into the main client.

## Key Features:

### Live Tracking: Enables tracking of live trading quotes in various formats:

![Curve](assets/docs/image/plot3/001.png "Curve painter")
![Candlesticks](assets/docs/image/plot3/002.png "Curve painter")

- Curves (including filled curves)
- Candles
- Bars

### User Navigation: Allows users to:

![User navigation](assets/docs/image/plot3/005.gif "User navigation")

- Zoom in and out, dynamically changing the level of detail.
- Pan forwards or backwards on the timeline for historical data exploration.
Rendering System: Uses a custom build of Three.js. Chart visualization divides the timeline into updatable segments. Almost all chart geometry is visualized using custom procedural BufferGeometry and a custom ShaderMaterial for interaction with the chart coordinate management system.

### Multiple Display Types: 

![Technical analysis tools](assets/docs/image/plot3/003.png "Technical analysis tools")


Can display several types simultaneously. This feature is primarily showcased via "technical analysis tools"—offering roughly twenty tools displayed either above the main chart or below it, in cases where a unique scale is required.

### Measurement Tools: 

![Measurement tools](assets/docs/image/plot3/004.png "Measurement tools")

Enables users to add special "measurement tools" to the chart. This set comprises around 20 customizable tools to tailor the chart's analytical capabilities.

###  Secondary Elements: 

The chart also allows for the visualization of various secondary elements in either screen space or world space, tied to the chart's grid based on zoom and position. This includes badges, markers, timers, fragments, and more.

## Advanced Features:

- Theming
- Localization
- Performance profiling
- Optimization for mobile devices
- Experimental rendering in a worker via OffscreenCanvas
