const xpath = require('xpath');
const { formRequestUrl } = require('../utils/common');
const errors = require('../utils/errors');

/*========================= Const section =========================*/

const BASE_URL = 'https://avito.ru';

const PRODUCTS_XPATH = './/div[@data-item-id]';
const PRODUCT_IMG_XPATH = 'string(.//img/@src)';
const SHOP_LINK_XPATH = './/div[@data-marker="item-line"]';
const PRODUCT_LINK_XPATH = 'string(.//a[@itemProp="url"]/@href)';
const DATE_XPATH = 'string(.//div[@data-marker="item-date"]/text())';
const PRODUCT_TITLE_XPATH = 'string(.//span[@itemProp="name"]/text())';
const PRODUCT_PRICE_XPATH = 'string(.//meta[@itemProp="price"]/@content)';
const LOCATION_XPATH = 'string(.//div[contains(@class, "geo-georeferences")]/span/text())';

/*========================= Helper functions =========================*/

function isShop(product) {
    const shopLinks = xpath.select(SHOP_LINK_XPATH, product);

    return shopLinks.length > 0;
}

function getProductInfo(product) {
    return {
        name: xpath.select(PRODUCT_TITLE_XPATH, product),
        price: xpath.select(PRODUCT_PRICE_XPATH, product),
        location: xpath.select(LOCATION_XPATH, product),
        date: xpath.select(DATE_XPATH, product),
        img: xpath.select(PRODUCT_IMG_XPATH, product),
        url: BASE_URL + xpath.select(PRODUCT_LINK_XPATH, product)
    }
}

/*========================= Middleware =========================*/

function formExternalResourseUrl(req, res, next) {
    const reqParams = {
        q: req.query.q
    }

    const pmin = req.query.pmin;
    const pmax = req.query.pmax;

    if (pmin)
        reqParams.pmin = pmin;

    if (pmax)
        reqParams.pmax = pmax;

    req.externalResourseUrl = BASE_URL + formRequestUrl(`/${req.query.region}`, reqParams);

    next();
}

function getProductsData(req, res, next) {
    const doc = req.doc;
    const limit = req.query.limit;

    const products = xpath.select(PRODUCTS_XPATH, doc);

    let count = 0
    let data = [];

    for (const product of products) {
        if (!isShop(product)) {
            data.push(getProductInfo(product));

            count++;
            if (count === limit)
                break;
        }
    }

    res.data = data;

    next();
}

module.exports = {
    formExternalResourseUrl,
    getProductsData
}