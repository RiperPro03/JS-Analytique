import { processData, getData } from './dataProcessor.js';
import { getChartConfig } from './chartConfigurations.js';

$(document).ready(function() {
    getData("../data/survey_results_NA.json").then(data => {
        const NA = data;
    })
    getData("../data/survey_results_WE.json").then(data => {
        const EUW = data;
    })
});
