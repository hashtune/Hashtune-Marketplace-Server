import { LogDescription } from '@ethersproject/abi';
import { Provider } from '@ethersproject/abstract-provider';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';
import * as abi from '../SongOrAlbumNFT.json';
class Chain {
  contract!: Contract;
  ethersProvider!: Provider;

  constructor() {
    this.connectContract();
  }
  async connectContract(): Promise<void> {
    let ethersProvider: Provider;
    try {
      ethersProvider = new ethers.providers.JsonRpcProvider({
        url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      });
      const contract = new ethers.Contract(
        '0xAf266B3D45B11D8B3f28dc2427745c3970B0368C',
        abi.abi
      );
      this.contract = contract;
      this.ethersProvider = ethersProvider;
    } catch (e) {
      console.log(e);
      throw new Error('Could not connect to chain and contract');
    }
  }
  /**
   *
   * @param txHash Transaction hash to listen for
   * returns LogDescription if the result was successful and the log was fetched
   * returns false if the result was unsuccessful
   * returns null if the result was successful but the log could not be fetched. That sould be added to the cron
   */
  async checkSuccessLog(
    eventName: string,
    txHash: string
  ): Promise<LogDescription | false | null> {
    let log: LogDescription | false | null = null;
    let tries = 0;
    let interval = 5000;
    let MAX_TRIES = 6; // Intervals of 5s, fail after 30s

    while (!log && tries < MAX_TRIES) {
      tries++;
      // wait
      await sleep(interval);
      try {
        let receipt = await this.ethersProvider.getTransactionReceipt(txHash);
        let abi = [eventName];
        let interact = new ethers.utils.Interface(abi);
        // Transaction failed
        console.log(receipt.status);
        if (receipt && receipt.status === 0) {
          return false;
        }
        if (receipt) {
          receipt.logs.forEach((el, i) => {
            try {
              log = interact.parseLog(receipt.logs[i]);
            } catch (e) {}
          });
          if (log) {
            // Transaction successful
            break;
          }
        }
      } catch (e) {
        if (tries === MAX_TRIES) {
          // Transaction pending
          return null;
        }
      }
    }
    return log;
  }

  /**
   *
   * @param txHash Transaction hash to check the success for
   */
  async checkSuccessLogCron() {
    // query all the artworks that have pending...
    // Call checkSuccessLog
    // If created at > 24hrs and pending = true, remove it.
    // run this every hour.
  }
}

const chain = new Chain();
export default chain;

// async function main() {
//   const res = await chain.checkSuccessLog(
//     'event TokenCreated(address by,uint256 tokenId,address[] creators,uint256[] creatorsRoyalty,uint8 status,bytes32 digest,uint8 hashFunction,uint8 size)',
//     '0xcffe94a346fbe00ee2b87852ccb6ad15055a0d7be41fe4ac8521e137b6dfebe6'
//   );
//   console.log({ res });
// }
// main();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
