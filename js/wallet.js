async function getGasPrice() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const gasPrice = await provider.getGasPrice();
    return gasPrice.mul(120).div(100); // 20% buffer
}

async function checkNetwork() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.chainId !== 80002) { // Amoy chain ID
        alert('Please switch to Polygon Amoy Testnet in MetaMask');
        return false;
    }
    return true;
}

async function connectWallet() {
    clearLogAndReset();
    if (typeof window.ethereum !== 'undefined') {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            if (await checkNetwork()) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                contract = new ethers.Contract(contractAddress, contractABI, signer);
                const address = await signer.getAddress();
                document.querySelector('.connect-wallet').textContent = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
                console.log('Connected to Polygon Amoy');
                setupEventListeners();
                updateDashboards();
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            document.getElementById('status').textContent = 'Connection failed';
        }
    } else {
        alert('Please install MetaMask');
        document.getElementById('status').textContent = 'MetaMask not detected';
    }
}
