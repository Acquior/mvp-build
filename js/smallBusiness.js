async function updateSmallBusinessDashboard(currentAddress) {
    const table = document.getElementById('smallBusinessTable');
    table.innerHTML = '';

    const addedTokens = new Set();

    for (let i = 0; i < 100; i++) {
        try {
            const invoice = await contract.invoices(i);
            if (invoice[1] === currentAddress && !addedTokens.has(i)) {
                addedTokens.add(i);
                const row = table.insertRow(-1);
                row.insertCell(0).innerHTML = `<td data-label="Token ID"><strong>Token ID:</strong> ${i}</td>`;
                row.insertCell(1).innerHTML = `<td data-label="Amount"><strong>Amount:</strong> ${formatRand(ethToRand(invoice[0]))}</td>`;
                row.insertCell(2).innerHTML = `<td data-label="Recipient"><strong>Recipient:</strong> ${truncateAddress(invoice[2])}</td>`;
                row.insertCell(3).innerHTML = `<td data-label="Paid"><strong>Paid:</strong> ${invoice[3] ? "Yes" : "No"}</td>`;
                row.insertCell(4).innerHTML = `<td data-label="For Sale"><strong>For Sale:</strong> ${invoice[4] ? "Yes" : "No"}</td>`;
                row.insertCell(5).innerHTML = `<td data-label="Sale Price"><strong>Sale Price:</strong> ${formatRand(ethToRand(invoice[5]))}</td>`;
                
                const actionCell = row.insertCell(6);
                actionCell.setAttribute('data-label', 'Action');
                if (!invoice[3] && !invoice[4]) {
                    const listButton = document.createElement('button');
                    listButton.textContent = "List for Sale";
                    listButton.onclick = () => listInvoiceForSale(i);
                    actionCell.appendChild(listButton);
                }
            }
        } catch (error) {
            console.error(`Error fetching invoice ${i}:`, error);
            break;
        }
    }
}

async function createInvoice(event) {
    event.preventDefault();
    try {
        const recipient = document.getElementById('recipient').value;
        const amount = ethers.utils.parseEther(document.getElementById('amount').value);
        
        console.log('Sending createInvoice transaction on Amoy...');
        const gasPrice = await getGasPrice();
        const tx = await contract.createInvoice(recipient, amount, { gasPrice });
        console.log('Transaction sent, waiting for confirmation...');
        const receipt = await tx.wait();
        console.log('Transaction confirmed on Amoy:', receipt);

        const event = receipt.events.find(e => e.event === 'InvoiceCreated');
        if (event) {
            const [tokenId, amount, issuer, recipient] = event.args;
            document.getElementById('small-business-result').textContent = `Invoice created: Token ID ${tokenId}, Amount ${formatRand(ethToRand(amount))}, Recipient ${recipient}`;
        } else {
            document.getElementById('small-business-result').textContent = `Invoice created on Amoy. Transaction hash: ${receipt.transactionHash}`;
        }
        updateDashboards();
    } catch (error) {
        console.error('Error creating invoice on Amoy:', error);
        document.getElementById('small-business-result').textContent = 'Failed to create invoice on Amoy. See console for details.';
    }
}

async function listInvoiceForSale(tokenId) {
    try {
        const salePrice = prompt("Enter the sale price in Rands:");
        if (salePrice === null) return;
        const salePriceWei = randToEth(salePrice);
        
        console.log(`Attempting to list invoice for sale on Amoy. Token ID: ${tokenId}, Sale Price: ${ethers.utils.formatEther(salePriceWei)} MATIC`);

        const gasPrice = await getGasPrice();
        const tx = await contract.listInvoiceForSale(tokenId, salePriceWei, { gasPrice });
        console.log('Transaction sent, waiting for confirmation...');
        const receipt = await tx.wait();
        console.log('Invoice listed for sale successfully on Amoy', receipt);
        document.getElementById('small-business-result').textContent = 'Invoice listed for sale successfully on Amoy!';
        updateDashboards();
    } catch (error) {
        console.error('Error listing invoice for sale on Amoy:', error);
        document.getElementById('small-business-result').textContent = `Failed to list invoice for sale on Amoy: ${error.message}`;
    }
}
