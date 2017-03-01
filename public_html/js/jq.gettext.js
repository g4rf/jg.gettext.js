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
    lang: "de_DE",
    domain: "standard",
    
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
    }
};

var _ = jqGettext.translateJS;

jQuery.ajax("lang/" + jqGettext.lang + "/LC_MESSAGES/" + jqGettext.domain + ".json", {
    async: false    
}).done(function(data) {
    jqGettext.translation = data;
    $(document).ready(jqGettext.translateHTML());
});