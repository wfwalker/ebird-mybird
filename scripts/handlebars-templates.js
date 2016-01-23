this["ebirdmybird"] = this["ebirdmybird"] || {};
this["ebirdmybird"]["bigdays"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "		<div>\n			"
    + alias2(alias1((depth0 != null ? depth0.count : depth0), depth0))
    + " species,\n			<a href=\"#trip/"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "\">\n				"
    + alias2((helpers.nicedate || (depth0 && depth0.nicedate) || helpers.helperMissing).call(alias3,(depth0 != null ? depth0.dateObject : depth0),{"name":"nicedate","hash":{},"data":data}))
    + ": "
    + alias2(helpers.lookup.call(alias3,(depths[1] != null ? depths[1].customDayNames : depths[1]),(depth0 != null ? depth0.date : depth0),{"name":"lookup","hash":{},"data":data}))
    + "\n			</a>\n		</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<h3>Big days</h3>\n\n<div>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.bigDays : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true,"useDepths":true});
this["ebirdmybird"]["chrono"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "	<div class='biglist-item'>\n		"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,(depth0 != null ? depth0.DateObject : depth0),{"name":"nicedate","hash":{},"data":data}))
    + " <a href=\"#taxon/"
    + alias3(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + "</a>\n	</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<h3>"
    + container.escapeExpression((helpers.nicenumber || (depth0 && depth0.nicenumber) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.firstSightings : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " species</h3>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.firstSightings : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
this["ebirdmybird"]["county"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "    <div class='biglist-item'><a href=\"#location/"
    + alias1((helpers.encode || (depth0 && depth0.encode) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias1(container.lambda(depth0, depth0))
    + "</a></div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "  <div class='biglist-item'>\n    <a href=\"#taxon/"
    + alias1((helpers.encode || (depth0 && depth0.encode) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias1(container.lambda(depth0, depth0))
    + "</a>\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h3>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + " County<span style='font-weight: lighter'>| "
    + alias4(((helper = (helper = helpers.state || (depth0 != null ? depth0.state : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"state","hash":{},"data":data}) : helper)))
    + "</span></h3>\n\n"
    + ((stack1 = container.invokePartial(partials.thumbnails,depth0,{"name":"thumbnails","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<div id="
    + alias4(((helper = (helper = helpers.chartID || (depth0 != null ? depth0.chartID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"chartID","hash":{},"data":data}) : helper)))
    + " style='padding-top: 10px'></div>\n\n"
    + alias4((helpers.monthgraph || (depth0 && depth0.monthgraph) || alias2).call(alias1,(depth0 != null ? depth0.sightingsByMonth : depth0),(depth0 != null ? depth0.chartID : depth0),{"name":"monthgraph","hash":{},"data":data}))
    + "\n\n<h4>"
    + alias4((helpers.valuecount || (depth0 && depth0.valuecount) || alias2).call(alias1,(depth0 != null ? depth0.sightingList : depth0),"Location",{"name":"valuecount","hash":{},"data":data}))
    + " Locations</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(helpers.values || (depth0 && depth0.values) || alias2).call(alias1,(depth0 != null ? depth0.sightingList : depth0),"Location",{"name":"values","hash":{},"data":data}),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<h4>"
    + alias4((helpers.valuecount || (depth0 && depth0.valuecount) || alias2).call(alias1,(depth0 != null ? depth0.sightingList : depth0),"Common Name",{"name":"valuecount","hash":{},"data":data}))
    + " Species on "
    + alias4(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.dateObjects : stack1)) != null ? stack1.length : stack1), depth0))
    + " Dates</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(helpers.values || (depth0 && depth0.values) || alias2).call(alias1,(depth0 != null ? depth0.sightingList : depth0),"Common Name",{"name":"values","hash":{},"data":data}),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
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
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "<h3>"
    + alias3(((helper = (helper = helpers.owner || (depth0 != null ? depth0.owner : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"owner","hash":{},"data":data}) : helper)))
    + "&apos;s eBird</h3>\n\n<h4>Photo Of The Week</h4>\n\n<img src=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.photoOfTheWeek : depth0)) != null ? stack1["Photo URL"] : stack1), depth0))
    + "\">\n\n<div>\n	<a href=\"#taxon/"
    + alias3((helpers.encode || (depth0 && depth0.encode) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.photoOfTheWeek : depth0)) != null ? stack1["Common Name"] : stack1),{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.photoOfTheWeek : depth0)) != null ? stack1["Common Name"] : stack1), depth0))
    + "</a>,\n	<a href=\"#location/"
    + alias3((helpers.encode || (depth0 && depth0.encode) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.photoOfTheWeek : depth0)) != null ? stack1.Location : stack1),{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.photoOfTheWeek : depth0)) != null ? stack1.Location : stack1), depth0))
    + "</a>,\n	<a href=\"#trip/"
    + alias3((helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.photoOfTheWeek : depth0)) != null ? stack1.DateObject : stack1),{"name":"ebirddate","hash":{},"data":data}))
    + "\">"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.photoOfTheWeek : depth0)) != null ? stack1.DateObject : stack1),{"name":"nicedate","hash":{},"data":data}))
    + "</a>\n</div>\n\n";
},"useData":true});
this["ebirdmybird"]["loading"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<h3>"
    + container.escapeExpression(((helper = (helper = helpers.owner || (depth0 != null ? depth0.owner : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"owner","hash":{},"data":data}) : helper)))
    + "&apos;s eBird</h3>\n\n<div>\nLOADING\n</div>\n";
},"useData":true});
this["ebirdmybird"]["location"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "  <div class='biglist-item'>\n    <a href=\"#taxon/"
    + alias1((helpers.encode || (depth0 && depth0.encode) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias1(container.lambda(depth0, depth0))
    + "</a>\n  </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "	<div id="
    + alias3(((helper = (helper = helpers.chartID || (depth0 != null ? depth0.chartID : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"chartID","hash":{},"data":data}) : helper)))
    + " style='padding-top: 10px'></div>\n	"
    + alias3((helpers.monthgraph || (depth0 && depth0.monthgraph) || alias2).call(alias1,(depth0 != null ? depth0.sightingsByMonth : depth0),(depth0 != null ? depth0.chartID : depth0),{"name":"monthgraph","hash":{},"data":data}))
    + "\n";
},"5":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "	<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.dateObjects : stack1),{"name":"each","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</div>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "	  <div class='biglist-item'>\n	    <div><a href=\"#trip/"
    + alias3((helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}))
    + "\">"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,depth0,{"name":"nicedate","hash":{},"data":data}))
    + "</a> "
    + alias3(helpers.lookup.call(alias1,(depths[1] != null ? depths[1].customDayNames : depths[1]),(helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}),{"name":"lookup","hash":{},"data":data}))
    + "</div>\n	  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<h3>\n	"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.Location : stack1), depth0))
    + "<span style='font-weight: lighter'>| <a href=\"#county/"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.County : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.County : stack1), depth0))
    + " County</a>, "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1["State/Province"] : stack1), depth0))
    + "</span>\n</h3>\n\n<div>\n	<a target=\"_blank\" href=\"https://www.openstreetmap.org/?mlat="
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.Latitude : stack1), depth0))
    + "&mlon="
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.Longitude : stack1), depth0))
    + "#map=10/"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.Latitude : stack1), depth0))
    + "/"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.Longitude : stack1), depth0))
    + "\">\n		"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.Latitude : stack1), depth0))
    + ","
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.Latitude : stack1), depth0))
    + "\n	</a>\n</div>\n\n\n"
    + ((stack1 = container.invokePartial(partials.thumbnails,depth0,{"name":"thumbnails","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<h4>"
    + alias2((helpers.valuecount || (depth0 && depth0.valuecount) || alias4).call(alias3,(depth0 != null ? depth0.sightingList : depth0),"Common Name",{"name":"valuecount","hash":{},"data":data}))
    + " Species</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias3,(helpers.values || (depth0 && depth0.values) || alias4).call(alias3,(depth0 != null ? depth0.sightingList : depth0),"Common Name",{"name":"values","hash":{},"data":data}),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<h4>"
    + alias2((helpers.valuecount || (depth0 && depth0.valuecount) || alias4).call(alias3,(depth0 != null ? depth0.sightingList : depth0),"Date",{"name":"valuecount","hash":{},"data":data}))
    + " Dates</h4>\n\n"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.showChart : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.program(5, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n\n";
},"usePartial":true,"useData":true,"useDepths":true});
this["ebirdmybird"]["locations"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "		<h2>"
    + container.escapeExpression(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "</h2>\n"
    + ((stack1 = helpers.each.call(alias1,depth0,{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "			<h3><a href=\"#county/"
    + alias3((helpers.encode || (depth0 && depth0.encode) || alias2).call(alias1,(data && data.key),{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias3(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " County</a></h3>\n"
    + ((stack1 = helpers.each.call(alias1,depth0,{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "				<div class='biglist-item'><a href=\"#location/"
    + alias1((helpers.encode || (depth0 && depth0.encode) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias1(container.lambda(depth0, depth0))
    + "</a></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<h3>"
    + container.escapeExpression(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"count","hash":{},"data":data}) : helper)))
    + " Locations</h3>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.hierarchy : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
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
    + alias4((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,(depth0 != null ? depth0.DateObject : depth0),{"name":"nicedate","hash":{},"data":data}))
    + "</div>\n\n<img src=\""
    + alias4(((helper = (helper = helpers["Photo URL"] || (depth0 != null ? depth0["Photo URL"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Photo URL","hash":{},"data":data}) : helper)))
    + "\">";
},"useData":true});
this["ebirdmybird"]["photos"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "<div><a href=\"#taxon/"
    + alias1((helpers.encode || (depth0 && depth0.encode) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias1(container.lambda(depth0, depth0))
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
this["ebirdmybird"]["searchresults"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "    <div class='biglist-item'><a href=\"#trip/"
    + alias3((helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}))
    + "\">"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,depth0,{"name":"nicedate","hash":{},"data":data}))
    + "</a> "
    + alias3(helpers.lookup.call(alias1,(depths[1] != null ? depths[1].customDayNames : depths[1]),(helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}),{"name":"lookup","hash":{},"data":data}))
    + "</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "    <div class='biglist-item'><a href=\"#location/"
    + alias1((helpers.encode || (depth0 && depth0.encode) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias1(container.lambda(depth0, depth0))
    + "</a></div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "  <div class='biglist-item'>\n    <a href='#taxon/"
    + alias1((helpers.encode || (depth0 && depth0.encode) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"encode","hash":{},"data":data}))
    + "'>"
    + alias1(container.lambda(depth0, depth0))
    + "</a>\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {}, alias3=helpers.helperMissing;

  return "<h3>search results</h3>\n\n<h4>"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.dates : depth0)) != null ? stack1.length : stack1), depth0))
    + " Dates</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias2,(depth0 != null ? depth0.dates : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<h4>"
    + alias1((helpers.valuecount || (depth0 && depth0.valuecount) || alias3).call(alias2,(depth0 != null ? depth0.sightingList : depth0),"Location",{"name":"valuecount","hash":{},"data":data}))
    + " Locations</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias2,(helpers.values || (depth0 && depth0.values) || alias3).call(alias2,(depth0 != null ? depth0.sightingList : depth0),"Location",{"name":"values","hash":{},"data":data}),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<h4>"
    + alias1((helpers.valuecount || (depth0 && depth0.valuecount) || alias3).call(alias2,(depth0 != null ? depth0.sightingList : depth0),"Common Name",{"name":"valuecount","hash":{},"data":data}))
    + " Species</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias2,(helpers.values || (depth0 && depth0.values) || alias3).call(alias2,(depth0 != null ? depth0.sightingList : depth0),"Common Name",{"name":"values","hash":{},"data":data}),{"name":"each","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true,"useDepths":true});
this["ebirdmybird"]["sighting"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "    <div>"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + " = "
    + alias1(container.lambda(depth0, depth0))
    + "</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=container.lambda, alias3=container.escapeExpression, alias4=helpers.helperMissing, alias5="function";

  return "<h3>Sighting</h3>\n\n"
    + ((stack1 = helpers.each.call(alias1,depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<h4>JSON for photos.json</h4>\n\n<pre>\n  {\n    \"Date\": \""
    + alias3(alias2((depth0 != null ? depth0.Date : depth0), depth0))
    + "\",\n    \"Location\": \""
    + alias3(alias2((depth0 != null ? depth0.Location : depth0), depth0))
    + "\",\n    \"Scientific Name\": \""
    + alias3(((helper = (helper = helpers["Scientific Name"] || (depth0 != null ? depth0["Scientific Name"] : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias1,{"name":"Scientific Name","hash":{},"data":data}) : helper)))
    + "\",\n    \"Common Name\": \""
    + alias3(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + "\",\n    \"Thumbnail URL\": \"http://birdwalker.com/images/thumb/"
    + alias3((helpers.sortabledate || (depth0 && depth0.sortabledate) || alias4).call(alias1,(depth0 != null ? depth0.DateObject : depth0),{"name":"sortabledate","hash":{},"data":data}))
    + "-"
    + alias3((helpers.spacetodash || (depth0 && depth0.spacetodash) || alias4).call(alias1,(depth0 != null ? depth0["Scientific Name"] : depth0),{"name":"spacetodash","hash":{},"data":data}))
    + "-NNNNNN.jpg\",\n    \"Photo URL\": \"http://birdwalker.com/images/photo/"
    + alias3((helpers.sortabledate || (depth0 && depth0.sortabledate) || alias4).call(alias1,(depth0 != null ? depth0.DateObject : depth0),{"name":"sortabledate","hash":{},"data":data}))
    + "-"
    + alias3((helpers.spacetodash || (depth0 && depth0.spacetodash) || alias4).call(alias1,(depth0 != null ? depth0["Scientific Name"] : depth0),{"name":"spacetodash","hash":{},"data":data}))
    + "-NNNNNN.jpg\"\n  }\n</pre>\n";
},"useData":true});
this["ebirdmybird"]["stats"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
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
this["ebirdmybird"]["taxon"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "	<div id="
    + alias3(((helper = (helper = helpers.chartID || (depth0 != null ? depth0.chartID : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"chartID","hash":{},"data":data}) : helper)))
    + " style='padding-top: 10px'></div>\n	"
    + alias3((helpers.monthgraph || (depth0 && depth0.monthgraph) || alias2).call(alias1,(depth0 != null ? depth0.sightingsByMonth : depth0),(depth0 != null ? depth0.chartID : depth0),{"name":"monthgraph","hash":{},"data":data}))
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "	<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.sightings : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "			<div class='biglist-item'>\n				<a href=\"#trip/"
    + alias2(alias1((depth0 != null ? depth0.Date : depth0), depth0))
    + "\">"
    + alias2((helpers.nicedate || (depth0 && depth0.nicedate) || alias4).call(alias3,(depth0 != null ? depth0.DateObject : depth0),{"name":"nicedate","hash":{},"data":data}))
    + "</a>\n				<a href=\"#location/"
    + alias2((helpers.encode || (depth0 && depth0.encode) || alias4).call(alias3,(depth0 != null ? depth0.Location : depth0),{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.Location : depth0), depth0))
    + "</a>\n			</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h3>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + " <span style='font-weight: lighter'>| "
    + alias4(((helper = (helper = helpers.scientificName || (depth0 != null ? depth0.scientificName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"scientificName","hash":{},"data":data}) : helper)))
    + "</span></h3>\n\n<div>\n	<a target=\"_blank\" href=\"http://www.xeno-canto.org/species/"
    + alias4((helpers.spacetodash || (depth0 && depth0.spacetodash) || alias2).call(alias1,(depth0 != null ? depth0.scientificName : depth0),{"name":"spacetodash","hash":{},"data":data}))
    + "\">xeno-canto</a> |\n	<a target=\"_blank\" href=\"http://en.wikipedia.org/wiki/"
    + alias4((helpers.spacetounder || (depth0 && depth0.spacetounder) || alias2).call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"spacetounder","hash":{},"data":data}))
    + "\">wikipedia</a>\n</div>\n\n"
    + ((stack1 = container.invokePartial(partials.thumbnails,depth0,{"name":"thumbnails","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<h4>"
    + alias4((helpers.nicenumber || (depth0 && depth0.nicenumber) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.sightings : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " sightings</h4>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showChart : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
this["ebirdmybird"]["taxons"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class='biglist-item'><a href=\"#taxon/"
    + alias3((helpers.encode || (depth0 && depth0.encode) || alias2).call(alias1,(depth0 != null ? depth0["Common Name"] : depth0),{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias3(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
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
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "  <span><a target='_blank' href='http://ebird.org/ebird/view/checklist?subID="
    + alias2(alias1(depth0, depth0))
    + "'>"
    + alias2(alias1(depth0, depth0))
    + "</a></span>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "    "
    + container.escapeExpression((helpers.valuecount || (depth0 && depth0.valuecount) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.sightingList : depth0),"Location",{"name":"valuecount","hash":{},"data":data}))
    + " locations\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "    "
    + container.escapeExpression((helpers.values || (depth0 && depth0.values) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.sightingList : depth0),"Location",{"name":"values","hash":{},"data":data}))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "    MULTI\n"
    + ((stack1 = helpers.each.call(alias1,(helpers.values || (depth0 && depth0.values) || helpers.helperMissing).call(alias1,(depth0 != null ? depth0.sightingList : depth0),"Common Name",{"name":"values","hash":{},"data":data}),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "      <div class='biglist-item'>\n        <a href='#taxon/"
    + alias1((helpers.encode || (depth0 && depth0.encode) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"encode","hash":{},"data":data}))
    + "'>"
    + alias1(container.lambda(depth0, depth0))
    + "</a>\n      </div>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.sightingList : depth0)) != null ? stack1.rows : stack1),{"name":"each","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "      <div class='biglist-item'>\n        <a href='#taxon/"
    + alias3((helpers.encode || (depth0 && depth0.encode) || alias2).call(alias1,(depth0 != null ? depth0["Common Name"] : depth0),{"name":"encode","hash":{},"data":data}))
    + "'>"
    + alias3(((helper = (helper = helpers["Common Name"] || (depth0 != null ? depth0["Common Name"] : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"Common Name","hash":{},"data":data}) : helper)))
    + "</a>\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.isnumber || (depth0 && depth0.isnumber) || alias2).call(alias1,(depth0 != null ? depth0.Count : depth0),{"name":"isnumber","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <a href=\"#sighting/"
    + alias3(container.lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "\">+</a>\n      </div>\n      <span>\n        "
    + alias3(((helper = (helper = helpers["Species Comments"] || (depth0 != null ? depth0["Species Comments"] : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"Species Comments","hash":{},"data":data}) : helper)))
    + "\n      </span>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var helper;

  return "          "
    + container.escapeExpression(((helper = (helper = helpers.Count || (depth0 != null ? depth0.Count : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"Count","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<h3>"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,(depth0 != null ? depth0.tripDate : depth0),{"name":"nicedate","hash":{},"data":data}))
    + " <span style='font-weight: lighter'>| "
    + alias3(((helper = (helper = helpers.customName || (depth0 != null ? depth0.customName : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"customName","hash":{},"data":data}) : helper)))
    + "</span></h3>\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.comments : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = container.invokePartial(partials.thumbnails,depth0,{"name":"thumbnails","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<div>\n"
    + ((stack1 = helpers.each.call(alias1,(helpers.values || (depth0 && depth0.values) || alias2).call(alias1,(depth0 != null ? depth0.sightingList : depth0),"Submission ID",{"name":"values","hash":{},"data":data}),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<h4>\n  "
    + alias3((helpers.valuecount || (depth0 && depth0.valuecount) || alias2).call(alias1,(depth0 != null ? depth0.sightingList : depth0),"Common Name",{"name":"valuecount","hash":{},"data":data}))
    + " species at\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.multiplevalues || (depth0 && depth0.multiplevalues) || alias2).call(alias1,(depth0 != null ? depth0.sightingList : depth0),"Location",{"name":"multiplevalues","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "</h4>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.multiplevalues || (depth0 && depth0.multiplevalues) || alias2).call(alias1,(depth0 != null ? depth0.sightingList : depth0),"Location",{"name":"multiplevalues","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"usePartial":true,"useData":true});
this["ebirdmybird"]["trips"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "		<div class='biglist-item'>\n			<a href=\"#trip/"
    + alias3((helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}))
    + "\">"
    + alias3((helpers.nicedate || (depth0 && depth0.nicedate) || alias2).call(alias1,depth0,{"name":"nicedate","hash":{},"data":data}))
    + "</a>\n			"
    + alias3(helpers.lookup.call(alias1,(depths[1] != null ? depths[1].customDayNames : depths[1]),(helpers.ebirddate || (depth0 && depth0.ebirddate) || alias2).call(alias1,depth0,{"name":"ebirddate","hash":{},"data":data}),{"name":"lookup","hash":{},"data":data}))
    + "\n		</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<h3>"
    + container.escapeExpression((helpers.nicenumber || (depth0 && depth0.nicenumber) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.trips : depth0)) != null ? stack1.length : stack1),{"name":"nicenumber","hash":{},"data":data}))
    + " trips</h3>\n\n<div class=\"biglist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.trips : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true,"useDepths":true});
this["ebirdmybird"]["year"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "  <div class='biglist-item'><a href=\"#taxon/"
    + alias1((helpers.encode || (depth0 && depth0.encode) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"encode","hash":{},"data":data}))
    + "\">"
    + alias1(container.lambda(depth0, depth0))
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