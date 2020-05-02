function panelData(firebaseuserId) {
  //id for user
  const userId = firebaseuserId;

  //LED element
  const ledStatus = document.getElementsByClassName("led-status");
  const ledStatusLabel = document.getElementsByClassName("led-status-label");
  const buttonLedStatus = document.getElementsByClassName("btn-led-status");

  //firebase reference
  const database = firebase.database();
  const userRef = database.ref(userId);
  const panelRef = userRef.child("panel");
  // const panelRef = database.ref("panel");

  //user section
  function userProfile() {
    userRef.child("displayName").on("value", function(snapshot) {
      let displayName = snapshot.val();
      document.getElementById("display-name").innerHTML = displayName;
    });
    userRef.child("deviceName").on("value", function(snapshot) {
      let deviceName = snapshot.val();
      document.getElementById("device-name").innerHTML = deviceName;
    });
  }
  //LED SECTION
  function attachStatus(
    ref,
    ledStatusElement,
    ledStatusLabelElement,
    buttonLedStatusElement
  ) {
    ref.on("value", function(ledStatus) {
      const value = ledStatus.val();
      if (value) {
        ledStatusElement.style.backgroundColor = "#1cc88a";
        ledStatusElement.style.borderColor = "#1cc88a";
        ledStatusLabelElement.innerHTML = "ON";
        buttonLedStatusElement.checked = true;
      } else {
        ledStatusElement.style.backgroundColor = "#d52a1a";
        ledStatusElement.style.borderColor = "#d52a1a";
        ledStatusLabelElement.innerHTML = "OFF";
        buttonLedStatusElement.checked = false;
      }
    });
  }

  function attachUpdateStatus(ref, button, i) {
    button.addEventListener("change", function() {
      ref.child(i).update({ status: this.checked });
    });
  }

  //Database for LED
  for (let i = 0; i < ledStatus.length; i++) {
    const ledControlsRef = panelRef.child("ledControls");
    const ledControlsStatusRef = ledControlsRef.child(i + "/status");
    attachStatus(
      ledControlsStatusRef,
      ledStatus[i],
      ledStatusLabel[i],
      buttonLedStatus[i]
    );
    attachUpdateStatus(ledControlsRef, buttonLedStatus[i], i);
  }

  //METER SECTION
  //Database for meter
  function createMeterOptions(title, subtitle, max, satuan) {
    return {
      title: { text: title },
      subtitle: { text: subtitle },
      exporting: { enabled: false },
      chart: { type: "solidgauge", width: 250, height: 230, inverted: false },
      pane: {
        center: ["50%", "85%"],
        size: "140%",
        startAngle: "-90",
        endAngle: "90",
        background: {
          backgroundColor: "#EEE",
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc"
        }
      },
      tooltip: { enabled: false },
      yAxis: [
        {
          title: { y: -70 },
          labels: { format: `{value} ${satuan}`, y: 16 },
          reversed: false,
          opposite: false,
          stops: [
            [0.1, "#55BF3B"],
            [0.5, "#DDDF0D"],
            [0.9, "#DF5353"]
          ],
          min: 0,
          max: max,
          lineWidth: 0,
          minorTickInterval: null,
          tickPixelInterval: 400,
          tickWidth: 0
        }
      ],
      plotOptions: {
        solidgauge: { dataLabels: { y: 10, borderWidth: 0, useHTML: true } },
        series: { animation: false, dataLabels: { enabled: true } }
      },
      series: [
        { name: "Column 2", turboThreshold: 0, marker: { enabled: false } }
      ],
      credits: { enabled: false },
      lang: { contextButtonTitle: "Chart context menu" },
      xAxis: [{ title: { text: "" }, labels: { format: "{value}" } }],
      legend: { enabled: true }
    };
  }

  function attachToFirebase(key, chart) {
    const ref = panelRef.child(key);
    ref.on("value", function(snapshot) {
      chart.series[0].setData([snapshot.val()]);
    });
  }

  //For Total Value
  // function totalVoltagePhase(valueR, valueS, valueT) {
  //   if (valueR && valueS && valueT) {
  //     var totalVoltageValue = Math.sqrt(
  //       Math.pow(valueR, 2) + Math.pow(valueS, 2) + Math.pow(valueT, 2)
  //     );
  //     panelRef.child("valueVoltage").update({
  //       Total: totalVoltageValue
  //     });
  //     return totalVoltageValue;
  //   }
  //   return 0;
  // }

  // function attachSumVoltageToFirebase(keyR, keyS, keyT, chart) {
  //   const refR = panelRef.child(keyR);
  //   const refS = panelRef.child(keyS);
  //   const refT = panelRef.child(keyT);

  //   let valueR;
  //   let valueS;
  //   let valueT;

  //   refR.on("value", function(snapshot) {
  //     valueR = snapshot.val();
  //     chart.series[0].setData([totalVoltagePhase(valueR, valueS, valueT)]);
  //   });
  //   refS.on("value", function(snapshot) {
  //     valueS = snapshot.val();
  //     chart.series[0].setData([totalVoltagePhase(valueR, valueS, valueT)]);
  //   });
  //   refT.on("value", function(snapshot) {
  //     valueT = snapshot.val();
  //     chart.series[0].setData([totalVoltagePhase(valueR, valueS, valueT)]);
  //   });
  // }

  // function totalCurrentPhase(valueR, valueS, valueT) {
  //   if (valueR && valueS && valueT) {
  //     var totalCurrentValue = Math.sqrt(
  //       Math.pow(valueR, 2) + Math.pow(valueS, 2) + Math.pow(valueT, 2)
  //     );
  //     panelRef.child("valueCurrent").update({
  //       Total: totalCurrentValue
  //     });
  //     return totalCurrentValue;
  //   }
  //   return 0;
  // }

  // function attachSumCurrentToFirebase(keyR, keyS, keyT, chart) {
  //   const refR = panelRef.child(keyR);
  //   const refS = panelRef.child(keyS);
  //   const refT = panelRef.child(keyT);

  //   let valueR;
  //   let valueS;
  //   let valueT;

  //   refR.on("value", function(snapshot) {
  //     valueR = snapshot.val();
  //     chart.series[0].setData([totalCurrentPhase(valueR, valueS, valueT)]);
  //   });
  //   refS.on("value", function(snapshot) {
  //     valueS = snapshot.val();
  //     chart.series[0].setData([totalCurrentPhase(valueR, valueS, valueT)]);
  //   });
  //   refT.on("value", function(snapshot) {
  //     valueT = snapshot.val();
  //     chart.series[0].setData([totalCurrentPhase(valueR, valueS, valueT)]);
  //   });
  // }

  // function totalPowerPhase(valueR, valueS, valueT) {
  //   if (valueR && valueS && valueT) {
  //     var totalPowerValue = Math.sqrt(
  //       Math.pow(valueR, 2) + Math.pow(valueS, 2) + Math.pow(valueT, 2)
  //     );
  //     panelRef.child("valuePower").update({
  //       Total: totalPowerValue
  //     });
  //     return totalPowerValue;
  //   }
  //   return 0;
  // }

  // function attachSumPowerToFirebase(keyR, keyS, keyT, chart) {
  //   const refR = panelRef.child(keyR);
  //   const refS = panelRef.child(keyS);
  //   const refT = panelRef.child(keyT);

  //   let valueR;
  //   let valueS;
  //   let valueT;

  //   refR.on("value", function(snapshot) {
  //     valueR = snapshot.val();
  //     chart.series[0].setData([totalPowerPhase(valueR, valueS, valueT)]);
  //   });
  //   refS.on("value", function(snapshot) {
  //     valueS = snapshot.val();
  //     chart.series[0].setData([totalPowerPhase(valueR, valueS, valueT)]);
  //   });
  //   refT.on("value", function(snapshot) {
  //     valueT = snapshot.val();
  //     chart.series[0].setData([totalPowerPhase(valueR, valueS, valueT)]);
  //   });
  // }

  //HIGHCHART
  (function() {
    var files = [
        "https://code.highcharts.com/stock/highstock.js",
        "https://code.highcharts.com/highcharts-more.js",
        "https://code.highcharts.com/highcharts-3d.js",
        "https://code.highcharts.com/modules/data.js",
        "https://code.highcharts.com/modules/exporting.js",
        "https://code.highcharts.com/modules/funnel.js",
        "https://code.highcharts.com/modules/annotations.js",
        "https://code.highcharts.com/modules/accessibility.js",
        "https://code.highcharts.com/modules/solid-gauge.js"
      ],
      loaded = 0;
    if (typeof window["HighchartsEditor"] === "undefined") {
      window.HighchartsEditor = {
        ondone: [cl],
        hasWrapped: false,
        hasLoaded: false
      };
      include(files[0]);
    } else {
      if (window.HighchartsEditor.hasLoaded) {
        cl();
      } else {
        window.HighchartsEditor.ondone.push(cl);
      }
    }
    function isScriptAlreadyIncluded(src) {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].hasAttribute("src")) {
          if (
            (scripts[i].getAttribute("src") || "").indexOf(src) >= 0 ||
            (scripts[i].getAttribute("src") ===
              "http://code.highcharts.com/highcharts.js" &&
              src === "https://code.highcharts.com/stock/highstock.js")
          ) {
            return true;
          }
        }
      }
      return false;
    }
    function check() {
      if (loaded === files.length) {
        for (var i = 0; i < window.HighchartsEditor.ondone.length; i++) {
          try {
            window.HighchartsEditor.ondone[i]();
          } catch (e) {
            console.error(e);
          }
        }
        window.HighchartsEditor.hasLoaded = true;
      }
    }
    function include(script) {
      function next() {
        ++loaded;
        if (loaded < files.length) {
          include(files[loaded]);
        }
        check();
      }
      if (isScriptAlreadyIncluded(script)) {
        return next();
      }
      var sc = document.createElement("script");
      sc.src = script;
      sc.type = "text/javascript";
      sc.onload = function() {
        next();
      };
      document.head.appendChild(sc);
    }
    function each(a, fn) {
      if (typeof a.forEach !== "undefined") {
        a.forEach(fn);
      } else {
        for (var i = 0; i < a.length; i++) {
          if (fn) {
            fn(a[i]);
          }
        }
      }
    }
    var inc = {},
      incl = [];
    each(document.querySelectorAll("script"), function(t) {
      inc[t.src.substr(0, t.src.indexOf("?"))] = 1;
    });
    function cl() {
      if (typeof window["Highcharts"] !== "undefined") {
        const phaseRVoltageChart = new Highcharts.Chart(
          "phase-r-voltage",
          createMeterOptions("Phase R", "Voltage Meter", 250, "V")
        );
        const phaseSVoltageChart = new Highcharts.Chart(
          "phase-s-voltage",
          createMeterOptions("Phase S", "Voltage Meter", 250, "V")
        );
        const phaseTVoltageChart = new Highcharts.Chart(
          "phase-t-voltage",
          createMeterOptions("Phase T", "Voltage Meter", 250, "V")
        );
        const phaseTotalVoltageChart = new Highcharts.Chart(
          "phase-total-voltage",
          createMeterOptions("Phase Total", "Voltage Meter", 500, "V")
        );

        const phaseRCurrentChart = new Highcharts.Chart(
          "phase-r-current",
          createMeterOptions("Phase R", "Current Meter", 200, "A")
        );
        const phaseSCurrentChart = new Highcharts.Chart(
          "phase-s-current",
          createMeterOptions("Phase S", "Current Meter", 200, "A")
        );
        const phaseTCurrentChart = new Highcharts.Chart(
          "phase-t-current",
          createMeterOptions("Phase T", "Current Meter", 200, "A")
        );
        const phaseTotalCurrentChart = new Highcharts.Chart(
          "phase-total-current",
          createMeterOptions("Phase Total", "Current Meter", 500, "A")
        );

        const phaseRPowerChart = new Highcharts.Chart(
          "phase-r-power",
          createMeterOptions("Phase R", "Power Meter", 1000, "W")
        );
        const phaseSPowerChart = new Highcharts.Chart(
          "phase-s-power",
          createMeterOptions("Phase S", "Power Meter", 1000, "W")
        );
        const phaseTPowerChart = new Highcharts.Chart(
          "phase-t-power",
          createMeterOptions("Phase T", "Power Meter", 1000, "W")
        );
        const phaseTotalPowerChart = new Highcharts.Chart(
          "phase-total-power",
          createMeterOptions("Phase Total", "Power Meter", 2500, "W")
        );

        attachToFirebase("valueVoltage/R", phaseRVoltageChart);
        attachToFirebase("valueVoltage/S", phaseSVoltageChart);
        attachToFirebase("valueVoltage/T", phaseTVoltageChart);
        attachToFirebase("valueVoltage/J", phaseTotalVoltageChart);

        // attachSumVoltageToFirebase(
        //   "valueVoltage/R",
        //   "valueVoltage/S",
        //   "valueVoltage/T",
        //   phaseTotalVoltageChart
        // );

        attachToFirebase("valueCurrent/R", phaseRCurrentChart);
        attachToFirebase("valueCurrent/S", phaseSCurrentChart);
        attachToFirebase("valueCurrent/T", phaseTCurrentChart);
        attachToFirebase("valueCurrent/J", phaseTotalCurrentChart);
        // attachSumCurrentToFirebase(
        //   "valueCurrent/R",
        //   "valueCurrent/S",
        //   "valueCurrent/T",
        //   phaseTotalCurrentChart
        // );

        attachToFirebase("valuePower/R", phaseRPowerChart);
        attachToFirebase("valuePower/S", phaseSPowerChart);
        attachToFirebase("valuePower/T", phaseTPowerChart);
        attachToFirebase("valuePower/J", phaseTotalPowerChart);
        // attachSumPowerToFirebase(
        //   "valuePower/R",
        //   "valuePower/S",
        //   "valuePower/T",
        //   phaseTotalPowerChart
        // );
      }
    }
  })();

  //Total Energy and Frequency Section

  const totalValue = document.getElementsByClassName("total-value");
  panelRef.child("valueEnergy/J").on("value", function(snapshot) {
    totalValue[0].innerHTML = snapshot.val() + " Kwh";
  });

  panelRef.child("valueFrequency/J").on("value", function(snapshot) {
    totalValue[1].innerHTML = snapshot.val() + " Hz";
  });

  //Canvas Chart
  function getVoltageData() {
    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];

    var chart = new CanvasJS.Chart("voltage-chart", {
      zoomEnabled: true,
      title: {
        text: "Voltage Chart"
      },
      axisX: {
        title: "chart updates every 1 secs"
      },
      axisY: {
        // prefix: "Voltage",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        fontSize: 22,
        fontColor: "dimGrey",
        itemclick: toggleDataSeries
      },
      data: [
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "####.00 Volt",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "R",
          dataPoints: dataPoints1
        },
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "####.00 Volt",
          showInLegend: true,
          name: "S",
          dataPoints: dataPoints2
        },
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "####.00 Volt",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "T",
          dataPoints: dataPoints3
        }
      ]
    });

    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }

    var updateInterval = 1000;

    var yValue1;
    var yValue2;
    var yValue3;

    var time = new Date();
    // starting at 9.30 am
    time.getHours();
    time.getMinutes();
    time.getSeconds();
    time.getMilliseconds();

    function updateChart(count) {
      count = count || 1;
      // var deltaY1, deltaY2, deltaY3;
      for (var i = 0; i < count; i++) {
        time.setTime(time.getTime() + updateInterval);

        panelRef.child("valueVoltage/R").on("value", function(snapshot) {
          yValue1 = snapshot.val();
        });

        panelRef.child("valueVoltage/S").on("value", function(snapshot) {
          yValue2 = snapshot.val();
        });

        panelRef.child("valueVoltage/T").on("value", function(snapshot) {
          yValue3 = snapshot.val();
        });

        // pushing the new values
        var dataCek = dataPoints1.push({
          x: time.getTime(),
          y: yValue1
        });
        JSON.stringify(dataCek),
          dataPoints2.push({
            x: time.getTime(),
            y: yValue2
          });
        dataPoints3.push({
          x: time.getTime(),
          y: yValue3
        });

        // panelRef.update({
        //   Time: time.getTime().toString(),
        // });
      }

      // updating legend text with  updated with y Value
      chart.options.data[0].legendText = "R: " + yValue1 + " Volt";
      chart.options.data[1].legendText = "S: " + yValue2 + " Volt";
      chart.options.data[2].legendText = "T: " + yValue3 + " Volt";

      chart.render();
    }
    // generates first set of dataPoints
    updateChart(100);
    setInterval(function() {
      updateChart();
    }, updateInterval);
  }

  function getCurrentData() {
    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];

    var chart = new CanvasJS.Chart("current-chart", {
      zoomEnabled: true,
      title: {
        text: "Current Chart"
      },
      axisX: {
        title: "chart updates every 1 secs"
      },
      axisY: {
        // prefix: "Voltage",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        fontSize: 22,
        fontColor: "dimGrey",
        itemclick: toggleDataSeries
      },
      data: [
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "####.00 Ampere",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "R",
          dataPoints: dataPoints1
        },
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "####.00 Ampere",
          showInLegend: true,
          name: "S",
          dataPoints: dataPoints2
        },
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "####.00 Ampere",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "T",
          dataPoints: dataPoints3
        }
      ]
    });

    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }

    var updateInterval = 1000;

    var yValue1;
    var yValue2;
    var yValue3;

    var time = new Date();
    time.getHours();
    time.getMinutes();
    time.getSeconds();
    time.getMilliseconds();

    function updateChart(count) {
      count = count || 1;
      for (var i = 0; i < count; i++) {
        time.setTime(time.getTime() + updateInterval);

        panelRef.child("valueCurrent/R").on("value", function(snapshot) {
          yValue1 = snapshot.val();
        });

        panelRef.child("valueCurrent/S").on("value", function(snapshot) {
          yValue2 = snapshot.val();
        });

        panelRef.child("valueCurrent/T").on("value", function(snapshot) {
          yValue3 = snapshot.val();
        });

        // pushing the new values
        dataPoints1.push({
          x: time.getTime(),
          y: yValue1
        });

        dataPoints2.push({
          x: time.getTime(),
          y: yValue2
        });

        dataPoints3.push({
          x: time.getTime(),
          y: yValue3
        });
      }

      // updating legend text with  updated with y Value
      chart.options.data[0].legendText = "R: " + yValue1 + " Ampere";
      chart.options.data[1].legendText = "S: " + yValue2 + " Ampere";
      chart.options.data[2].legendText = "T: " + yValue3 + " Ampere";

      chart.render();
    }
    // generates first set of dataPoints
    updateChart(100);
    setInterval(function() {
      updateChart();
    }, updateInterval);
  }

  function getAnalogData1() {
    var dps = [];
    var chart = new CanvasJS.Chart("analog-chart-1", {
      exportEnabled: true,
      title: {
        text: "Analog Chart 1"
      },
      axisY: {
        includeZero: true
      },
      data: [
        {
          type: "spline",
          markerSize: 0,
          dataPoints: dps
        }
      ]
    });

    var xVal = 0;
    var yVal = 1000;
    var updateInterval = 1000;
    var dataLength = 300; // number of dataPoints visible at any point

    var updateChart = function(count) {
      count = count || 1;
      // count is number of times loop runs to generate random dataPoints.
      for (var j = 0; j < count; j++) {
        // yVal = yVal + Math.round(5 + Math.random() *(-5-5));
        yVal = yVal * -1;

        dps.push({
          x: xVal,
          y: yVal
        });
        xVal++;
      }
      if (dps.length > dataLength) {
        dps.shift();
      }
      chart.render();
    };

    updateChart(dataLength);
    setInterval(function() {
      updateChart();
    }, updateInterval);
  }

  function getTemperatureData1() {
    var dataPoints1 = [];

    var chart = new CanvasJS.Chart("temperature-chart-1", {
      zoomEnabled: true,
      title: {
        text: "Temperature Chart 1"
      },
      axisX: {
        title: "chart updates every 1 secs"
      },
      axisY: {
        // prefix: "Voltage",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        fontSize: 22,
        fontColor: "dimGrey",
        itemclick: toggleDataSeries
      },
      data: [
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "####.00 Celcius",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "Temperature 1",
          dataPoints: dataPoints1
        }
      ]
    });

    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }

    var updateInterval = 1000;

    var yValue1;

    var time = new Date();
    time.getHours();
    time.getMinutes();
    time.getSeconds();
    time.getMilliseconds();

    function updateChart(count) {
      count = count || 1;
      for (var i = 0; i < count; i++) {
        time.setTime(time.getTime() + updateInterval);

        panelRef.child("valueTemperature/A").on("value", function(snapshot) {
          yValue1 = snapshot.val();
        });

        // pushing the new values
        dataPoints1.push({
          x: time.getTime(),
          y: yValue1
        });
      }

      // updating legend text with  updated with y Value
      chart.options.data[0].legendText =
        "Temperature 1: " + yValue1 + " Celcius";

      chart.render();
    }
    // generates first set of dataPoints
    updateChart(100);
    setInterval(function() {
      updateChart();
    }, updateInterval);
  }

  function getTemperatureData2() {
    var dataPoints1 = [];

    var chart = new CanvasJS.Chart("temperature-chart-2", {
      zoomEnabled: true,
      title: {
        text: "Temperature Chart 2"
      },
      axisX: {
        title: "chart updates every 1 secs"
      },
      axisY: {
        // prefix: "Voltage",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        fontSize: 22,
        fontColor: "dimGrey",
        itemclick: toggleDataSeries
      },
      data: [
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "####.00 Celcius",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "Temperature 2",
          dataPoints: dataPoints1
        }
      ]
    });

    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }

    var updateInterval = 1000;

    var yValue1;

    var time = new Date();
    time.getHours();
    time.getMinutes();
    time.getSeconds();
    time.getMilliseconds();

    function updateChart(count) {
      count = count || 1;
      for (var i = 0; i < count; i++) {
        time.setTime(time.getTime() + updateInterval);

        panelRef.child("valueTemperature/B").on("value", function(snapshot) {
          yValue1 = snapshot.val();
        });

        // pushing the new values
        dataPoints1.push({
          x: time.getTime(),
          y: yValue1
        });
      }

      // updating legend text with  updated with y Value
      chart.options.data[0].legendText =
        "Temperature 2: " + yValue1 + " Celcius";

      chart.render();
    }
    // generates first set of dataPoints
    updateChart(100);
    setInterval(function() {
      updateChart();
    }, updateInterval);
  }

  function getVibrationData() {
    var dataPoints1 = [];

    var chart = new CanvasJS.Chart("vibration-chart-1", {
      zoomEnabled: true,
      title: {
        text: "Vibration Chart 1"
      },
      axisX: {
        title: "chart updates every 1 secs"
      },
      axisY: {
        // prefix: "Voltage",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        fontSize: 22,
        fontColor: "dimGrey",
        itemclick: toggleDataSeries
      },
      data: [
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "####.00 mm/s",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "Vibration 1",
          dataPoints: dataPoints1
        }
      ]
    });

    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }

    var updateInterval = 1000;

    var yValue1;

    var time = new Date();
    time.getHours();
    time.getMinutes();
    time.getSeconds();
    time.getMilliseconds();

    function updateChart(count) {
      count = count || 1;
      for (var i = 0; i < count; i++) {
        time.setTime(time.getTime() + updateInterval);

        panelRef.child("valueVibrasi/A").on("value", function(snapshot) {
          yValue1 = snapshot.val();
        });

        // pushing the new values
        dataPoints1.push({
          x: time.getTime(),
          y: yValue1
        });
      }

      // updating legend text with  updated with y Value
      chart.options.data[0].legendText = "Vibration 1: " + yValue1 + " mm/s";

      chart.render();
    }
    // generates first set of dataPoints
    updateChart(100);
    setInterval(function() {
      updateChart();
    }, updateInterval);
  }

  getCurrentData();
  getVoltageData();
  // getAnalogData1();
  getTemperatureData1();
  getTemperatureData2();
  getVibrationData();
  userProfile();
}

//sign out
document.getElementById("btn-logout").addEventListener("click", signOut);
