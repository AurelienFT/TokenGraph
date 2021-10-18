const express = require('express');

const dbPool = require('../db-pool.js');

const router = express.Router();

router.get('/get_graph/:address/:baseAddress/:depth', function(req, res) {
    let address = req.params.address;
    if(!address || address.length != 42 || address[0] != '0' || address[1] != 'x') {
        res.status(400).send('Invalid address');
        return;
    };
    address = address.substring(2);
    address = address.toLocaleLowerCase();
    const sqlStatement =
      `SELECT
      '0x' || encode(ble.sender, 'hex') AS contract_address,
      '0x' || encode(tx_hash, 'hex') AS hash,
      '0x' || encode(extract_address(ble.topics[2]), 'hex') AS from_address,
      '0x' || encode(extract_address(ble.topics[3]), 'hex') AS to_address,
      block_signed_at,
      cast(abi_field(ble.data, 0) as numeric) AS value
  FROM chain_eth_mainnet.block_log_events ble
  WHERE ble.topics @> ARRAY[
      CAST('\\xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' AS bytea)
  ]
  AND "sender"='\\x${address}'`;
    dbPool.query(sqlStatement, (error, results) => {
      if (error) {
        throw error;
      }
      let matchAddresses = [req.params.baseAddress];
      let retArray = [];
      for (i = 0; i < req.params.depth; i++) {
        let nextMatchAddresses = [];
        retArray = retArray.concat(results.rows.reduce(
        function(links, r) {
          for(j = 0; j < matchAddresses.length; j++) {
            if (matchAddresses.includes(r['from_address'])) {
              links.push({source: r['from_address'], target: r['to_address']});
              nextMatchAddresses.push(r['to_address']);
            }
          }
          return links;
        },
        []
        ));
        matchAddresses = nextMatchAddresses;
      }
      res.status(200).setHeader("Access-Control-Allow-Headers", "Content-Type").setHeader(
        "Access-Control-Allow-Origin", "*").setHeader(
        "Access-Control-Allow-Methods", "OPTIONS,POST,GET").json(retArray);
    });
  });

module.exports = router;