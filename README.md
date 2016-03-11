#HJP-bookmarklet

In this project a bookmarklet was build which enables usage of dictionary of [Croatian Language Portal (Hrvatski Jezični Portal, HJP)](http://hjp.znanje.hr/?referer=hjp_bookmarklet) on any web pages just by double clicking on a chosen word.

You can see the bookmarklet and more information about the usage [here (Croatian)](http://hjp-bookmarklet.listup.audio).

##Why

- In some simple way I wanted to retrieve definition of a Croatian word on the web page that I was currently on. Since I know Croatian well enough, it is a better option for me than using Croatian-English dictionary.
- I wanted to write some bookmarklet.
- I wanted to write some back-end part in JavaScript and run it with node.js, I wanted to create a GitHub repository and write my first README.me, and also, I wanted to check out Bootstrap 3 and write some landing page.

##Details

- there is a simple nginx configuration that is used for serving static files for landing page and for bookmarklet.
- the bookmarklet uses external libraries: jQuery and jQuery UI (js and css files). During bookmarklet loading, a check is done whether the page has already the right versions of these libraries. Only in case it does not, these libraries are loaded in a separate namespace, so they do not interfere with the existing ones.
- the bookmarklet cleans up itself when destroyed by user.
- the bookmarklet uses local cache (a simple JavaScript object) for storing words that were recieved from server.
- node.js exposes a simple API which is used by the bookmarklet. Because HJP does not expose any API, this part could not be omitted (it is not possible to get/parse a HJP page directly on the client using AJAX or iframe because of cross-domain policy).
- node.js is a proxy between HJP and the bookmarklet. When bookmarklet sends a request, the word is first looked-up in a simple local file cache and the server returns the defintion if it is there. Otherwise, the server creates a POST request, gets the HTML page from HJP, parses the word definition using [cheerio](https://github.com/MatthewMueller/cheerio), saves it into file cache and sends the result to the client using JSONP format.
