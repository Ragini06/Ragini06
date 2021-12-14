import React, { useEffect, useSate, useRef } from "react";
import { isEmpty } from 'lodash';
import { useState } from "react/cjs/react.development";
import "./Table.css";
const Table = () => {
  const [bitData, setBitData] = useState({});
  const [coinArray, setCoinArray] = useState([]);
  let prevBitData = useRef({});
  let { bpi } = bitData;

  let { bpi: prevBpi } = prevBitData.current;
  const getBitData = () => {
    fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
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
  },[]);
  

  function formatBitData(bpi, prevBpi) {
    let diff = 0;
    if (isEmpty(bpi)) return <p>Loading</p>;
    let keys = Object.keys(bpi);
    let values = Object.values(bpi);
    let prevValuesExist = !isEmpty(prevBpi);
    let array=[];
    let table = keys.map((i, index) => {
      if (prevValuesExist) {
        diff = (
          values[index].rate_float - Object.values(prevBpi)[index].rate_float
        ).toFixed(2);
      }
      
      



      return (
        <React.Fragment>
          <td key={index}>
          {values[index].rate_float.toFixed(2)}
          </td>
          <td>
          {prevValuesExist ? (diff > 0 ? '+' + diff : diff) : 0.0}
        </td>
        </React.Fragment>
        
      );
    });
    return table;
  }

  return (
    <div>
      <h1 id="title">{bitData.chartName}</h1>
      {/* <h3>Last updated Time :{bitData.time.updateduk}</h3> */}
      <table className="table_header"  id="table">
        <thead >
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
          {formatBitData(bpi, prevBpi)}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
