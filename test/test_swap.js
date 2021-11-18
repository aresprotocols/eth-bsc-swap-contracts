const hre = require('hardhat')
const ethers = hre.ethers;
const { describe, it, before, beforeEach } = require('mocha');
const { expect, assert, } = require("chai");
const  dayjs = require('dayjs')

describe("ETHSwapAgent and BSCSwapAgent", function () {
    it('Register Standard ERC20 and create swap pair', async () => {
        /** 
         * ========= BSC chain =========
         * **/
        const BSCSwapAgentImpl = await ethers.getContractFactory("BSCSwapAgentImpl");
        const BEP20 = await ethers.getContractFactory('ERC20TokenMock');
        //const ETHSwapAgentImpl = await ethers.getContractFactory("ETHSwapAgentImpl");

        let swapAddr = "0xbd46cF8A318FD7093F3FAE1825d52A31347aF4F0";
        const bep20Addr = "0x3243D051081fE809300C50826E775456D1D29cc3";

        const bscSwap = BSCSwapAgentImpl.attach(swapAddr);
        const bep20 = BEP20.attach(bep20Addr);

        let amount = ethers.utils.parseEther("100", 'ether')
        let fee = 1
        await bep20.approve(bscSwap.address, amount);
        console.log(`bsc2eth ----> approve done. at: ${dayjs().format()}`)
        await bscSwap.swapBSC2ETH(bep20.address, amount, { value: fee });
        console.log(`bsc2eth ----> swapBSC2ETH done. at: ${dayjs().format()}`)

        /** 
         * ========= heco chain =========
         * **/
        await hre.changeNetwork("testnet_heco")
        const ETHSwapAgentImpl = await ethers.getContractFactory("ETHSwapAgentImpl");
        const ERC20 = await ethers.getContractFactory('ERC20TokenMock');

        swapAddr = "0x486C49D39Fcc28c8A786E38d4aDC362974f98069";
        const erc20Addr = "0x52E6B7eBF0D613e1A7A9c198Fb9f0D7b992Bc19e";

        const ethSwap = ETHSwapAgentImpl.attach(swapAddr);
        const erc20 = ERC20.attach(erc20Addr);

        amount = ethers.utils.parseEther("123", 'ether')
        fee = 1
        await erc20.approve(ethSwap.address, amount);
        console.log(`eth2bsc ----> approve done. at: ${dayjs().format()}`)
        await ethSwap.swapETH2BSC(erc20.address, amount, { value: fee });
        console.log(`eth2bsc ----> swapETH2BSC done. at: ${dayjs().format()}`)
    });
});