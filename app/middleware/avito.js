const xpath = require('xpath');
const { formRequestUrl } = require('../utils/common');
const errors = require('../utils/errors');

/*========================= Const section =========================*/

const BASE_URL = 'https://avito.ru';

const PRODUCTS_DIV_CONTAINER_XPATH = './/div[@class="snippet-list"]';
const PRODUCT_TITLE_XPATH = 'string(.//a[@class="snippet-link"]/@title)';
const PRODUCT_LINK_XPATH = 'string(.//a[@class="snippet-link"]/@href)';
const PRODUCT_PRICE_XPATH = 'string(.//meta[@itemprop="price"]/@content)';
const PRODUCT_DESC_XPATH = 'string(.//meta[@itemprop="description"]/@content)';
const PRODUCT_IMG_XPATH = 'string(.//img/@src)';
const SHOP_LINK_XPATH = './/div[@class="data"]/p/a';
const CITY_XPATH = 'string(.//meta[@itemprop="addressLocality"]/@content)';
const DATE_XPATH = 'string(.//div[@class="snippet-date-info"]/@data-tooltip)';

/*========================= Helper functions =========================*/

function isShop(product) {
    const desc = xpath.select(PRODUCT_DESC_XPATH, product);
    const shopLinks = xpath.select(SHOP_LINK_XPATH, product);

    return desc.length > 3 || shopLinks.length > 0;
}

function getProductInfo(product) {
    return {
        name: xpath.select(PRODUCT_TITLE_XPATH, product),
        price: xpath.select(PRODUCT_PRICE_XPATH, product),
        city: xpath.select(CITY_XPATH, product),
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

    let prodDivContainer = xpath.select(PRODUCTS_DIV_CONTAINER_XPATH, doc);
    if (prodDivContainer.length === 0)
        return next(errors.parseError);

    prodDivContainer = prodDivContainer[0];
    const products = prodDivContainer.childNodes;

    let count = 0
    let data = [];

    for (let i = 0; i < products.length; ++i) {
        const product = products[i];

        if (product.nodeType === doc.ELEMENT_NODE && product.hasAttribute('id') && !isShop(product)) {
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