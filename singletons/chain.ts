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
   */
  async checkSuccessLog(
    eventName: string,
    txHash: string
  ): Promise<LogDescription | null> {
    let receipt;
    let interact;
    let log = null;
    let tries = 0;
    let interval = 5000;
    let MAX_TRIES = 6; // Intervals of 5s, fail after 30s

    while (!log && tries < MAX_TRIES) {
      tries++;
      // wait
      await sleep(interval);
      try {
        // TODO create map of each input type and name plus object name and type.
        receipt = await this.ethersProvider.getTransactionReceipt(txHash);
        let abi = [eventName];
        interact = new ethers.utils.Interface(abi);
        if (receipt) {
          receipt.logs.forEach((el, i) => {
            try {
              log = interact.parseLog(receipt.logs[i]);
            } catch (e) {}
          });
          if (log) {
            break;
          }
        }
      } catch (e) {
        if (tries === MAX_TRIES) {
          throw new Error(
            `Tried for ${
              (interval * MAX_TRIES) / 1000
            } seconds and could not retrieve the log ${e}`
          );
        }
      }
    }
    return log;
  }
}

const chain = new Chain();
export default chain;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
