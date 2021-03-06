var charts = [{
    name: ROLE_OVERALL_AUTHENTICATION_COUNT,
    columns: ["authActionCount", "timeStamp","authActionType"],
    schema: [{
        "metadata": {
            "names": ["authActionCount", "timeStamp","authActionType"],
            "types": ["linear", "time","ordinal"]
        },
        "data": []
    }],
    "chartConfig":{
        "x":"timeStamp",
        "maxLength":"3000",
        "legend" : false,
        "range":"true",
        "yTitle":"Authentication Attempts",
        "xTitle":"Time",
        "xTicks":6,
        "colorScale":["#5CB85C","#D9534F"],
        "tooltip" : {"enabled":true, "color":"#e5f2ff", "type":"symbol", "content":["authActionCount","timeStamp","authActionType"], "label":true},
        "colorDomain":["SUCCESS","FAILURE"],
        "rangeColor":"#737373",
        "padding":{
            "top":30,
            "left":65,
            "bottom":38,
            "right":10
        },
        "charts":[
            {
                type:"area",
                y:"authActionCount",
                color:"authActionType"
            }
        ]
    },
    types: [
        { name: TYPE_OVERALL, type: 1 },
        { name: TYPE_LOCAL, type: 1 },
        { name: TYPE_FEDERATED, type: 1 }
    ],
    processData: function(data) {
        var result = [];
        var tableData = [];
        var overallAuthSuccessCount = 0;
        var overallAuthFailureCount = 0;
        var maxSuccessCount = 0;
        var maxFailureCount = 0;
        var timeUnit;
        var previousTimestamp;

        if(data.length > 0) {
            timeUnit = data[0].timeUnit;
            previousTimestamp = data[0].timestamp;
        }

        var step;
        if(timeUnit == "MINUTE") {
            step = 60000;
        } else if(timeUnit == "HOUR") {
            step = 3600000;
        } else if(timeUnit == "DAY") {
            step = 86400000;
        } else if(timeUnit == "MONTH") {
            step = 2628000000;
        } else if(timeUnit == "YEAR") {
            step = 31540000000;
        }

        data.forEach(function(row, i) {
            var timestamp = row['timestamp'];
            var successCount = row["successCount"];
            var faultCount = row["faultsCount"];
            overallAuthSuccessCount += successCount;
            overallAuthFailureCount += faultCount;
            maxSuccessCount = Math.max(maxSuccessCount, successCount);
            maxFailureCount = Math.max(maxFailureCount, faultCount);

            if((row['timestamp'] - previousTimestamp) > step) {
                for(var t=(previousTimestamp - previousTimestamp%step + step); t<row.timestamp; t=t+step) {
                    tableData.push([0, t, "Success"]);
                    tableData.push([0, t, "Failures"]);
                }
            }
            previousTimestamp = row.timestamp;

            tableData.push([successCount, timestamp, "Success"]);
            tableData.push([-faultCount,timestamp , "Failures"]);
        });
        result.push(tableData);
        result.push(overallAuthSuccessCount);
        result.push(overallAuthFailureCount);
        result.push(maxSuccessCount);
        result.push(maxFailureCount);

        return result;
    }
}];