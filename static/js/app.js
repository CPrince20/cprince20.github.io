function gatherData(id) {
    
    d3.json("../../data/samples.json").then((data) => {
        var metadata = data.metadata;
        var reply = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographic = d3.select("#sample-metadata");
        demographic.html("")
        Object.entries(reply).forEach((index) => {
            demographic.append("h5").text(index[0].toUpperCase() + ": " + index[1] + "\n");
        });
    })
    
}
function makePlot(id) {
    d3.json("../../data/samples.json").then((data) => {
        var samples = data.samples.filter(samp => samp.id.toString() === id)[0];
        var topTenLabels = samples.otu_labels.slice(0, 10);
        var sampleTopTen = samples.sample_values.slice(0, 10).reverse();
        var topTenOTU = (samples.otu_ids.slice(0, 10)).reverse();
        var idOTU = topTenOTU.map(datum => "OTU" + datum);
        

        var trace1 = {
            x: sampleTopTen,
            y: idOTU,
            text: topTenLabels,
            marker: {color: 'rgb(0, 220, 220)'},
            type: "bar",
            orientation: "h"
        }
        var traceSamples = [trace1]

        var layout = {
            title: "Top Ten OTU",
            margin: {
                t: 100,
                b: 50,
                r: 100,
                l: 100
            },
            yaxis: {tickmode:"linear"}

        };
        Plotly.newPlot("bar", traceSamples, layout);
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };
        var bubbleLayout = {
            xaxis:{title: "OTU ID"},
            height: 500,
            width: 1300
        };
        var traceBubbles = [trace2]
        Plotly.newPlot("bubble", traceBubbles, bubbleLayout);
    });
}

function optionChanged(id) {
    makePlot(id)
    gatherData(id);
}





function init() {
    var dropdown = d3.select("#selDataset");

    d3.json("../../data/samples.json").then((data) => {
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        makePlot(data.names[0]);
        gatherData(data.names[0]);
    });
}
init();