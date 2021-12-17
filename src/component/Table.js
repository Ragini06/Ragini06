import React, { useEffect, useState, useRef } from "react";
import { isEmpty } from "lodash";
import { Typography } from '@mui/material';
import '@fontsource/roboto/400.css';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';

import "./Table.css";
const Table = () => {
  const [bitData, setBitData] = useState({});
  const [coinArray, setCoinArray] = useState([]);
  let prevBitData = useRef({});
  let { bpi } = bitData;

  let { bpi: prevBpi } = prevBitData.current;
  const getBitData = () => {
    fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then((data) => data.json())
      .then((data) => {
        setBitData((prevData) => {
          prevBitData.current = prevData;
          return data;
        });
      });
  };
  useEffect(() => {
    const interval = setInterval(getBitData, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // var tempArray = [...coinArray];
    
    // tempArray.push(bitData);
    // tempArray = [bitData.bpi].concat(tempArray);
    setCoinArray([bitData.bpi,...coinArray]);
  }, [bitData]);

  // useEffect(() => {
    
  // }, [coinArray]);

  console.log(coinArray);
  function formatBitData(bpi, prevBpi) {
    let diff = 0;
    if (isEmpty(bpi)) return <p>Loading...</p>;
    let keys = Object.keys(bpi);
    let values = Object.values(bpi);
    let prevValuesExist = !isEmpty(prevBpi);
    let table = keys.map((i, index) => {
      if (prevValuesExist) {
        diff = (
          values[index].rate_float - Object.values(prevBpi)[index].rate_float
        ).toFixed(2);
      }

      return (
        <React.Fragment>
          <td key={index}>{values[index].rate_float.toFixed(2)}</td>
          <td>
            {prevValuesExist
              ? diff > 0
              ? '⬆' + diff
              : '⬇' + Math.abs(diff)
            : 0.0}
          </td>
        </React.Fragment>
      );
    });
    return table;
  }

  return (
    <div>
      <Typography variant="h2" color="primary" align="center">
        {bitData.chartName}
      </Typography>
      <Typography>
        Last updated Time :{bitData && bitData.time && bitData.time.updateduk}
      </Typography>

      <table className="table_header" id="table">
        <thead>
          <tr>
            <th>USD</th>
            <th>P/L</th>
            <th>GBP</th>
            <th>P/L</th>
            <th>EUR</th>
            <th>P/L</th>
          </tr>
        </thead>

        <tbody className="row">
          <tr>{formatBitData(bpi, prevBpi)}</tr>
          <tr>
          {/* {<ArrowUpwardOutlinedIcon color="success"/>} */}
          </tr>
        </tbody>
      </table>
    
    </div>
  );
};

export default Table;
