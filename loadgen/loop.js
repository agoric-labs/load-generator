import fs from 'fs';
import { E } from '@agoric/eventual-send';
import { prepareFaucet } from './task-tap-faucet';

const generators = {
  faucet: [5.0, prepareFaucet],
};

export default async function runCycles(homePromise, deployPowers) {
  const tools = new Map();
  for (let [name, [interval, prepare]] of Object.entries(generators)) {
    const cycle = await prepare(homePromise, deployPowers);
    tools.set(name, {interval, cycle});
  }

  // run once every 'interval' seconds
  function wait(interval) {
    return new Promise(resolve => setTimeout(resolve, interval*1000));
  }
  function run() {
    const { interval, cycle } = tools.get('faucet');
    return cycle().then(() => wait(interval)).then(run);
  }
  return run().catch(err => console.log(`error:`, err));
}
