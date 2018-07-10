import json
import re
import requests
from bs4 import BeautifulSoup

def get_expiry_month(text):
    """Extract the month from text"""
    m = re.compile('(.+) \d{4} master ?code', re.IGNORECASE)
    return m.findall(text)[0]

def get_percent_coupons(text):
    """Extract percent-off coupons from text"""
    coupons = []
    expiry = get_expiry_month(text)

    r = re.compile('(\d+% off)(.*\d{4})+', re.IGNORECASE)
    d = re.compile('\d{4}')

    for c in r.findall(text):
        for x in d.findall(c[1]):
            coupons.append({
                'name': c[0],
                'data': {
                    'mastercode': x,
                    'title': c[0],
                    'subtitle': 'purchases up to $5,000',
                    'expiry': expiry
                }
            })

    return coupons

def get_dollar_coupons(text):
    """Extract dollar-off coupons from text"""
    coupons = []
    expiry = get_expiry_month(text)

    r = re.compile('(\$\d+ off).*(\$\d+)(.*\d{4})+', re.IGNORECASE)
    d = re.compile('\d{4}')

    for c in r.findall(text):
        for x in d.findall(c[2]):
            coupons.append({
                'name': c[0] + ' ' + c[1],
                'data': {
                    'mastercode': x,
                    'title': c[0],
                    'subtitle': 'purchases over ' + c[1],
                    'expiry': expiry
                }
            })

    return coupons

def get_wiki_text():
    """Download and scrape the coupon wiki page"""
    r = requests.get('https://slickdeals.net/f/9549456-lowe-s-10-15-50-off-online-coupons-sharing-only-no-off-topic#post93883968')

    soup = BeautifulSoup(r.text, 'html.parser')
    wiki = soup.find(id='wikiContent')

    return wiki.text.strip()

def main(output_file='static/js/coupons.js'):
    """Main program function."""
    text = get_wiki_text()
    text = '\n'.join(text.replace('\r', '').split('\n')[:10])
    coupons = get_percent_coupons(text) + get_dollar_coupons(text)

    with open(output_file, 'w') as f:
        f.write('var couponData = ')
        json.dump(coupons, f, indent=2)
        f.write(';\n')

    return "{} coupons written to {}".format(len(coupons), output_file)

if __name__ == '__main__':
    print(main())
