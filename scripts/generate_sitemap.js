const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const baseUrl = '/chronicle/dist/'

function readFileContent(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content;
    } catch (err) {
        console.error(`Error reading file from path ${filePath}`, err);
        throw err;
    }
}

function extractTokens(str) {
    const matches = str.match(/:(\w+)\??/g);
    return matches ? matches.map(token => token.replace(/[:?]/g, '')) : [];
}

function get_applet_url(applet) {
    const tokens = extractTokens(applet.route.path);
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

function urlEncode(str) {
    return str.replace(/ /g, '%20');
}

async function generateSitemap(yamlPath, templatePath, outputPath) {
    // Load and parse the YAML data
    const yamlData = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

    // Extract the routes
    const applets = yamlData.applets;

    // Create the links based on the routes
    const links = applets.map(applet => {
        let html = `<a href="${baseUrl}#${get_applet_url(applet)}">${applet.title || applet.route.name}</a><br/>`;
        if (applet.summary) {
            let summary = readFileContent(`public/${applet.summary}`);
            html += `<p>${summary}</a><br/>`;
        }
        return html;
    }).join('\n');

    // Load the HTML template
    let template = fs.readFileSync(templatePath, 'utf8');

    // Inject the links into the template. 
    // This assumes that there's a placeholder like <!--INSERT_LINKS--> in your template where the links should go.
    const updatedTemplate = template.replace('<!--INSERT_LINKS-->', links);

    // Save the updated template as a new HTML file
    fs.writeFileSync(outputPath, updatedTemplate, 'utf8');

    console.log(`Sitemap generated at: ${outputPath}`);
}

// Usage
generateSitemap('src/router/config.yaml', 'scripts/sitemap.template.html', 'public/sitemap.html');