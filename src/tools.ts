
import axios from 'axios';
import { isArray, isNil, isNumber, isString, isUndefined, map } from 'lodash';
import * as THREE from 'three';

const mock_texture = new THREE.Texture();


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

export function read_text_file(file_path: string): Promise<string> {
    if (!isString(file_path)) {
        throw new Error(`'file_path' must be a string, but got ${typeof file_path}`)
    }
    console.log(`Reading text file: ${file_path}`)
    return new Promise((resolve, reject) => {
        fetch(file_path).then((res) => {
            return res.text();
        }).then((text) => {
            resolve(text);
        }).catch((err) => {
            reject(err);
        })
    })
}

export function get_file_extension(filename) {
    return filename.split('.').pop();
}

export function url_encode(str: string) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}

export function download_text_as_file(filename, text) {
    // Create a blob from the text data
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    // Create a new anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);

    // Trigger the download by simulating a click
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export function get_body_html(tags_to_remove) {
    // Clone the current document's body (to not alter the original content)
    const cloned_node = document.body.cloneNode(true) as HTMLElement;

    // Iterate through the tags to remove and delete them from the cloned body
    tags_to_remove.forEach(tag => {
        const elements = cloned_node.querySelectorAll(tag);
        elements.forEach(el => el.remove());
    });

    // Return the outerHTML of the cloned body
    return cloned_node.outerHTML;
}

export function get_current_year() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    return currentYear;
}

export function to_snake_case(str: string): string {
    return str
        // Convert to lowercase
        .toLowerCase()
        // Replace spaces with underscores
        .replace(/\s+/g, '_')
        // Replace non-alphanumeric characters (excluding underscores) with nothing
        .replace(/[^a-z0-9_]/g, '')
        // Replace multiple consecutive underscores with a single one
        .replace(/_+/g, '_');
}

export async function load_texture(src: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(src, (texture) => {
            resolve(texture);
        }, undefined, (err) => {
            reject(err);
        })
    })
}

export async function create_shader_material(shader_data: IShaderData, extra_uniforms?: {}): THREE.ShaderMaterial {
    console.log(`Creating shader material`, shader_data)
    const uniforms = {
        ...shader_data.uniforms,
        ...extra_uniforms
    };

    let uniform_data = {}
    for (let key in uniforms) {
        const value = uniforms[key];
        if (isString(value)) {
            uniform_data[key] = { value: await load_texture(value) }
        } else if (isArray(value)) {
            uniform_data[key] = { value: new THREE.Vector3(...value) }
        } else if (isNumber(value)) {
            uniform_data[key] = { value }
        } else if (isNil(value)) {
            uniform_data[key] = { value: mock_texture, type: 't' }
        }
    }

    try {
        const material = new THREE.ShaderMaterial({
            uniforms: uniform_data,
            vertexShader: await read_text_file(shader_data.vertex),
            fragmentShader: await read_text_file(shader_data.fragment),
        });

        return material;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export function file_to_blob_url(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (event) => {
            reject(event);
        };
        reader.readAsDataURL(file);
    });
}

export function get_direction_v3(from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3 {
    return to.clone().sub(from).normalize();
}

export function get_direction_v2(from: THREE.Vector2, to: THREE.Vector2): THREE.Vector2 {
    return to.clone().sub(from).normalize();
}

export function direction_to_angle_v2(direction: THREE.Vector2): number {
    return Math.atan2(direction.x, direction.y);
}

export function direction_to_angle_v3(direction: THREE.Vector3): number {
    return Math.atan2(direction.x, direction.z);
}

export function lerp_float(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

// API
export enum EAPIKeys {
    IWASHERE = 'iwashere',
    VIEWS = 'views'
}

export async function get_data(key: string) {
    try {
        // Define the URL and parameters
        const url = 'https://chronicle.alwaysdata.net/get_data.php';
        const params = { key };

        // Perform the GET request using Axios
        const response = await axios.get(url, { params });

        // Log the response data
        return response.data
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
    }
}

export async function set_data(key: string, value: string) {
    try {
        // Define the URL and parameters
        const url = 'https://chronicle.alwaysdata.net/set_data.php';
        const params = { key, value };

        // Perform the GET request using Axios
        const response = await axios.get(url, { params });

    } catch (error) {
        // Handle errors
        console.error('Error:', error);
    }
}

export async function get_iwashere_counter() {
    let current_value = 0

    try {
        let response = await get_data(EAPIKeys.IWASHERE)
        if (isNumber(response)) {
            current_value = response
        }
    } catch (err) {
        console.error(err)
    }

    return current_value
}

export async function set_iwashere_counter(value: number) {
    await set_data(EAPIKeys.IWASHERE, value.toString())
}

(window as any).get_data = get_data;
(window as any).set_data = set_data;
(window as any).get_iwashere_counter = get_iwashere_counter;
(window as any).set_iwashere_counter = set_iwashere_counter;