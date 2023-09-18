const fs = require('fs');
const yaml = require('js-yaml');
const { get } = require('lodash');
const { isFunction } = require('lodash');
const { remove } = require('lodash');
const path = require('path');

const PAGE_TITLE_BASE = "Welcome to @sanyabeast's Digital Abode [Web 1.0]"
const BASE_URL = '../public/';
const STATIC_URL_SUFFIX = 'static/';
const CONFIG_PATH = '../src/router/config.yaml'

const HTML_BASE_URL = '/chronicle/dist/'
const showdown = require('showdown');

const converter = new showdown.Converter();

function remove_directory(dir) {
    console.log(`Removing directory: ${dir}`);
    fs.rmdirSync(dir, { recursive: true });
}

function create_new_directory(dir) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir);
}


function to_snake_case(str) {
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

function read_text_file(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content;
    } catch (err) {
        console.error(`Error reading file from path ${filePath}`, err);
        throw err;
    }
}

function write_text_file(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
    } catch (err) {
        console.error(`Error writing file to path ${filePath}`, err);
        throw err;
    }
}

/**
 * Function to get the route path parameters from the given string (e.g. /:id/:name?)
 */
function get_route_path_parameters(str) {
    const matches = str.match(/:(\w+)\??/g);
    return matches ? matches.map(token => token.replace(/[:?]/g, '')) : [];
}

/**
 * Function to get the vue2 router path from the given applet
 */
function get_applet_url(applet) {
    const tokens = get_route_path_parameters(applet.route.path);
    const props = applet.props || {}
    let r = applet.route.path;

    tokens.forEach(token => {
        if (props[token] === undefined) {
            r = r.replace(`:${token}?`, "");
            r = r.replace(`:${token}`, "");
        } else {
            r = r.replace(`:${token}?`, encodeURIComponent(props[token]));
            r = r.replace(`:${token}`, encodeURIComponent(props[token]));
        }
    });
    return r;
}

/**
 * Function to convert the given data to HTML
 */
function to_html(data) {
    if (!Array.isArray(data)) return "";

    return data.map(item => {
        if (isFunction(item)) {
            item = item();
        }

        let html = `<${item.tag}`;

        // Add id if exists
        if (item.id) {
            html += ` id="${item.id}"`;
        }

        // Add classes if they exist
        if (item.classes && Array.isArray(item.classes)) {
            html += ` class="${item.classes.join(' ')}"`;
        }

        // Add attributes if they exist
        if (item.attrs && typeof item.attrs === 'object') {
            for (const [attr, value] of Object.entries(item.attrs)) {
                html += ` ${attr}="${value}"`;
            }
        }

        html += `>`;

        // Process children recursively if they exist
        if (item.children && Array.isArray(item.children)) {
            html += to_html(item.children);
        }

        // Add content if exists
        if (item.content) {
            html += item.content;
        }

        // Close the tag
        html += `</${item.tag}>`;

        return html;
    }).join('');
}

function generate_page_file(page_name, template_params) {
    let template = update_template(template_params);
    let output_path = path.resolve(__dirname, BASE_URL, `${page_name}.html`)
    write_text_file(output_path, template);
    console.log(`"${page_name}" generated at: ${output_path}`);
}

/**
 * Function to generate the static page based on the given type
 */
function create_page(type, params) {
    switch (type) {
        case 'static/index': {
            generate_sitemap();
            break;
        }
    }
}

/**
 * Function to update the template with the given parameters
 * and return the updated template
 */
function update_template(params) {
    const template_path = path.join(__dirname, './static.template.html');
    let template = read_text_file(template_path);


    for (const [key, value] of Object.entries(params)) {
        let final_value = value;
        if (Array.isArray(value)) {
            final_value = to_html(value);
        }

        template = template.replace(`<!--@${key}-->`, final_value);
    }
    return template;
}

function generate_details_page(applet) {
    let title = get_applet_title(applet);
    let alias = to_snake_case(title);
    console.log(`Generating details page for ${applet.title}`);

    const html_config = [{
        tag: 'div',
        classes: ['applet-details'],
        children: [
            {
                tag: 'a',
                classes: ['applet-all'],
                attrs: {
                    href: `${HTML_BASE_URL}static/index.html`
                },
                content: 'All Applets'
            },
            {
                tag: 'h1',
                content: title
            },
            {
                tag: 'div',
                classes: ['applet-details-content'],
                children: [

                    () => {
                        if (applet.preview) {
                            return {
                                tag: 'img',
                                attrs: {
                                    src: `${HTML_BASE_URL}${applet.preview}`,
                                    alt: title
                                }
                            }
                        } else {
                            return {
                                tag: 'p',
                                content: 'No preview available'
                            }
                        }
                    },
                    {
                        tag: 'a',
                        classes: ['applet-launch'],
                        attrs: {
                            href: `${HTML_BASE_URL}#${get_applet_url(applet)}`,
                        },
                        content: 'Launch'
                    },
                    () => {
                        if (applet.summary) {
                            return {
                                tag: 'p',
                                content: read_text_file(`public/${applet.summary}`)
                            }
                        } else {
                            return {
                                tag: 'p',
                                content: 'No summary available'
                            }
                        }
                    },
                    () => {
                        if (applet.document) {
                            return {
                                tag: 'p',
                                content: converter.makeHtml(read_text_file(`public/${applet.document}`))
                            }
                        } else {
                            return {
                                tag: 'p',
                                content: 'No document available'
                            }
                        }
                    }
                ]
            },
            {
                tag: 'script',
                content: 'window.adjustLinksAndImages();',
                attrs: {
                    type: 'text/javascript'
                }
            }
        ]
    }]

    generate_page_file(`static/${alias}`, {
        title: `${PAGE_TITLE_BASE} - ${title}`,
        content: html_config
    });
}

function get_applet_title(applet) {
    return applet.title || applet.route.name;
}

/**
 * Function to generate the sitemap
 */
async function generate_sitemap() {
    const config_path = path.join(__dirname, CONFIG_PATH);
    // Load and parse the YAML data
    const router_config = yaml.load(read_text_file(config_path));
    // Extract the routes
    const applets = router_config.applets;

    const html_config_applets = applets.map(applet => {
        generate_details_page(applet);

        let summary = '';

        if (applet.summary) {
            summary = read_text_file(`public/${applet.summary}`);
        }
        return {
            tag: 'div',
            classes: ['applet'],
            children: [{
                tag: 'a',
                attrs: {
                    // href: `${HTML_BASE_URL}#${get_applet_url(applet)}`
                    href: `${HTML_BASE_URL}static/${to_snake_case(get_applet_title(applet))}.html`
                },
                content: applet.title || applet.route.name
            },
            () => {
                if (applet.summary) {
                    return {
                        tag: 'p',
                        content: summary
                    }
                } else {
                    return {
                        tag: 'p',
                        content: 'No summary available'
                    }
                }
            }]
        }
    })

    generate_page_file('static/index', {
        title: `${PAGE_TITLE_BASE} - Index`,
        content: [...html_config_applets,
        {
            tag: 'script',
            content: 'window.adjustLinksAndImages();',
            attrs: {
                type: 'text/javascript'
            }
        }]
    });

}

// Usage
remove_directory(path.join(__dirname, BASE_URL, STATIC_URL_SUFFIX));
create_new_directory(path.join(__dirname, BASE_URL, STATIC_URL_SUFFIX));
create_page('static/index');
// generate_sitemap('src/router/config.yaml', 'scripts/static.template.html', 'public/sitemap.html');