/* global jqGettext */

/**
 * jqGettext is able to translate static HTML pages with the help of jQuery as
 * GNU gettext does it with dynamic pages.
 * 
 * This file parses HTML and JS files with the help of jQuery und produces a
 * JSON output. Save that output in a file, translate it and save it somewhere
 * else with a correct ISO language code. This file is than be used by
 * jqGettext to translate the HTML page on the fly.
 * 
 * @license GNU GPL v3 https://www.gnu.org/licenses/gpl-3.0
 * @version 0.1alpha
 * @author Jan Kossick admin@g4rf.net
 * @updated 2017-03-01
 * 
 * TODO:
 *  - improve POT support
 */

/**
 * Holds function for the parser.
 * @namespace
 */
var jqGettextParser = {
    /**
     * Holds the collected translatable strings.
     * @type Object
     */
    template: {},
    
    /**
     * Prints a status message.
     * @param {String} msg The message.
     */
    info: function(msg) {
        $("#info").prepend(msg + "<br />");
    },
    
    /**
     * Parses a HTML document for text nodes and put the translatable strings
     *  into jqGettextParser.template.
     * @param {jQuery} data A jQuery readable object.
     */
    parseHTML: function(data) {
        var nodes = $(data).find(":not(iframe)").addBack().contents().filter(function() {
            return this.nodeType === 3 && jQuery.trim(this.nodeValue);
        });
        jQuery.each(nodes, function(index, node) {
            if(typeof jqGettextParser.template[node.nodeValue] === "undefined")
                jqGettextParser.template[node.nodeValue] = "";
        });
        jqGettextParser.printTemplate();
    },
    
    /**
     * Parses a plain text file for the gettext function _() and put the 
     *  inner strings into jqGettextParser.template.
     * @param {type} data
     * @returns {undefined}
     */
    parseJS: function(data) {
        data.replace(/_\(["|'](.+?)["|']\)/g, function(m, string) {
            if(typeof jqGettextParser.template[string] === "undefined")
                jqGettextParser.template[string] = "";
        });
        jqGettextParser.printTemplate();
    },
    
    printTemplate: function() {
        $("#template-output").empty().append(
                JSON.stringify(jqGettextParser.template, null, 4));
    }
};

/**
 * Reads the template file.
 */
$("#template").change(function() {    
    var template = $("#template")[0].files[0] || null;
    if(! template) {
        jqGettextParser.info(_("Can't read template file."));
    }
    
    var reader = new FileReader();    
    reader.onload = function (e) {
        var t = {};
        switch(template.name.substr(-4)) {
            case "json":        
                t = jQuery.parseJSON(e.target.result);
                break;
            case ".pot":
                t = jqGettext.parsePOtoJSON(e.target.result);
                break;
            default:
                jqGettextParser.info(_("Template file \nformat not recognized!"));
                jqGettextParser.info(_("Process canceled."));
                return;
        }
        jQuery.each(t, function(key, value) {
            jqGettextParser.template[key] = value;
        });
        
        jqGettextParser.printTemplate();
        
        jqGettextParser.info(_("Template loaded."));
    };    
    reader.readAsText(template);
});

/**
 * Print some informations about the selected files.
 */
$("#file").change(function() {
    $("#files").empty();
    jQuery.each($("#file")[0].files, function(index, file) {
        $("#files").append(file.name + " (" + 
                (file.size / 1000).toFixed(3) + " kB)<br />");
    });
    
    jqGettextParser.info(_("Files selected."));
});

/**
 * Start parsing the files.
 */
$("#parse").click(function() {    
    if(! $("#file")[0].files.length) {
        jqGettextParser.info(_("No file selected."));
        return;
    }
    
    var fileList = $("#file")[0].files;
    var actualFile = 0;
    
    var fileReader = new FileReader();
    
    fileReader.onload = function (e) {
        jqGettextParser.info(_("parsing file ") + fileList[actualFile].name + " (" + 
                (actualFile + 1) + "/" + fileList.length + ")");

        jqGettextParser.parseHTML(jQuery.parseHTML(e.target.result));
        jqGettextParser.parseJS(e.target.result);
        
        if(++actualFile < fileList.length) {
            fileReader.readAsText(fileList[actualFile]);
        }
    };
    fileReader.readAsText(fileList[actualFile]);
});

/**
 * Output the jqGettextParser.template as JSON.
 */
$("#write-json").click(function() {    
    var uriContent = "data:application/json," + encodeURIComponent(
        JSON.stringify(jqGettextParser.template, null, 4));
    window.open(uriContent, _('download JSON template'));
});

/**
 * Output the jqGettextParser.template as a POT file.
 */
$("#write-pot").click(function() {    
    var uriContent = "data:application/pot," + encodeURIComponent(
        jqGettext.parseJSONtoPO(jqGettextParser.template));
    window.open(uriContent, _('download POT template'));
});

/**
 * Resets all input fields and clears the jqGettextParser.template. In fact it
 * hard reloads the page.
 */
$("#reset").click(function() {    
    location.reload(true);
});
