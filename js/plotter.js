$(document).ready(function () {

  showSampleChart();
  $('#plotter-form').submit(async function (e) {
    e.preventDefault();
    $('#loading-button').show();
    $('.sample-chart-div').hide();
    const dataSeriesArray = await parseCsv($('#data-series'));
    const myTradesArray = await parseCsv($('#my-trades'));
    $('.my-chart-div').show();
    let candleSeries = getCandleSeriesConfig('my-chart');
    candleSeriesSetData(candleSeries, dataSeriesArray.data);
    candleSeriesSetMarkers(candleSeries, myTradesArray.data);
    $('#loading-button').hide();
  });
});

function showSampleChart() {
  $('#loading-button').hide();
  $('.my-chart-div').hide();
  $('.sample-chart-div').show();
  let candleSeries = getCandleSeriesConfig('sample-chart');
  candleSeriesSetData(candleSeries, sampleDataSeries);
  candleSeriesSetMarkers(candleSeries, sampleTrades);
}

function candleSeriesSetMarkers(candleSeries, records) {
  let markers = [];
  for (let i = 0; i < records.length; i++) {
    let displayText = records[i].quantity + ' @ ' + records[i].price;
    markers.push({
      time: records[i].timestamp,
      sortTime: new Date(records[i].timestamp),
      position: records[i].action === 'BUY' ? "belowBar" : "aboveBar",
      color: records[i].action === 'BUY' ? 'rgb(38, 166, 154)' : 'rgb(239, 83, 80)',
      shape: records[i].action === 'BUY' ? "arrowUp" : "arrowDown",
      text: records[i].action === 'BUY' ? 'Buy ' + displayText : 'Sell ' + displayText
    });
  }
  const sortedMarkers = markers.sort((a, b) => a.sortTime - b.sortTime)
  candleSeries.setMarkers(sortedMarkers);
}

function candleSeriesSetData(candleSeries, records) {
  let data = [];
  for (let i = 0; i < records.length; i++) {
    data.push({
      time: records[i].timestamp,
      sortTime: new Date(records[i].timestamp),
      open: parseFloat(records[i].open),
      high: parseFloat(records[i].high),
      low: parseFloat(records[i].low),
      close: parseFloat(records[i].close)
    });
  }
  const sortedData = data.sort((a, b) => a.sortTime - b.sortTime)
  candleSeries.setData(sortedData);
}

function getCandleSeriesConfig(divId) {
  let chart = LightweightCharts.createChart(divId, {
    height: 800,
    layout: {
      backgroundColor: '#1E2937',
      textColor: '#565674',
    },
    grid: {
      vertLines: {
        color: 'rgba(45, 51, 59, 0.5)',
      },
      horzLines: {
        color: 'rgba(45, 51, 59, 0.5)',
      },
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
      borderColor: 'rgba(240, 243, 250, 0.12)',
    },
    timeScale: {
      borderColor: 'rgba(240, 243, 250, 0.12)',
    },
  });

  return chart.addCandlestickSeries({
    upColor: 'rgb(38, 166, 154)',
    borderUpColor: 'rgb(38, 166, 154)',
    wickUpColor: 'rgb(38, 166, 154)',
    downColor: 'rgb(239, 83, 80)',
    borderDownColor: 'rgb(239, 83, 80)',
    wickDownColor: 'rgb(239, 83, 80)',
  });
}


async function parseCsv(fileSelector) {
  return new Promise((resolve, reject) => {
    fileSelector.parse({
      config: {
        header: true,
        skipEmptyLines: true,
        transform: function (value) {
          return value.trim();
        },
        complete: function (results) {
          return resolve(results);
        },
        error: function (error) {
          return reject(error);
        },
      }
    });
  });
}
