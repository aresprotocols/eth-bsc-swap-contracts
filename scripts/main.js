// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const fs = require('fs');
const path = require('path');
const { BigNumber } = require("@ethersproject/bignumber");
const hre = require('hardhat')
const ethers = hre.ethers;
const env = process.env['HARDHAT_NETWORK'] || 'default'

async function deployBSC() {
    const signers = await ethers.getSigners();
    //const BEP20TokenImplementation = await ethers.getContractFactory("BEP20TokenImplementation");
    const BSCSwapAgentImpl = await ethers.getContractFactory("BSCSwapAgentImpl");
    const ERC20ABC = await ethers.getContractFactory("ERC20TokenMock");


    const bep20 = await ERC20ABC.deploy();
    console.log(`bep20 address: ${bep20.address}`);

    const bscSwapAgentImpl = await BSCSwapAgentImpl.deploy("1");
    console.log(`bscSwapAgentImpl address:${bscSwapAgentImpl.address}`);   

    await bep20.transfer(bscSwapAgentImpl.address, ethers.utils.parseEther("100000", 'ether'))

    return { bep20, bscSwapAgentImpl }
}

async function deployETH(bep20Addr) {
    await hre.changeNetwork("testnet_heco")
    const ETHSwapAgentImpl = await ethers.getContractFactory("ETHSwapAgentImpl");
    const ERC20ABC = await ethers.getContractFactory("ERC20TokenMock");

    const erc20 = await ERC20ABC.deploy();
    console.log(`erc20 address: ${erc20.address}`);

    const ethSwapAgentImpl = await ETHSwapAgentImpl.deploy("1")
    console.log(`ethSwapAgentImpl address:${ethSwapAgentImpl.address}`);
    // 0x5332c1523D918c9284cc42C0fb27181C7AB3F453

    await ethSwapAgentImpl.registerSwapPairToBSC(erc20.address, bep20Addr);
    await erc20.transfer(ethSwapAgentImpl.address, ethers.utils.parseEther("100000", 'ether'))

    return { erc20, ethSwapAgentImpl }
}

const obj = {
    bep20: "",
    bscSwapAgent: "",
    erc20: "",
    ethSwapAgent: ""
}

deployBSC().then(({ bep20, bscSwapAgentImpl }) => {
    obj.bep20 = bep20.address;
    obj.bscSwapAgent = bscSwapAgentImpl.address;
    return deployETH(obj.bep20);
}).then(({ erc20, ethSwapAgentImpl }) => {
    obj.erc20 = erc20.address;
    obj.ethSwapAgent = ethSwapAgentImpl.address;
    return hre.changeNetwork("testnet_heco")
}).catch(error => {
    console.error(error)
    process.exit(1)
}).finally(() => {
    process.exit(1)
})