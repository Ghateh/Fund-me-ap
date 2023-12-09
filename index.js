import { contractAbi, contractAddress } from "./Constants.js"
import { ethers } from "./ethers-5.6.esm.min.js"


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withrawButton = document.getElementById("withdrawButton")


connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withrawButton.onclick = withraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({method: "eth_requestAccounts"})
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please install Metamask"
        
    }
    
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding ${ethAmount}`);
    if (typeof window.ethereun !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount)
            })            

            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!!");
        } catch (error) {
            console.log(error);            
        }
        
    }
    
}

async function withraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi, signer)
        try {
            const transactionResponse = await contract.withdraw()  
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!!");
        } catch (error) {
            console.log(error);            
        }
        
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance));
        
    }
    
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    // listen for this transaction to finish....

    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`);
            resolve()
        })
    })

}
