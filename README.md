# puppeteer-login-scraper
Puppeteer project for brief automation of web page login

## how to use it?
1. First make sure you have [nodeJS installed](https://nodejs.org/en/download/)
2. Also install [puppeteer](https://www.npmjs.com/package/puppeteer#getting-started) and [log-timestamp](https://www.npmjs.com/package/log-timestamp#install)
3. Setup your objects file (see the-internet.objects sample) containing the CSS selectors for page elements in your login and homepage
4. Setup your credentials file (see the-internet.etc sample) containing username and password
5. Run it using ```node login-scraper <page objects file> <credentials file>```

Example
```
$ node login-scraper.js the-internet.objects the-internet.etc
[2020-10-31T02:17:26.379Z] loading objects from the-internet.objects
[2020-10-31T02:17:26.388Z] loading credentials from the-internet.etc
[2020-10-31T02:17:26.430Z] the-internet.objects successfully read 379 chars
[2020-10-31T02:17:26.431Z] the-internet.etc successfully read 69 chars
[2020-10-31T02:17:27.761Z] accessing https://the-internet.herokuapp.com/login
[2020-10-31T02:17:31.980Z] typing credentials...
[2020-10-31T02:17:32.135Z] logging in...
[2020-10-31T02:17:33.524Z] capturing screen to 2020-10-31T021733.png
[2020-10-31T02:17:34.610Z] ...browser closed.
```

Check the captured screenshot 2020-10-31T021733.png e.g.
![example of captured screenshot from successful login at https://the-internet.herokuapp.com/login](https://drive.google.com/uc?export=view&id=1UZ2ePgtAh4gkHg-C-Fp0tKQ8dlgOYmXD "example of captured screenshot from successful login at https://the-internet.herokuapp.com/login")
