//LED element
const ledStatus = document.getElementsByClassName("led-status");
const ledStatusLabel = document.getElementsByClassName("led-status-label");
const buttonLedStatus = document.getElementsByClassName("btn-led-status");

//firebase reference
const database = firebase.database();
const panelRef = database.ref("panel");

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

function totalVoltagePhase(valueR, valueS, valueT) {
  if (valueR && valueS && valueT) {
    var totalVoltageValue = Math.sqrt(
      Math.pow(valueR, 2) + Math.pow(valueS, 2) + Math.pow(valueT, 2)
    );
    panelRef.child("valueVoltage").update({
      Total: totalVoltageValue
    });
    return totalVoltageValue;
  }
  return 0;
}

function attachSumVoltageToFirebase(keyR, keyS, keyT, chart) {
  const refR = panelRef.child(keyR);
  const refS = panelRef.child(keyS);
  const refT = panelRef.child(keyT);

  let valueR;
  let valueS;
  let valueT;

  refR.on("value", function(snapshot) {
    valueR = snapshot.val();
    chart.series[0].setData([totalVoltagePhase(valueR, valueS, valueT)]);
  });
  refS.on("value", function(snapshot) {
    valueS = snapshot.val();
    chart.series[0].setData([totalVoltagePhase(valueR, valueS, valueT)]);
  });
  refT.on("value", function(snapshot) {
    valueT = snapshot.val();
    chart.series[0].setData([totalVoltagePhase(valueR, valueS, valueT)]);
  });
}

function totalCurrentPhase(valueR, valueS, valueT) {
  if (valueR && valueS && valueT) {
    var totalCurrentValue = Math.sqrt(
      Math.pow(valueR, 2) + Math.pow(valueS, 2) + Math.pow(valueT, 2)
    );
    panelRef.child("valueCurrent").update({
      Total: totalCurrentValue
    });
    return totalCurrentValue;
  }
  return 0;
}

function attachSumCurrentToFirebase(keyR, keyS, keyT, chart) {
  const refR = panelRef.child(keyR);
  const refS = panelRef.child(keyS);
  const refT = panelRef.child(keyT);

  let valueR;
  let valueS;
  let valueT;

  refR.on("value", function(snapshot) {
    valueR = snapshot.val();
    chart.series[0].setData([totalCurrentPhase(valueR, valueS, valueT)]);
  });
  refS.on("value", function(snapshot) {
    valueS = snapshot.val();
    chart.series[0].setData([totalCurrentPhase(valueR, valueS, valueT)]);
  });
  refT.on("value", function(snapshot) {
    valueT = snapshot.val();
    chart.series[0].setData([totalCurrentPhase(valueR, valueS, valueT)]);
  });
}

function totalPowerPhase(valueR, valueS, valueT) {
  if (valueR && valueS && valueT) {
    var totalPowerValue = Math.sqrt(
      Math.pow(valueR, 2) + Math.pow(valueS, 2) + Math.pow(valueT, 2)
    );
    panelRef.child("valuePower").update({
      Total: totalPowerValue,
    });
    return totalPowerValue;
  }
  return 0;
}

