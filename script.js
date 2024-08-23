let contract;
let signer;

const contractAddress = '0x15D1aF7d327035b70367062621F2ECED718910BE';
const contractABI = [
    "function createInvoice(address recipient, uint256 amount) public returns (uint256)",
    "function payInvoice(uint256 tokenId) public payable",
    "function isInvoicePaid(uint256 tokenId) public view returns (bool)",
    "function listInvoiceForSale(uint256 tokenId, uint256 salePrice) public",
    "function buyInvoice(uint256 tokenId) public payable",
    "function invoices(uint256 tokenId) public view returns (uint256, address, address, bool, bool, uint256)",
    "event InvoiceCreated(uint256 indexed tokenId, uint256 amount, address indexed issuer, address indexed recipient)"
];

document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupForms();
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showPage(targetId);
        });
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelector(`#${pageId}`).classList.add('active');
    
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    document.querySelector(`nav a[href="#${pageId}"]`).classList.add('active');

    if (contract) {
        updateDashboards();
    }
}

function setupForms() {
    const createInvoiceForm = document.getElementById('createInvoiceForm');
    if (createInvoiceForm) {
        createInvoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createInvoice();
        });
    }
}

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            document.getElementById('connectWallet').textContent = 'Connected';
            updateDashboards();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}

async function createInvoice() {
    try {
        const recipient = document.getElementById('recipient').value;
        const amount = ethers.utils.parseEther(document.getElementById('amount').value);
        const tx = await contract.createInvoice(recipient, amount);
        await tx.wait();
        document.getElementById('small-business-result').textContent = 'Invoice created successfully!';
        updateDashboards();
    } catch (error) {
        console.error('Error creating invoice:', error);
        document.getElementById('small-business-result').textContent = 'Failed to create invoice. See console for details.';
    }
}

async function updateDashboards() {
    updateSmallBusinessDashboard();
    updateInvestorDashboard();
    updateBigBusinessDashboard();
}

async function updateSmallBusinessDashboard() {
    const table = document.getElementById('smallBusinessTable');
    table.innerHTML = '<tr><th>Token ID</th><th>Amount</th><th>Recipient</th><th>Paid</th><th>For Sale</th><th>Sale Price</th><th>Action</th></tr>';

    for (let i = 0; i < 100; i++) {
        try {
            const invoice = await contract.invoices(i);
            const row = table.insertRow(-1);
            row.insertCell(0).textContent = i;
            row.insertCell(1).textContent = ethers.utils.formatEther(invoice[0]) + " ETH";
            row.insertCell(2).textContent = invoice[2];
            row.insertCell(3).textContent = invoice[3] ? "Yes" : "No";
            row.insertCell(4).textContent = invoice[4] ? "Yes" : "No";
            row.insertCell(5).textContent = ethers.utils.formatEther(invoice[5]) + " ETH";
            
            const actionCell = row.insertCell(6);
            if (!invoice[3] && !invoice[4]) {
                const listButton = document.createElement('button');
                listButton.textContent = "List for Sale";
                listButton.onclick = () => listInvoiceForSale(i);
                actionCell.appendChild(listButton);
            }
        } catch (error) {
            break;
        }
    }
}

async function updateInvestorDashboard() {
    const table = document.getElementById('investorTable');
    table.innerHTML = '<tr><th>Token ID</th><th>Amount</th><th>Issuer</th><th>Sale Price</th><th>Action</th></tr>';

    for (let i = 0; i < 100; i++) {
        try {
            const invoice = await contract.invoices(i);
            if (invoice[4]) {
                const row = table.insertRow(-1);
                row.insertCell(0).textContent = i;
                row.insertCell(1).textContent = ethers.utils.formatEther(invoice[0]) + " ETH";
                row.insertCell(2).textContent = invoice[1];
                row.insertCell(3).textContent = ethers.utils.formatEther(invoice[5]) + " ETH";
                
                const actionCell = row.insertCell(4);
                const buyButton = document.createElement('button');
                buyButton.textContent = "Buy";
                buyButton.onclick = () => buyInvoice(i, invoice[5]);
                actionCell.appendChild(buyButton);
            }
        } catch (error) {
            break;
        }
    }
}

async function updateBigBusinessDashboard() {
    const table = document.getElementById('bigBusinessTable');
    table.innerHTML = '<tr><th>Token ID</th><th>Amount</th><th>Issuer</th><th>Paid</th><th>Action</th></tr>';

    for (let i = 0; i < 100; i++) {
        try {
            const invoice = await contract.invoices(i);
            const row = table.insertRow(-1);
            row.insertCell(0).textContent = i;
            row.insertCell(1).textContent = ethers.utils.formatEther(invoice[0]) + " ETH";
            row.insertCell(2).textContent = invoice[1];
            row.insertCell(3).textContent = invoice[3] ? "Yes" : "No";
            
            const actionCell = row.insertCell(4);
            if (!invoice[3]) {
                const payButton = document.createElement('button');
                payButton.textContent = "Pay";
                payButton.onclick = () => payInvoice(i, invoice[0]);
                actionCell.appendChild(payButton);
            }
        } catch (error) {
            break;
        }
    }
}

async function listInvoiceForSale(tokenId) {
    try {
        const salePrice = prompt("Enter the sale price in ETH:");
        if (salePrice === null) return;
        
        const salePriceWei = ethers.utils.parseEther(salePrice);
        const tx = await contract.listInvoiceForSale(tokenId, salePriceWei);
        await tx.wait();
        document.getElementById('small-business-result').textContent = 'Invoice listed for sale successfully!';
        updateDashboards();
    } catch (error) {
        console.error('Error listing invoice for sale:', error);
        document.getElementById('small-business-result').textContent = `Failed to list invoice: ${error.message}`;
    }
}

