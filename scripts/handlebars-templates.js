this["ebirdmybird"] = this["ebirdmybird"] || {};
this["ebirdmybird"]["chrono"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "	<div>"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,(depth0 != null ? depth0.DateObject : depth0),{"name":"nicedate","hash":{},"data":data}))
    + " <a href=\"#taxon/"
    + alias3(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + "</a></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<h3>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.firstSightings : depth0)) != null ? stack1.length : stack1), depth0))
    + " species</h3>\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.firstSightings : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
this["ebirdmybird"]["county"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "    <div><a href=\"#location/"
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</a></div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "  <div>\n    <a href=\"#taxon/"
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</a>\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<h3>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + " <span style='font-weight: lighter'>| "
    + alias4(((helper = (helper = helpers.state || (depth0 != null ? depth0.state : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"state","hash":{},"data":data}) : helper)))
    + "</span></h3>\n\n"
    + ((stack1 = container.invokePartial(partials.thumbnails,depth0,{"name":"thumbnails","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<div id="
    + alias4(((helper = (helper = helpers.chartID || (depth0 != null ? depth0.chartID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"chartID","hash":{},"data":data}) : helper)))
    + " style='padding-top: 10px'></div>\n\n"
    + alias4((helpers.monthgraph || (depth0 && depth0.monthgraph) || alias2).call(alias1,(depth0 != null ? depth0.sightingsByMonth : depth0),(depth0 != null ? depth0.chartID : depth0),{"name":"monthgraph","hash":{},"data":data}))
    + "\n\n<h4>"
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.locations : stack1)) != null ? stack1.length : stack1), depth0))
    + " locations</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.locations : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<h4>"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.taxons : depth0)) != null ? stack1.length : stack1), depth0))
    + " species on "
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.dateObjects : stack1)) != null ? stack1.length : stack1), depth0))
    + " dates</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.taxons : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"usePartial":true,"useData":true});
