# Lowe's Coupon Generator
A simple server to scrape and generate Lowe's printable coupons.

## Requirements
```shell
$ pip3 install flask requests bs4
```

## Usage
Clone this repository and then run:

```shell
$ python3 server.py
```

Visit <http://127.0.0.1:5000/> in your browser to view the page.

### Scraping
The scraper is not perfect, and may not find updated coupons. As of
July 10, 2018, it is working. To run the scraper, visit
<http://127.0.0.1:5000/scrape> in your browser.

### Manual Updating
To update the master codes manually, edit the `static/js/coupons.js` file.
Master codes can usually be found on [this Slickdeals page][mastercodes].

[mastercodes]: https://slickdeals.net/f/9549456-lowe-s-10-15-50-off-online-coupons-sharing-only-no-off-topic#post93883968
