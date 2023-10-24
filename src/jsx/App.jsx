import React, { useState, useEffect, useCallback } from 'react';
import '../styles/styles.less';

// Load helpers.
// import formatNr from './helpers/FormatNr.js';
// import roundNr from './helpers/RoundNr.js';
import CSVtoJSON from './helpers/CSVtoJSON.js';

import ChartLine from './components/ChartLine.jsx';

// const appID = '#app-root-2023-palestine_report';

function App() {
  // Data states.
  const [menuItems, setMenuItems] = useState(false);
  const [dataFigure, setDataFigure] = useState(false);
  const [selectedData, setSelectedData] = useState(1);

  const cleanData = useCallback((data) => (data.map((el, i) => {
    const values = Object.keys(el).filter(val => val !== 'Name').map(val => Date.UTC(parseInt(val, 10), 0, 1));
    const labels = Object.values(el).map(val => parseFloat(val)).filter(val => !Number.isNaN(val));
    return {
      data: values.map((e, j) => [e, labels[j]]),
      visible: (selectedData === i),
      showInLegend: (selectedData === i),
      name: el.Name
    };
  })), [selectedData]);

  const changeData = (i) => {
    setSelectedData(parseInt(i, 10));
  };

  const createMenu = useCallback((data) => {
    const html = [];
    let optgroup = false;
    let options = [];
    data.map((el, i) => {
      if (el[1995] === false) {
        options = [];
      } else {
        options.push(React.createElement('option', { className: 'option', key: el.Name, value: i }, el.Name));
      }
      if (el[1995] === false) {
        optgroup = React.createElement('optgroup', { key: el.Name, label: el.Name }, options);
        html.push(optgroup);
      }
      return false;
    });
    setMenuItems(html);
  }, []);

  const createChart = useCallback((data) => {
    setDataFigure(cleanData(data));
  }, [cleanData]);

  const createVis = useCallback((data) => {
    createMenu(data);
    createChart(data);
  }, [createChart, createMenu]);

  useEffect(() => {
    const data_file = `${(window.location.href.includes('unctad.org')) ? 'https://storage.unctad.org/2023-palestine_report/' : './'}assets/data/2023-palestine_report_data.csv`;
    try {
      fetch(data_file)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(body => createVis(CSVtoJSON(body)));
    } catch (error) {
      console.error(error);
    }
  }, [createVis]);

  return (
    <div className="app">
      <div className="menu_container">
        <h3>Select indicator</h3>
        {menuItems && <select onChange={(event) => changeData(event.target.value)}>{menuItems.map(el => el)}</select>}
        {dataFigure && (
        <ChartLine
          allow_decimals={false}
          data={dataFigure}
          data_decimals={1}
          export_title_margin={30}
          idx="1"
          labels={false}
          note="Data for 2022 are preliminary estimates. PNA=Palestinian National Authority. (a) In 2019, PCBS revised national accounts data from 2004 onwards. (b) Except for population figures, all data exclude East Jerusalem, due to the fact that PCBS has no access to the city. (c) In 2019, PCBS began to apply the guidelines of the nineteenth International Conference of Labour Statisticians. The stability of the unemployment rate in the last few years reflects weak labour market participation. (d) Includes domestic and external debt but not arrears or government debt to the pension fund. (e) Israeli and Palestinian trade data refer to goods and non-factor and factor services."
          show_first_label={false}
          show_only_first_and_last_labels
          source="Palestinian Ministry of Finance and Planning, Palestinian Monetary Authority and PCBS. The source of data on trade with Israel is the Central Bureau of Statistics of Israel."
          subtitle="Key indicators, 1995–2022"
          tick_interval={1}
          title="Economy of the Occupied Palestinian Territory"
          xlabel="Year"
        />
        )}
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
