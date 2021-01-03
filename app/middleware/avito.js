const xpath = require('xpath');
const { formRequestUrl } = require('../utils/common');

/*========================= Const section =========================*/

const BASE_URL = 'https://avito.ru';

const ADVERTS_XPATH = './/div[@data-item-id]';
const ADVERT_IMG_XPATH = 'string(.//img/@src)';
const ADVERT_LINK_XPATH = 'string(.//a[@itemProp="url"]/@href)';
const DATE_XPATH = 'string(.//div[@data-marker="item-date"]/text())';
const ADVERT_TITLE_XPATH = 'string(.//span[@itemProp="name"]/text())';
const ADVERT_PRICE_XPATH = 'string(.//meta[@itemProp="price"]/@content)';
const LOCATION_XPATH = 'string(.//div[contains(@class, "geo-georeferences")]/span/text())';

/*========================= Helper functions =========================*/

function getAdvertInfo(ad) {
    return {
        name: xpath.select(ADVERT_TITLE_XPATH, ad),
        price: xpath.select(ADVERT_PRICE_XPATH, ad),
        location: xpath.select(LOCATION_XPATH, ad),
        date: xpath.select(DATE_XPATH, ad),
        img: xpath.select(ADVERT_IMG_XPATH, ad),
        url: BASE_URL + xpath.select(ADVERT_LINK_XPATH, ad)
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

function getAdvertsData(req, res, next) {
    const doc = req.doc;
    const limit = req.query.limit;

    const ads = xpath.select(ADVERTS_XPATH, doc);

    let count = 0
    let data = [];

    for (const ad of ads) {
        data.push(getAdvertInfo(ad));

        count++;
        if (count === limit)
            break;
    }

    res.data = data;

    next();
}

module.exports = {
    formExternalResourseUrl,
    getAdvertsData
}