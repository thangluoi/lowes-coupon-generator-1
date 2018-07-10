from flask import Flask, request, send_file

app = Flask(__name__)

@app.route('/')
def root():
    return send_file('index.html')

@app.route('/scrape')
def scrape():
    import scraper
    return scraper.main()

if __name__ == '__main__':
    app.run(host='0.0.0.0')
