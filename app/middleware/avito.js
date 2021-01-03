const xpath = require('xpath');
const errors = require('../utils/errors');
const { formRequestUrl } = require('../utils/common');

/*========================= Const section =========================*/

const BASE_URL = 'https://avito.ru';

const ADVERT_LINK_XPATH = 'string(.//a[@itemProp="url"]/@href)';
const DATE_XPATH = 'string(.//div[@data-marker="item-date"]/text())';
const ADVERT_TITLE_XPATH = 'string(.//span[@itemProp="name"]/text())';
const ADVERTS_CONTAINER_XPATH = './/div[@data-marker="catalog-serp"]';
const ADVERT_PRICE_XPATH = 'string(.//meta[@itemProp="price"]/@content)';
const ADVERT_IMG_XPATH = 'string(.//li[contains(@class, "photo-slider")]/@data-marker)';
const LOCATION_XPATH = 'string(.//div[contains(@class, "geo-georeferences")]/span/text())';

/*========================= Helper functions =========================*/

function getAdvertImage(ad) {
    const dataMarkerString = xpath.select(ADVERT_IMG_XPATH, ad);

    // searching for url
    const index = dataMarkerString.indexOf('http');

    // extracting url if found
    return (index !== -1) ? dataMarkerString.slice(index) : '';
}

function getAdvertInfo(ad) {
    return {
        name: xpath.select(ADVERT_TITLE_XPATH, ad),
        price: xpath.select(ADVERT_PRICE_XPATH, ad),
        location: xpath.select(LOCATION_XPATH, ad),
        date: xpath.select(DATE_XPATH, ad),
        img: getAdvertImage(ad),
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

    const adsContainer = xpath.select(ADVERTS_CONTAINER_XPATH, doc, true);

    if (!adsContainer) {
        return next(errors.parseError);
    }

    const ads = adsContainer.childNodes;

    let ad;
    let count = 0
    let data = [];

    for (let i = 0; i < ads.length; ++i) {
        ad = ads[i];

        if (ad.hasAttribute('data-item-id')) {
            data.push(getAdvertInfo(ad));

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
    getAdvertsData
}