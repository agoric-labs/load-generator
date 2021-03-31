import { E } from '@agoric/eventual-send';

// set up a fungible faucet contract, and a purse to match, if they aren't already present
export async function prepareFaucet(homePromise, deployPowers) {
  const KEY = 'fungible';
  const home = await homePromise;
  const { zoe, scratch } = home;
  let tools = await E(scratch).get(KEY);
  if (!tools) {
    const { bundleSource, pathResolve } = deployPowers;
    const bundle = await bundleSource(pathResolve(`./contract-faucet.js`));
    const installation = await E(zoe).install(bundle);
    const { creatorFacet, instance, publicFacet } = await E(zoe).startInstance(installation);
    const tokenIssuer = await E(publicFacet).getTokenIssuer();
    // Bob makes a purse for tokens
    const bobPurse = await E(tokenIssuer).makeEmptyPurse();
    // stash everything needed for each cycle under the key
    tools = {zoe, creatorFacet, bobPurse};
    const id = await E(scratch).set(KEY, tools);
    // record the ID
    //const cycleDataFile = pathResolve(`./cycle-data.json`);
    //await fs.promises.writeFile(cycleDataFile, `${id}\n`);
    console.log(`faucet ready for cycles`);
  }

  const { creatorFacet, bobPurse } = tools;
  async function faucetCycle() {
    // make ourselves an invitation
    const invitation = E(creatorFacet).makeInvitation();
    // claim it
    const seat = await E(zoe).offer(invitation);
    const paymentP = E(seat).getPayout('Token');
    const payment = await paymentP;
    await E(bobPurse).deposit(payment);
    const amount = await E(bobPurse).getCurrentAmount();
    console.log(`new purse balance`, amount.value);
  }

  return faucetCycle;
}


  /*
  // that wasn't complex enough, let's make it worse. be more like the wallet.
  async function cycleMore() {
  const wallet = home.wallet;
  const waf = await E(wallet).getAdminFacet();
  console.log('got wallet admin facet');

    // make ourselves an invitation
    const invitation = E(creatorFacet).makeInvitation();

    // give it to the wallet
    const offerConfig = {
      id,
      invitation,
      installationHandleBoardId: INSTALLATION_BOARD_ID,
      instanceHandleBoardId: INSTANCE_BOARD_ID,
      proposalTemplate: {
        want: {
          Token: {
            pursePetname: tokenPursePetname,
            value: 1000,
          },
        },
      },
    };
    E(waf).addOffer(offerConfig);

    // make the wallet accept it
    // ???

    // check the balance
    const amount = await E(bobPurse).getCurrentAmount();
    console.log(`new purse balance`, amount.value);
  }
  */
