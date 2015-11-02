var endpoint = "http://localhost:8080";
var getMetrics = endpoint + "/metrics";
var getCubes = endpoint + "/cubes";
var getMatrixAggr = endpoint + "/matrix-aggregation";
var getRanking = endpoint + "/cubes/{id}/compute-ranking";
var getSimilarity = endpoint + "/cubes/{id}/compute-similarity";
var getCube = endpoint + "/cubes/{id}";


function requestCube(c) {
    console.log("hello")
    var id = $("#previewSelect-" + c + " option:selected").text();
    var url = getCube.replace("{id}", id);
    var target = "#cube-" + c;
    console.log(target)
    $(target).empty();

    $.getJSON(url).done(function (data) {
        console.log(data)
        $(target).append("<b>Id:</b> " + data.id + "<br/>");
        $(target).append("<b>Label:</b> " + data.label + "<br/>");
        $(target).append("<b>Concept:</b> <a href='" + data.concept + "'>" + data.concept + "</a><br/>");
        //$(target).append("<b>sparqlEndpoint:</b> " + data.sparqlEndpoint.url + "<br/>");
        $(target).append("<b>#Measures:</b> " +   data.structureDefinition.measures.length + "<br/>");
        $(target).append("<b>#Dimensions:</b> " + data.structureDefinition.dimensions.length + "<br/>");
        $(target).append("<br/><b>Measures:</b><br/><ul>");
        $.each(data.structureDefinition.measures, function(index, value) {
            $(target).append("<li><a href='" + value.concept + "'>" + value.concept + "</a> : " + value.label + "</li>");
        });
        $(target).append("</ul><br/><b>Dimensions:</b><br/><ul>");
        $.each(data.structureDefinition.dimensions, function(index, value) {
            $(target).append("<li><a href='" + value.concept + "'>" + value.concept + "</a> : " + value.label + "</li>");
        });
    });
}

function requestSimilarity() {
    var id = $("#simSelect option:selected").text();
    var secondCube = $("#simSelect2 option:selected").text();
    var metric = $("#metricSimSelect option:selected").text();
    var matrixAggr = $("#simMatrixAggr option:selected").text();
    var url = getSimilarity.replace("{id}", id);
    
    $("#similarityValue").empty();
    $("#similarityMatrix").empty();
    $("#similairtyMapping").empty();

    $.getJSON(url, {
        "secondCube": secondCube,
        "metric": metric,
        "matrixAggr": matrixAggr
    }).done(function (data) {
        $("#similarityValue").append(data.similarityMatrix.similarity);
        $("#similarityMatrix").append("<table>");
        $.each(data.similarityMatrix.matrix, function(index, value) {
            $("#similarityMatrix").append("<tr>");
            $.each(value, function(index, val) {
               $("#similarityMatrix").append("<td>&nbsp;" + val + "&nbsp;</td>"); 
            });
            $("#similarityMatrix").append("</tr>");
        });
        $("#similarityMatrix").append("</table>");
        
        if (data.similarityMatrix.mapping != null) {
            $("#similairtyMapping").append("<b>row : column</b><br/>");
            $.each(data.similarityMatrix.mapping, function(index, value) {
                $("#similairtyMapping").append(index + " : " + value + "<br/>");
            });
        } else {
            $("#similairtyMapping").append("Not available");
        }
        
    });
}

function requestRanking() {
    var cube = $("#rankSelect option:selected").text();
    var metric = $("#metricRankSelect option:selected").text();
    var matrixAggr = $("#rankMatrixAggr option:selected").text();

    var url = getRanking.replace("{id}", cube);

    $.getJSON(url, {
        "metric": metric,
        "matrixAggr": matrixAggr
    }).done(function (data) {
        $("#rankingResult").empty();

        $.each(data, function(index, value) {
            $("#rankingResult").append("<li>" + value.similarityMatrix.similarity + " - " + value.targetId + "</li>");
        }); 
    });
}

function requestCubes() {
    var limit = $("#limit").val();

    $.getJSON(getCubes, {
        "limit": limit
    }).done(function (data) {
        $("#cubeList").empty();
        $.each(data, function (i) {
            $("#previewSelect-1").append("<option>" + data[i].id + "</option>");
            $("#previewSelect-2").append("<option>" + data[i].id + "</option>");
            $("#simSelect").append("<option>" + data[i].id + "</option>");
            $("#simSelect2").append("<option>" + data[i].id + "</option>");
            $("#rankSelect").append("<option>" + data[i].id + "</option>");
        });
    });
}


function requestMetrics() {
    $.getJSON(getMetrics).done(function (data) {
        var metricAvailable = data.componentBased;
        $.each(metricAvailable, function (i) {
            $("#metricSimSelect").append("<option>" + metricAvailable[i] + "</option>");
            $("#metricRankSelect").append("<option>" + metricAvailable[i] + "</option>");
        });
    });
}

function requestMatrixAggr() {
    $.getJSON(getMatrixAggr).done(function (data) {
        $.each(data, function (i) {
            $("#simMatrixAggr").append("<option>" + data[i] + "</option>");
            $("#rankMatrixAggr").append("<option>" + data[i] + "</option>");
        });
    });
}

function initData() {
    requestMetrics();
    requestCubes();
    requestMatrixAggr();
}

$(document).ready(function () {

    initData();

    $("#ranking").click(requestRanking);
    $("#similarity").click(requestSimilarity);
    $("#requestCubeDetail-1").click(function() {
        requestCube("1")
    });
    $("#requestCubeDetail-2").click(function() {
        requestCube("2")
    });
});