function attachSumPowerToFirebase(keyR, keyS, keyT, chart) {
  const refR = panelRef.child(keyR);
  const refS = panelRef.child(keyS);
  const refT = panelRef.child(keyT);

  let valueR;
  let valueS;
  let valueT;

  refR.on("value", function(snapshot) {
    valueR = snapshot.val();
    chart.series[0].setData([totalPowerPhase(valueR, valueS, valueT)]);
  });
  refS.on("value", function(snapshot) {
    valueS = snapshot.val();
    chart.series[0].setData([totalPowerPhase(valueR, valueS, valueT)]);
  });
  refT.on("value", function(snapshot) {
    valueT = snapshot.val();
    chart.series[0].setData([totalPowerPhase(valueR, valueS, valueT)]);
  });
}

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
        createMeterOptions("Phase Total", "Voltage Meter", 1000, "V")
      );

      const phaseRCurrentChart = new Highcharts.Chart(
        "phase-r-current",
        createMeterOptions("Phase R", "Current Meter", 1000, "A")
      );
      const phaseSCurrentChart = new Highcharts.Chart(
        "phase-s-current",
        createMeterOptions("Phase S", "Current Meter", 1000, "A")
      );
      const phaseTCurrentChart = new Highcharts.Chart(
        "phase-t-current",
        createMeterOptions("Phase T", "Current Meter", 1000, "A")
      );
      const phaseTotalCurrentChart = new Highcharts.Chart(
        "phase-total-current",
        createMeterOptions("Phase Total", "Current Meter", 1000, "A")
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
        createMeterOptions("Phase Total", "Power Meter", 1000, "W")
      );

      attachToFirebase("valueVoltage/R", phaseRVoltageChart);
      attachToFirebase("valueVoltage/S", phaseSVoltageChart);
      attachToFirebase("valueVoltage/T", phaseTVoltageChart);
      attachSumVoltageToFirebase(
        "valueVoltage/R",
        "valueVoltage/S",
        "valueVoltage/T",
        phaseTotalVoltageChart
      );

      attachToFirebase("valueCurrent/R", phaseRCurrentChart);
      attachToFirebase("valueCurrent/S", phaseSCurrentChart);
      attachToFirebase("valueCurrent/T", phaseTCurrentChart);
      attachSumCurrentToFirebase(
        "valueCurrent/R",
        "valueCurrent/S",
        "valueCurrent/T",
        phaseTotalCurrentChart
      );

      attachToFirebase("valuePower/R", phaseRPowerChart);
      attachToFirebase("valuePower/S", phaseSPowerChart);
      attachToFirebase("valuePower/T", phaseTPowerChart);
      attachSumPowerToFirebase(
        "valuePower/R",
        "valuePower/S",
        "valuePower/T",
        phaseTotalPowerChart
      );
    }
  }
})();

//Total Power and Frequency Section

const totalValue = document.getElementsByClassName("total-value");
panelRef.child("valuePower/Total").on("value", function(snapshot) {
  totalValue[0].innerHTML = snapshot.val() + " Kwh";
});

panelRef.child("valueFrequency/Total").on("value", function(snapshot) {
  totalValue[1].innerHTML = snapshot.val() + " Hz";
});

//GOOGLE CHART SECTION
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(voltageChart);
google.charts.setOnLoadCallback(currentChart);

function voltageChart() {
  var data = google.visualization.arrayToDataTable([
    ["Time", "R", "S", "T"],
    ["06:00", 1500, 400, 300],
    ["06:01", 1170, 460, 700],
    ["06:02", 660, 1120, 650],
    ["06:03", 1030, 540, 340],
    ["06:04", 1500, 400, 300],
    ["06:05", 1170, 460, 700],
    ["06:06", 660, 1120, 650],
    ["06:07", 1030, 540, 340],
    ["06:08", 1500, 400, 300],
    ["06:09", 1170, 460, 700],
    ["06:10", 660, 1120, 650]
  ]);

  var options = {
    title: "Voltage Chart",
    hAxis: { title: "Time", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 0 }
  };

  var chart = new google.visualization.AreaChart(
    document.getElementById("voltage-chart")
  );
  chart.draw(data, options);
}

function currentChart() {
  var data = google.visualization.arrayToDataTable([
    ["Time", "R", "S", "T"],
    ["06:00", 1000, 400, 300],
    ["06:15", 1170, 460, 700],
    ["06:30", 660, 1120, 650],
    ["06:45", 1030, 540, 340]
  ]);

  var options = {
    title: "Current Chart",
    hAxis: { title: "Time", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 0 }
  };

  var chart = new google.visualization.AreaChart(
    document.getElementById("current-chart")
  );
  chart.draw(data, options);
}
