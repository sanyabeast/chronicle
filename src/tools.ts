

export function get_random_web_color(seed: String) {
    // Array of web colors
    const colors = [
        "#FF0000", // Red
        "#00FF00", // Green
        "#0000FF", // Blue
        "#FFFF00", // Yellow
        "#FF00FF", // Magenta
        "#00FFFF", // Cyan
        "#FFA500", // Orange
        "#800080", // Purple
        "#008000", // Dark Green
        "#000080"  // Navy
        // Add more colors to the array if desired
    ];

    // Generate a random index based on the seed string
    const seed_value = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random_index = seed_value % colors.length;

    // Return the color at the random index
    return colors[random_index];
}

export function djb2(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
}
export function get_web_color(seed: string): string {
    const seedValue = djb2(seed);

    // Generate random RGB values
    const r = (seedValue & 0xFF) % 256;
    const g = ((seedValue >> 8) & 0xFF) % 256;
    const b = ((seedValue >> 16) & 0xFF) % 256;

    // Convert RGB to hexadecimal color
    const color = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;

    return color;
}

export function get_bright_web_color(seed) {
    const seedValue = djb2(seed);

    // Generate bright RGB values in the higher range (200-255)
    const r = (seedValue & 0xFF) % 56 + 200;
    const g = ((seedValue >> 8) & 0xFF) % 56 + 200;
    const b = ((seedValue >> 16) & 0xFF) % 56 + 200;

    // Convert RGB to hexadecimal color
    const color = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;

    return color;
}


export function get_dark_web_color(seed) {
    const seedValue = djb2(seed);

    // Generate dark RGB values in the lower range (0-100)
    const r = (seedValue & 0xFF) % 101;
    const g = ((seedValue >> 8) & 0xFF) % 101;
    const b = ((seedValue >> 16) & 0xFF) % 101;

    // Convert RGB to hexadecimal color
    const color = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;

    return color;
}