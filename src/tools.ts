

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