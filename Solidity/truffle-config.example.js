
module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Ganache corre en localhost
      port: 8545,            // Puerto por defecto de Ganache
      network_id: "*"        // Cualquier id de red
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21",      // Fetch exact version from solc-bin (default: truffle's version)

    }
  },


};