this["ebirdmybird"]["debug"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "  <div> <img height='32px' src=\""
    + alias4(((helper = (helper = helpers["Thumbnail URL"] || (depth0 != null ? depth0["Thumbnail URL"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Thumbnail URL","hash":{},"data":data}) : helper)))
    + "\"> "
    + alias4(alias5((depth0 != null ? depth0.Location : depth0), depth0))
    + " "
    + alias4(alias5((depth0 != null ? depth0.Date : depth0), depth0))
    + " "
    + alias4(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + " / "
    + alias4(((helper = (helper = helpers["Scientific Name"] || (depth0 != null ? depth0["Scientific Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Scientific Name","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "  <div> <img height='32px' src=\""
    + alias4(((helper = (helper = helpers["Thumbnail URL"] || (depth0 != null ? depth0["Thumbnail URL"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Thumbnail URL","hash":{},"data":data}) : helper)))
    + "\"> "
    + alias4(alias5((depth0 != null ? depth0.Location : depth0), depth0))
    + " <a href=\"#trip/"
    + alias4(((helper = (helper = helpers.Date || (depth0 != null ? depth0.Date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Date","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(alias5((depth0 != null ? depth0.Date : depth0), depth0))
    + "</a> "
    + alias4(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + " / "
    + alias4(((helper = (helper = helpers["Scientific Name"] || (depth0 != null ? depth0["Scientific Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Scientific Name","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "    <div>"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + ", "
    + alias1(container.lambda(depth0, depth0))
    + "</div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "  <div>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "<h3>debugging info</h3>\n<div>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.photos : depth0)) != null ? stack1.length : stack1), depth0))
    + " photos</div>\n\n<h4>Please add an eBird checklist for these "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.photosMissingTrip : depth0)) != null ? stack1.length : stack1), depth0))
    + " photos:</h4>\n\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.photosMissingTrip : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<h4>These "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.photosMissingLocation : depth0)) != null ? stack1.length : stack1), depth0))
    + " photos have locations missing from your eBird data:</h4>\n\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.photosMissingLocation : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<h4>These "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.photosBadScientificName : depth0)) != null ? stack1.length : stack1), depth0))
    + " photos have scientific names missing from your eBird sightings:</h4>\n\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.photosBadScientificName : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<h4>There are no sightings for these custom day names:</h4>\n\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.missingSightingsForCustomDayNames : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<h4>Sighting has slashes:</h4>\n\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.brokenLocations : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
this["ebirdmybird"]["home"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h3>"
    + alias4(((helper = (helper = helpers.owner || (depth0 != null ? depth0.owner : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"owner","hash":{},"data":data}) : helper)))
    + "&apos;s eBird</h3>\n\n<div>\n"
    + alias4((helpers.nicenumber || (depth0 && depth0.nicenumber) || alias2).call(alias1,(depth0 != null ? depth0.numSightings : depth0),{"name":"nicenumber","hash":{},"data":data}))
    + " sightings in "
    + alias4((helpers.nicenumber || (depth0 && depth0.nicenumber) || alias2).call(alias1,(depth0 != null ? depth0.numChecklists : depth0),{"name":"nicenumber","hash":{},"data":data}))
    + " checklists\nfrom "
    + alias4((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,(depth0 != null ? depth0.earliest : depth0),{"name":"nicedate","hash":{},"data":data}))
    + " - "
    + alias4((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,(depth0 != null ? depth0.latest : depth0),{"name":"nicedate","hash":{},"data":data}))
    + "\n</div>\n\n<h4>Sightings by Year</h4>\n\n<div id="
    + alias4(((helper = (helper = helpers.yearChartID || (depth0 != null ? depth0.yearChartID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"yearChartID","hash":{},"data":data}) : helper)))
    + " style='padding-top: 10px'></div>\n\n"
    + alias4((helpers.bargraph || (depth0 && depth0.bargraph) || alias2).call(alias1,(depth0 != null ? depth0.sightingsByYear : depth0),(depth0 != null ? depth0.yearChartID : depth0),{"name":"bargraph","hash":{},"data":data}))
    + "\n\n<h4>Sightings by Month</h4>\n\n<div id="
    + alias4(((helper = (helper = helpers.monthChartID || (depth0 != null ? depth0.monthChartID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"monthChartID","hash":{},"data":data}) : helper)))
    + " style='padding-top: 10px'></div>\n\n"
    + alias4((helpers.monthgraph || (depth0 && depth0.monthgraph) || alias2).call(alias1,(depth0 != null ? depth0.sightingsByMonth : depth0),(depth0 != null ? depth0.monthChartID : depth0),{"name":"monthgraph","hash":{},"data":data}))
    + "\n";
},"useData":true});
this["ebirdmybird"]["location"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "  <div>\n    <a href=\"#taxon/"
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</a>\n  </div>\n";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "  <div>\n    <div><a href=\"#trip/"
    + alias3((helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}))
    + "\">"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,depth0,{"name":"nicedate","hash":{},"data":data}))
    + "</a> "
    + alias3(helpers.lookup.call(alias1,(depths[1] != null ? depths[1].customDayNames : depths[1]),(helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}),{"name":"lookup","hash":{},"data":data}))
    + "</div>\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<h3>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + " <span style='font-weight: lighter'>| <a href=\"#county/"
    + alias4(((helper = (helper = helpers.county || (depth0 != null ? depth0.county : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"county","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.county || (depth0 != null ? depth0.county : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"county","hash":{},"data":data}) : helper)))
    + "</a>, "
    + alias4(((helper = (helper = helpers.state || (depth0 != null ? depth0.state : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"state","hash":{},"data":data}) : helper)))
    + "</span></h3>\n<div><a target=\"_blank\" href=\"https://www.openstreetmap.org/?mlat="
    + alias4(((helper = (helper = helpers.latitude || (depth0 != null ? depth0.latitude : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latitude","hash":{},"data":data}) : helper)))
    + "&mlon="
    + alias4(((helper = (helper = helpers.longitude || (depth0 != null ? depth0.longitude : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"longitude","hash":{},"data":data}) : helper)))
    + "#map=10/"
    + alias4(((helper = (helper = helpers.latitude || (depth0 != null ? depth0.latitude : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latitude","hash":{},"data":data}) : helper)))
    + "/"
    + alias4(((helper = (helper = helpers.longitude || (depth0 != null ? depth0.longitude : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"longitude","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.latitude || (depth0 != null ? depth0.latitude : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latitude","hash":{},"data":data}) : helper)))
    + ","
    + alias4(((helper = (helper = helpers.longitude || (depth0 != null ? depth0.longitude : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"longitude","hash":{},"data":data}) : helper)))
    + "</a></div>\n\n"
    + ((stack1 = container.invokePartial(partials.thumbnails,depth0,{"name":"thumbnails","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<h4>"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.taxons : depth0)) != null ? stack1.length : stack1), depth0))
    + " species</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.taxons : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<h4>"
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.dateObjects : stack1)) != null ? stack1.length : stack1), depth0))
    + " dates</h4>\n\n<div id="
    + alias4(((helper = (helper = helpers.chartID || (depth0 != null ? depth0.chartID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"chartID","hash":{},"data":data}) : helper)))
    + " style='padding-top: 10px'></div>\n\n"
    + alias4((helpers.monthgraph || (depth0 && depth0.monthgraph) || alias2).call(alias1,(depth0 != null ? depth0.sightingsByMonth : depth0),(depth0 != null ? depth0.chartID : depth0),{"name":"monthgraph","hash":{},"data":data}))
    + "\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.dateObjects : stack1),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"usePartial":true,"useData":true,"useDepths":true});
this["ebirdmybird"]["locations"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div><a href=\"#location/"
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</a></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<h3>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.locations : depth0)) != null ? stack1.length : stack1), depth0))
    + " locations</h3>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.locations : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
this["ebirdmybird"]["photo"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h3>"
    + alias4(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + " <span style='font-weight: lighter'>| "
    + alias4(((helper = (helper = helpers["Scientific Name"] || (depth0 != null ? depth0["Scientific Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Scientific Name","hash":{},"data":data}) : helper)))
    + "</span></h3>\n<div>"
    + alias4(((helper = (helper = helpers.Location || (depth0 != null ? depth0.Location : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Location","hash":{},"data":data}) : helper)))
    + ", "
    + alias4(((helper = (helper = helpers.Date || (depth0 != null ? depth0.Date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Date","hash":{},"data":data}) : helper)))
    + "</div>\n\n<img src=\""
    + alias4(((helper = (helper = helpers["Photo URL"] || (depth0 != null ? depth0["Photo URL"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Photo URL","hash":{},"data":data}) : helper)))
    + "\">";
},"useData":true});
this["ebirdmybird"]["photos"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div><a href=\"#taxon/"
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</a></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<h3>"
    + alias3((helpers.nicenumber || (depth0 && depth0.nicenumber) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.photos : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " photos of "
    + alias3((helpers.nicenumber || (depth0 && depth0.nicenumber) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.photoCommonNames : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " species</h3>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.photoCommonNames : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
this["ebirdmybird"]["taxon"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "  <div>\n    <a href=\"#trip/"
    + alias2(alias1((depth0 != null ? depth0.Date : depth0), depth0))
    + "\">"
    + alias2((helpers.nicedate || (depth0 && depth0.nicedate) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.DateObject : depth0),{"name":"nicedate","hash":{},"data":data}))
    + "</a>\n    <a href=\"#location/"
    + alias2(alias1((depth0 != null ? depth0.Location : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.Location : depth0), depth0))
    + "</a>\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h3>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + " <span style='font-weight: lighter'>| "
    + alias4(((helper = (helper = helpers.scientificName || (depth0 != null ? depth0.scientificName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"scientificName","hash":{},"data":data}) : helper)))
    + "</span></h3>\n\n"
    + ((stack1 = container.invokePartial(partials.thumbnails,depth0,{"name":"thumbnails","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<h4>"
    + alias4((helpers.nicenumber || (depth0 && depth0.nicenumber) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.sightings : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " sightings</h4>\n\n<div id="
    + alias4(((helper = (helper = helpers.chartID || (depth0 != null ? depth0.chartID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"chartID","hash":{},"data":data}) : helper)))
    + " style='padding-top: 10px'></div>\n\n"
    + alias4((helpers.monthgraph || (depth0 && depth0.monthgraph) || alias2).call(alias1,(depth0 != null ? depth0.sightingsByMonth : depth0),(depth0 != null ? depth0.chartID : depth0),{"name":"monthgraph","hash":{},"data":data}))
    + "\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.sightings : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"usePartial":true,"useData":true});
this["ebirdmybird"]["taxons"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div><a href=\"#taxon/"
    + alias4(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + "</a></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<h3>"
    + container.escapeExpression((helpers.nicenumber || (depth0 && depth0.nicenumber) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.lifeSightings : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " species</h3>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.lifeSightings : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
this["ebirdmybird"]["trip"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "  <div style='font-style: italic'>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <span><a href=\"#photo/"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><img width=\"85px\" height=\"85px\" src=\""
    + alias4(((helper = (helper = helpers["Thumbnail URL"] || (depth0 != null ? depth0["Thumbnail URL"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Thumbnail URL","hash":{},"data":data}) : helper)))
    + "\"></a></span>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.locations : stack1)) != null ? stack1.length : stack1), depth0))
    + " locations\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.locations : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "  <div>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.multipleLocations : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <a href='#taxon/"
    + alias2(alias1(depth0, depth0))
    + "'>"
    + alias2(alias1(depth0, depth0))
    + "</a>\n  </div>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "    <a href='#location/"
    + alias2(alias1((depth0 != null ? depth0.Location : depth0), depth0))
    + "'>"
    + alias2(alias1((depth0 != null ? depth0.Location : depth0), depth0))
    + "</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<h3>"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,(depth0 != null ? depth0.tripDate : depth0),{"name":"nicedate","hash":{},"data":data}))
    + " <span style='font-weight: lighter'>| "
    + alias3(((helper = (helper = helpers.customName || (depth0 != null ? depth0.customName : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"customName","hash":{},"data":data}) : helper)))
    + "</span></h3>\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.comments : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.photos : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = container.invokePartial(partials.thumbnails,depth0,{"name":"thumbnails","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<h4>\n  "
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.taxons : depth0)) != null ? stack1.length : stack1), depth0))
    + " species at\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.multipleLocations : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.taxons : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"usePartial":true,"useData":true});
this["ebirdmybird"]["trips"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div><a href=\"#trip/"
    + alias3((helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}))
    + "\">"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,depth0,{"name":"nicedate","hash":{},"data":data}))
    + "</a> "
    + alias3(helpers.lookup.call(alias1,(depths[1] != null ? depths[1].customDayNames : depths[1]),(helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}),{"name":"lookup","hash":{},"data":data}))
    + "</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<h3>"
    + container.escapeExpression((helpers.nicenumber || (depth0 && depth0.nicenumber) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.trips : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " trips</h3>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.trips : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true,"useDepths":true});
this["ebirdmybird"]["year"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "  <div><a href=\"#taxon/"
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</a></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<h3>"
    + alias3(((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"year","hash":{},"data":data}) : helper)))
    + " Year List</h3>\n\n<div>"
    + alias3((helpers.nicenumber || (depth0 && depth0.nicenumber) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.yearSightings : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " sightings, "
    + alias3((helpers.nicenumber || (depth0 && depth0.nicenumber) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.yearSpecies : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " species, "
    + alias3((helpers.nicenumber || (depth0 && depth0.nicenumber) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.photos : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " photos</div>\n\n"
    + ((stack1 = container.invokePartial(partials.thumbnails,depth0,{"name":"thumbnails","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.yearSpecies : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"usePartial":true,"useData":true});