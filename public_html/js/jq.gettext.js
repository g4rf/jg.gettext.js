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
 *  - add pot/mo/po support
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
            // JSON:
            jqGettext.translation = data;
            // TODO PO:
            // jqGettext.translation = parsePOtoJSON(data);
            
            jqGettext.translateHTML();
        });
    },
    
    file: function() {
        return jqGettext.path + "/" + jqGettext.lang + "/LC_MESSAGES/" + 
                jqGettext.domain + "." + jqGettext.type;
    },
    
    parseJSONtoPO: function(json) {
        var po = "# this file is badly generated with a simple JSON to PO function" +
                "# used by jq.gettext.js."
# This file is distributed under the same license as the PACKAGE package.
# FIRST AUTHOR <EMAIL@ADDRESS>, YEAR.
#
#, fuzzy
msgid ""
msgstr ""
"Project-Id-Version: PACKAGE VERSION\n"
"Report-Msgid-Bugs-To: http://bugs.kde.org\n"
"POT-Creation-Date: 2008-09-03 10:09+0200\n"
"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\n"
"Last-Translator: FULL NAME <EMAIL@ADDRESS>\n"
"Language-Team: LANGUAGE <kde-i18n-doc@kde.org>\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"Plural-Forms: nplurals=INTEGER; plural=EXPRESSION;\n"";
    }
};

var _ = jqGettext.translateJS;

(function() {
    jqGettext.path = $("link[rel='gettext-path']").prop("href") || jqGettext.path;
    jqGettext.lang = $("link[rel='gettext-lang']").prop("href") || jqGettext.lang;
    jqGettext.domain = $("link[rel='gettext-domain']").prop("href") || jqGettext.domain;
    jqGettext.type = $("link[rel='gettext-type']").prop("href") || jqGettext.type;
    
    jQuery.ajax(jqGettext.file(), {
        async: true // if it's too slow, change to false
    }).done(function(data) {
        jqGettext.translation = data;
        $(document).ready(jqGettext.translateHTML());
    });
})();