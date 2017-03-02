/**
 * jqGettext is able to translate static HTML pages with the help of jQuery as
 * GNU gettext does it with dynamic pages.
 * 
 * This file reads the JSON language files and tries to translate the entire
 * page. In addition it holds the javascript function _ to translate
 * javascript strings.
 * 
 * @license GNU GPL v3 https://www.gnu.org/licenses/gpl-3.0
 * @version 0.1alpha
 * @author Jan Kossick admin@g4rf.net
 * @updated 2017-03-01
 * 
 * TODO:
 *  - improve po support
 *  - add mo support
 */

/**
 * Holds the general functions and variables.
 * @namespace
 */
var jqGettext = {
    /**
     * The path where the gettext-style folder-structure is.
     * @type String
     */
    path: "lang",
    
    /**
     * The selected language, in fact the first sub folder.
     * @type String
     */
    lang: "de_DE",
    
    /**
     * The text domain, in fact the file name without the file ending.
     * @type String
     */
    domain: "standard",
    
    /**
     * The file type, literally.
     * @type String
     */
    type: "json",
    
    /**
     * Holds the loaded translation table.
     * @type Object
     */
    translation: {},
    
    /**
     * Translates the HTML document.
     */
    translateHTML: function() {
        if(! jqGettext.translation) return;
        
        $(document).find(":not(iframe)").addBack().contents().filter(function() {
            if(this.nodeType === 3 && jQuery.trim(this.nodeValue)) {
                var key = jqGettext.escapeStringforPO(this.nodeValue);
                if (! jqGettext.translation[key]) return;
                this.textContent = jqGettext.translation[key];
            }
        });
    },
    
    /**
     * Translates JS strings. Will be wrapped by _()-function.
     * @param {String} string
     * @returns {String} The translated string.
     */
    translateJS: function(string) {        
        return jqGettext.translation[string] || string;
    },
    
    /**
     * Loads a new file. If some parameter is missing or null it's current
     *  setting is used.
     * @param {String} [lang] The language.
     * @param {String} [domain] The domain.
     * @param {String} [path] The path.
     * @param {String} [type] The file type.
     * @returns {jqXhr} The jqXhr object from the ajax call.
     */
    changeLanguage: function(lang, domain, path, type) {
        jqGettext.path = path || jqGettext.path;
        jqGettext.lang = lang || jqGettext.lang;
        jqGettext.domain = domain || jqGettext.domain;
        jqGettext.type = type || jqGettext.type;
        
        return jQuery.ajax(jqGettext.file()).done(function(data) {
            jqGettext.loadTranslation(data);
            jqGettext.translateHTML();
        });
    },
    
    /**
     * Contructs the path to the actual language file.
     * @returns {String} The language file path.
     */
    file: function() {
        return jqGettext.path + "/" + jqGettext.lang + "/LC_MESSAGES/" + 
                jqGettext.domain + "." + jqGettext.type;
    },
    
    /**
     * Loads the data from the language file in the translation table.
     * @param {String} data The data that have to be parsed.
     */
    loadTranslation: function(data) {
        switch (jqGettext.type) {
            case "json":
                jqGettext.translation = data;
                break;
            case "po":
                jqGettext.translation = jqGettext.parsePOtoJSON(data);
                break;
        }
    },
    
    /**
     * This function parses a JSON object to a PO structure.
     * @param {Object} json The translation table.
     * @returns {String} The PO structure.
     */
    parseJSONtoPO: function(json) {
        var po = "# This file is badly generated with a simple JSON to PO function\n" +
                "# used by jq.gettext.js.\n" +
                "# https://github.com/g4rf/jg.gettext.js.git\n" +
                "msgid \"\"\n" +
                "msgstr \"\"\n" +
                "\"Content-Type: text/plain; charset=UTF-8\"\n\n";
        jQuery.each(json, function(key, value) {
            po += "msgid \"" + jqGettext.escapeStringforPO(key) + 
                    "\"\nmsgstr \"" + jqGettext.escapeStringforPO(value) + 
                    "\"\n\n";
        });
        return po;
    },
    
    /**
     * Parses more or less PO structured data to JSON. Can understand it's own
     *  POT files. :D
     * @param {String} po PO/POT structured data.
     * @returns {Object} A translation table (JSON-like).
     */
    parsePOtoJSON: function(po) {
        var json = {};
        po = po.replace(/#.*?\n/g, '').replace(/"\n"/g, '');
        po.replace(/msgid "([^\n]+)"[.\n]*?msgstr "([^\n]*)"/g, function(m, key, value) {
            json[key] = value;
        });
        console.log(json);
        return json;
    },
    
    /**
     * Escapes a JS string twice to put it correctly into a PO file.
     * @param {String} str String to be escaped.
     * @returns {String} The escaped string.
     */
    escapeStringforPO: function(str) {
        return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t').replace(/\"/g, '\\"')
                .replace(/\\/g, '\\');
    }
};

/**
 * Standard gettext function. Wrapper for jqGettext.translateJS.
 * @type Function
 */
var _ = jqGettext.translateJS;

/**
 * Initializing...
 */
(function() {
    // overwrites standard settings with meta setting from HTML document
    jqGettext.path = $("meta[name='gettext-path']").prop("content") || jqGettext.path;
    jqGettext.lang = $("meta[name='gettext-lang']").prop("content") || jqGettext.lang;
    jqGettext.domain = $("meta[name='gettext-domain']").prop("content") || jqGettext.domain;
    jqGettext.type = $("meta[name='gettext-type']").prop("content") || jqGettext.type;
    
    // get language file
    jQuery.ajax(jqGettext.file(), {
        async: true, // if it's too slow, change to false
        dataType: jqGettext.type === "json" ? "json" : "text"
    }).done(function(data) {
        jqGettext.loadTranslation(data);
        $(document).ready(jqGettext.translateHTML());
    });
})();