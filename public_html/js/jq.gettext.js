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

var jqGettext = {
    path: "lang",
    lang: "de_DE",
    domain: "standard",
    type: "json",
    
    translation: {},
    
    translateHTML: function() {
        if(! jqGettext.translation) return;
        
        $(document).find(":not(iframe)").addBack().contents().filter(function() {
            if(this.nodeType === 3 && jQuery.trim(this.nodeValue)) {
                if (! jqGettext.translation[this.nodeValue]) return;
                this.textContent = jqGettext.translation[this.nodeValue];
            }
        });
    },
    
    translateJS: function(string) {        
        return jqGettext.translation[string] || string;
    },
    
    changeLanguage: function(lang, domain, path, type) {
        jqGettext.path = path || jqGettext.path;
        jqGettext.lang = lang || jqGettext.lang;
        jqGettext.domain = domain || jqGettext.domain;
        jqGettext.type = type || jqGettext.type;
        
        jQuery.ajax(jqGettext.file()).done(function(data) {
            jqGettext.loadTranslation(data);
            jqGettext.translateHTML();
        });
    },
    
    file: function() {
        return jqGettext.path + "/" + jqGettext.lang + "/LC_MESSAGES/" + 
                jqGettext.domain + "." + jqGettext.type;
    },
    
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
    
    parseJSONtoPO: function(json) {
        var po = "# This file is badly generated with a simple JSON to PO function\n" +
                "# used by jq.gettext.js.\n" +
                "# https://github.com/g4rf/jg.gettext.js.git\n" +
                "msgid \"\"\n" +
                "msgstr \"\"\n" +
                "\"Content-Type: text/plain; charset=UTF-8\"\n\n";
        jQuery.each(json, function(key, value) {
            po += "msgid \"" + key + "\"\nmsgstr \"" + value + "\"\n\n";
        });
        return po;
    },
    
    parsePOtoJSON: function(po) {
        var json = {};
        po.replace(/msgid "([^"]+)"[.\n]*?msgstr "([^"]*)"/g, function(m, key, value) {
            json[key] = value;
        });
        return json;
    }
};

var _ = jqGettext.translateJS;

(function() {
    jqGettext.path = $("meta[name='gettext-path']").prop("content") || jqGettext.path;
    jqGettext.lang = $("meta[name='gettext-lang']").prop("content") || jqGettext.lang;
    jqGettext.domain = $("meta[name='gettext-domain']").prop("content") || jqGettext.domain;
    jqGettext.type = $("meta[name='gettext-type']").prop("content") || jqGettext.type;
    
    jQuery.ajax(jqGettext.file(), {
        async: true, // if it's too slow, change to false
        dataType: jqGettext.type === "json" ? "json" : "text"
    }).done(function(data) {
        jqGettext.loadTranslation(data);
        $(document).ready(jqGettext.translateHTML());
    });
})();