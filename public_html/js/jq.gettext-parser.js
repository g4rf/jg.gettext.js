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

var jqGettextParser = {
    template: {},
    
    info: function(msg) {
        $("#info").prepend(msg + "<br />");
    },
    
    parseHTML: function(data) {
        var nodes = $(data).find(":not(iframe)").addBack().contents().filter(function() {
            return this.nodeType === 3 && jQuery.trim(this.nodeValue);
        });
        jQuery.each(nodes, function(index, node) {
            if(typeof jqGettextParser.template[node.nodeValue] === "undefined")
                jqGettextParser.template[node.nodeValue] = "";
        });
    },
    
    parseJS: function(data) {
        data.replace(/_\(["|'](.+?)["|']\)/g, function(m, string) {
            if(typeof jqGettextParser.template[string] === "undefined")
                jqGettextParser.template[string] = "";
        });
    }
};

$("#parse").click(function() {
    jqGettextParser.info("----------------------");
    
    if(! $("#file")[0].files.length) {
        jqGettextParser.info(_("No file selected."));
        return;
    }
    
    var template = $("#template")[0].files[0] || null;
    var fileList = $("#file")[0].files;
    var actualFile = 0;
    
    var templateReader = new FileReader();
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
    
    templateReader.onload = function (e) {
        var t = {};
        switch(template.name.substr(-4)) {
            case "json":        
                t = jQuery.parseJSON(e.target.result);
                break;
            case ".pot":
                t = jqGettext.parsePOtoJSON(e.target.result);
                break;
            default:
                jqGettextParser.info(_("Template file format not recognized!"));
                jqGettextParser.info(_("Process canceled."));
                return;
        }
        jQuery.each(t, function(key, value) {
            jqGettextParser.template[key] = value;
        });        
        
        fileReader.readAsText(fileList[actualFile]);
    };
    
    if(template) {
        templateReader.readAsText(template);
    } else {
        fileReader.readAsText(fileList[actualFile]);
    }
});

$("#write-json").click(function() {    
    var uriContent = "data:application/json," + encodeURIComponent(
        JSON.stringify(jqGettextParser.template, null, 4));
    window.open(uriContent, _('download JSON template'));
});

$("#write-pot").click(function() {    
    var uriContent = "data:application/pot," + encodeURIComponent(
        jqGettext.parseJSONtoPO(jqGettextParser.template));
    window.open(uriContent, _('download POT template'));
});

$("#reset").click(function() {    
    location.reload(true);
});
