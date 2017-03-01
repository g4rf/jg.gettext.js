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
 *  - add pot/mo/po support
 */

var jqParser = {
    template: {},
    
    info: function(msg) {
        $("#info").append(msg);
    },
    
    parseHTML: function(data) {
        var nodes = $(data).find(":not(iframe)").addBack().contents().filter(function() {
            return this.nodeType === 3 && jQuery.trim(this.nodeValue);
        });
        jQuery.each(nodes, function(index, node) {
            if(typeof jqParser.template[node.nodeValue] === "undefined")
                jqParser.template[node.nodeValue] = "";
        });
        jqParser.writeTemplate();
    },
    
    parseJS: function(data) {
        
    },
    
    writeTemplate: function() {
        var uriContent = "data:application/json," + encodeURIComponent(
                JSON.stringify(jqParser.template, null, 4));
        window.open(uriContent, 'download JSON template');
    }
};

$("#parse").click(function() {
    var template = $("#template")[0].files[0] || null;
    var file =  $("#file")[0].files[0] || null;
    
    var templateReader = new FileReader();
    var fileReader = new FileReader();
    
    $("#info").empty();
    
    if(! file) {
        jqParser.info("No file selected.");
        return;
    }

    fileReader.onload = function (e) {
        // console.log(e.target.result);
        jqParser.parseHTML(jQuery.parseHTML(e.target.result));
        jqParser.parseJS(e.target.result);
    };
    templateReader.onload = function (e) {
        // console.log(e.target.result);
        jqParser.template = jQuery.parseJSON(e.target.result);
        fileReader.readAsText(file);
    };
    
    if(template) {
        templateReader.readAsText(template);
    } else {
        fileReader.readAsText(file);
    }
});
