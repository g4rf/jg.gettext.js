# jg.gettext.js
A simple HTML and JS translation for static websites using jQuery.

The general idea is, to use jQuery to read the text nodes from an HTML document
and put them into a JSON or POT file. Then translate it (with an editor or Poedit)
and put them in a gettext-style folder structure. Now reference it in the HTML
document and load the jqgettext.js. Now every text node is translated. In addition
the script has an _()-function for gettext feeling in javascript.

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
POT or JSON just click the buttons and save the output. **Be aware** that you have to 
do the correct naming and pathing by yourself.

The **jq.gettext-parser.js** holds the functions for the HTML5 program.

## Put the translated strings into the HTML document

The **jq.gettext.js** does the magic. Just put a standard gettext structure in your 
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

But maybe we have a HTML5 app with dynamic changes. So there are some JS functions 
in *jq.gettext.js* that may be useful.

# POT or JSON?

The suppport for JSON is much more better (as it is JS built in), but it's harder to 
maintain different languages, as there is no autmatic possibilty implemented to merge
old language files with new JSON templates.
With a POT file you can use [Poedit](https://poedit.net/) to do the translations and to 
merge new POT files in old PO language files.

# Bugs
* the PO conversion is very weak (doesn't support multiple lines and so on)
* the Firefox moans an XML error when loading the PO file (works anyway)
