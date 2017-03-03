# jq.gettext.js
A simple HTML and JS translation for static websites using jQuery.

The general idea is, to use jQuery to read the text nodes from an HTML document
and put them into a JSON or POT file. Then translate it (with an editor or 
[Poedit](https://poedit.net/)) and put them in a gettext-style folder structure.
Now reference it in the HTML document and load the jq.gettext.js. Now every text
node is translated. In addition the script has an _()-function for gettext feeling
in javascript.

Feel free to contact me at admin@g4rf.net.

# What's in there

In the "public_html" folder everything ist put together. There you'll find the
following structure:
* js
  * jq.gettext.js
  * jq.gettext-parser.js
  * jquery-3.1.1.min
* lang
  * standard.pot
  * template.json
  * ...
* index.html

## Collect the translatable strings

The **index.html** hold a tiny HTML5 program, that can load a template file, some
HTML and JS files and then parse them for translatable strings. To save the generated
POT or JSON just click the buttons and download the output or save it with the save
function (CTRL+S) of your browser. **Be aware** that you have to do the correct 
naming and pathing by yourself.

The **jq.gettext-parser.js** holds the functions for the HTML5 program.

Use an actual HTML5 capable browser.

## Put the translated strings into the HTML document

The **jq.gettext.js** does the magic. Just put a 
[standard gettext structure](https://phptal.org/manual/en/split/gettext.html) in your 
static HTML project, fill in the meta in the head of the HTML document:
* <meta name="gettext-path" content="lang" />
  * The path to the gettext style folder structure.
* <meta name="gettext-lang" content="de_DE" />
  * The language folder.
* <meta name="gettext-domain" content="standard" />
  * The domain name (in fact the file name).
* <meta name="gettext-type" content="json" />
  * The type of lang file (in fact the file ending)
and the rest will be done automatically.

But maybe we have a HTML5 app with dynamic changes? So there are some JS functions 
in *jq.gettext.js* that may be useful (especially changeLanguage()).

Basically the **jq.gettext.js** should work even with older browsers, as it uses jQuery 
for the whole DOM magic. Maybe some string and regex functions are not fully supported 
(especially in IE < 10).

# POT or JSON?

The suppport for JSON is much more better (as it is JS built in), but it's harder to 
maintain different languages, as there is no automatic possibilty implemented to merge
old language files with new JSON templates.
With a POT file you can use [Poedit](https://poedit.net/) to do the translations and to 
update old PO language files with the new POT file.

# Drawbacks
* the PO conversion is very weak (doesn't support plurals and so on)
* to get rid of some problems with control characters \n, \r and \t are replaced with whitespaces
* furthermore double quotes are replaced with single quotes and the back slash with a slash
* multiple whitespaces are reduced to one whitespace as HTML ignores them anyway
* the parser for JS files can't recognize multiline calls to the _()-function.

# Bugs
* the Firefox moans an XML error when loading the PO file (works anyway)
