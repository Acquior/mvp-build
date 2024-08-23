let contract;
let signer;

document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupForms();
    loadMockData();
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
}

function setupForms() {
    const createInvoiceForm = document.getElementById('createInvoiceForm');
    if (createInvoiceForm) {
        createInvoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const recipient = document.getElementById('recipient').value;
            const amount = document.getElementById('amount').value;
            createInvoice(recipient, amount);
        });
    }
}

function createInvoice(recipient, amount) {
    // Mock function - replace with actual contract interaction
    console.log(`Creating invoice for ${recipient} with amount ${amount}`);
    document.getElementById('statusMessage').textContent = `Invoice created for ${recipient} with amount R${amount}`;
    loadMockData(); // Refresh the invoices list
}

function loadMockData() {
    // Mock data for invoices
    const invoices = [
        { id: '123456', amount: 500, status: 'Unpaid' },
        { id: '789012', amount: 1000, status: 'Paid' }
    ];

    const invoicesList = document.getElementById('invoicesList');
    if (invoicesList) {
        invoicesList.innerHTML = invoices.map(invoice => `
            <div class="invoice">
                <p>Token ID: ${invoice.id}</p>
                <p>Amount: R${invoice.amount}</p>
                <p>Status: ${invoice.status}</p>
                ${invoice.status === 'Unpaid' ? '<button onclick="listForSale('+invoice.id+')">List for Sale</button>' : ''}
            </div>
        `).join('');
    }

    // Mock data for available invoices
    const availableInvoices = [
        { id: '12345', amount: 1000, salePrice: 1050 },
        { id: '67890', amount: 2500, salePrice: 2600 },
        { id: '54321', amount: 5000, salePrice: 5100 }
    ];

    const availableInvoicesList = document.getElementById('availableInvoices');
    if (availableInvoicesList) {
        availableInvoicesList.innerHTML = availableInvoices.map(invoice => `
            <div class="invoice">
                <p>Token ID: ${invoice.id}</p>
                <p>Amount: R${invoice.amount}</p>
                <p>Sale Price: R${invoice.salePrice}</p>
                <button onclick="buyInvoice(${invoice.id})">Buy</button>
            </div>
        `).join('');
    }

    // Mock data for invoices to pay
    const invoicesToPay = [
        { id: '12345', amount: 500, dueDate: '2023-10-15' },
        { id: '12346', amount: 300, dueDate: '2023-10-20' }
    ];

    const invoicesToPayList = document.getElementById('invoicesToPay');
    if (invoicesToPayList) {
        invoicesToPayList.innerHTML = invoicesToPay.map(invoice => `
            <div class="invoice">
                <p>Token ID: ${invoice.id}</p>
                <p>Amount: R${invoice.amount}</p>
                <p>Due Date: ${invoice.dueDate}</p>
                <button onclick="payInvoice(${invoice.id})">Pay</button>
            </div>
        `).join('');
    }
}

function listForSale(id) {
    console.log(`Listing invoice ${id} for sale`);
    // Implement actual listing logic here
}

function buyInvoice(id) {
    console.log(`Buying invoice ${id}`);
    // Implement actual buying logic here
}

function payInvoice(id) {
    console.log(`Paying invoice ${id}`);
    // Implement actual payment logic here
}

document.getElementById('connectWallet').addEventListener('click', async function() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            // Replace with your actual contract address and ABI
            contract = new ethers.Contract('YOUR_CONTRACT_ADDRESS', YOUR_CONTRACT_ABI, signer);
            this.textContent = 'Connected';
            this.disabled = true;
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
});
