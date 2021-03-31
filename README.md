# Load Generator

In one terminal:

```sh
agoric install         # takes 20s
agoric start --reset   # wait for "Deployed Wallet", takes ~4min
                       # leave that running
```

Now in a second terminal:

```sh
yarn loadgen
```

That will launch several (currently just one) load generation tools. Each
will begin with a setup phase if it has not been run before, using the
ag-solo -side `scratch` table to remember the initialized tools.

For now, edit `loadgen/loop.js` to control the generators we use and their
intervals, then restart the `yarn loadgen`. Eventually this might turn into a
runtime configuration knob.

The load generator defined so far:

* `faucet`: initialize by creating a `dapp-fungible-faucet` -style mint, then each cycle requests an invitation and completes it, adding 1000 Tokens to Bob's Purse
