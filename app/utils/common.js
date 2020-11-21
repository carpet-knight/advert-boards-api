const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const { stringify } = require('querystring');
const { app } = require('../config/default');

const parser = new DOMParser(app.parserSettings);

const DEFAULT_HEADERS = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
}

async function getContent(url) {
    const res = await fetch(url, {
        headers: DEFAULT_HEADERS
    });

    return await res.text();
}

function formDocument(html) {
    return parser.parseFromString(html);
}

function formRequestUrl(path, params) {
    return encodeURI(`${path}?${stringify(params)}`);
}

module.exports = {
    getContent,
    formDocument,
    formRequestUrl
}