async function buyInvoice(tokenId, price) {
    try {
        const tx = await contract.buyInvoice(tokenId, { value: price });
        await tx.wait();
        document.getElementById('investor-result').textContent = 'Invoice bought successfully!';
        updateDashboards();
    } catch (error) {
        console.error('Error buying invoice:', error);
        document.getElementById('investor-result').textContent = `Failed to buy invoice: ${error.message}`;
    }
}

async function payInvoice(tokenId, amount) {
    try {
        const tx = await contract.payInvoice(tokenId, { value: amount });
        await tx.wait();
        document.getElementById('big-business-result').textContent = 'Invoice paid successfully!';
        updateDashboards();
    } catch (error) {
        console.error('Error paying invoice:', error);
        document.getElementById('big-business-result').textContent = `Failed to pay invoice: ${error.message}`;
    }
}

// Utility function to truncate Ethereum addresses
function truncateAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Function to handle network changes
async function handleNetworkChange() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111) { // Sepolia testnet chain ID
        alert('Please switch to the Sepolia testnet in MetaMask');
        return false;
    }
    return true;
}

// Event listeners for MetaMask events
window.ethereum.on('accountsChanged', function (accounts) {
    if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
        clearLogAndReset();
    } else {
        connectWallet(); // Reconnect with the new account
    }
});

window.ethereum.on('chainChanged', function (chainId) {
    window.location.reload();
});

// Function to clear log and reset UI
function clearLogAndReset() {
    console.clear();
    console.log('Logs cleared and UI reset');

    document.getElementById('connectWallet').textContent = 'Connect Wallet';
    document.getElementById('small-business-result').textContent = '';
    document.getElementById('investor-result').textContent = '';
    document.getElementById('big-business-result').textContent = '';

    document.getElementById('smallBusinessTable').innerHTML = '<tr><th>Token ID</th><th>Amount</th><th>Recipient</th><th>Paid</th><th>For Sale</th><th>Sale Price</th><th>Action</th></tr>';
    document.getElementById('investorTable').innerHTML = '<tr><th>Token ID</th><th>Amount</th><th>Issuer</th><th>Sale Price</th><th>Action</th></tr>';
    document.getElementById('bigBusinessTable').innerHTML = '<tr><th>Token ID</th><th>Amount</th><th>Issuer</th><th>Paid</th><th>Action</th></tr>';

    contract = null;
    signer = null;
}

// Error handling function
function handleError(error, elementId) {
    console.error('Error:', error);
    document.getElementById(elementId).textContent = `Error: ${error.message}`;
}

// Function to validate Ethereum address
function isValidEthereumAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Function to validate amount
function isValidAmount(amount) {
    return !isNaN(amount) && parseFloat(amount) > 0;
}

// Update the createInvoice function to include input validation
async function createInvoice() {
    const recipient = document.getElementById('recipient').value;
    const amount = document.getElementById('amount').value;

    if (!isValidEthereumAddress(recipient)) {
        document.getElementById('small-business-result').textContent = 'Invalid recipient address';
        return;
    }

    if (!isValidAmount(amount)) {
        document.getElementById('small-business-result').textContent = 'Invalid amount';
        return;
    }

    try {
        const amountWei = ethers.utils.parseEther(amount);
        const tx = await contract.createInvoice(recipient, amountWei);
        await tx.wait();
        document.getElementById('small-business-result').textContent = 'Invoice created successfully!';
        updateDashboards();
    } catch (error) {
        handleError(error, 'small-business-result');
    }
}

// Function to update all dashboards
async function updateDashboards() {
    if (contract) {
        await updateSmallBusinessDashboard();
        await updateInvestorDashboard();
        await updateBigBusinessDashboard();
    }
}

// Function to list an invoice for sale
async function listInvoiceForSale(tokenId) {
    try {
        const salePrice = prompt("Enter the sale price in ETH:");
        if (salePrice === null || !isValidAmount(salePrice)) {
            document.getElementById('small-business-result').textContent = 'Invalid sale price';
            return;
        }
        
        const salePriceWei = ethers.utils.parseEther(salePrice);
        const tx = await contract.listInvoiceForSale(tokenId, salePriceWei);
        await tx.wait();
        document.getElementById('small-business-result').textContent = 'Invoice listed for sale successfully!';
        updateDashboards();
    } catch (error) {
        handleError(error, 'small-business-result');
    }
}

// Function to buy an invoice
async function buyInvoice(tokenId, price) {
    try {
        const tx = await contract.buyInvoice(tokenId, { value: price });
        await tx.wait();
        document.getElementById('investor-result').textContent = 'Invoice bought successfully!';
        updateDashboards();
    } catch (error) {
        handleError(error, 'investor-result');
    }
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupForms();
    clearLogAndReset();
});

// Function to setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showPage(targetId);
        });
    });
}

// Function to show a specific page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelector(`#${pageId}`).classList.add('active');
    
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    document.querySelector(`nav a[href="#${pageId}"]`).classList.add('active');

    updateDashboards();
}

// Function to setup forms
function setupForms() {
    const createInvoiceForm = document.getElementById('createInvoiceForm');
    if (createInvoiceForm) {
        createInvoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createInvoice();
        });
    }
}

// Add click event listener to the Connect Wallet button
document.getElementById('connectWallet').addEventListener('click', connectWallet);

// Call updateDashboards periodically to keep the UI up to date
setInterval(updateDashboards, 30000); // Update every 30 seconds

// Initialize tooltips if you're using them
document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
});
