async function updateInvestorDashboard(currentAddress) {
    const table = document.getElementById('investorTable');
    table.innerHTML = '';

    for (let i = 0; i < 100; i++) {
        try {
            const invoice = await contract.invoices(i);
            if (invoice[4] && invoice[1] !== currentAddress) {
                const row = table.insertRow(-1);
                
                // Token ID
                row.insertCell(0).innerHTML = `<td data-label="Token ID"><strong>Token ID:</strong> ${i}</td>`;
                
                // Wallet Address (Issuer)
                row.insertCell(1).innerHTML = `<td data-label="Wallet Address"><strong>Issuer:</strong> ${truncateAddress(invoice[1])}</td>`;
                
                // Amount
                row.insertCell(2).innerHTML = `<td data-label="Amount"><strong>Amount:</strong> ${formatRand(ethToRand(invoice[0]))}</td>`;
                
                // Sale Price
                row.insertCell(3).innerHTML = `<td data-label="Sale Price"><strong>Sale Price:</strong> ${formatRand(ethToRand(invoice[5]))}</td>`;
                
                // Buy Button
                const actionCell = row.insertCell(4);
                actionCell.setAttribute('data-label', 'Action');
                const buyButton = document.createElement('button');
                buyButton.textContent = "Buy";
                buyButton.onclick = () => buyInvoice(i, invoice[5]);
                actionCell.appendChild(buyButton);
                
                // Apply styling to the button
                buyButton.style.backgroundColor = '#4CAF50';
                buyButton.style.color = 'white';
                buyButton.style.border = 'none';
                buyButton.style.padding = '5px 10px';
                buyButton.style.cursor = 'pointer';
                buyButton.style.borderRadius = '4px';
                buyButton.style.fontSize = '14px';
                buyButton.style.width = 'auto';
            }
        } catch (error) {
            console.error(`Error fetching invoice ${i}:`, error);
            break;
        }
    }
}

async function buyInvoice(tokenId, price) {
    try {
        console.log(`Attempting to buy invoice on Amoy. Token ID: ${tokenId}, Price: ${ethers.utils.formatEther(price)} MATIC`);
        
        const gasPrice = await getGasPrice();
        const tx = await contract.buyInvoice(tokenId, { value: price, gasPrice });
        console.log('Transaction sent, waiting for confirmation...');
        const receipt = await tx.wait();
        console.log('Invoice bought successfully on Amoy', receipt);
        document.getElementById('investor-result').textContent = 'Invoice bought successfully on Amoy!';
        updateDashboards();
    } catch (error) {
        console.error('Error buying invoice on Amoy:', error);
        document.getElementById('investor-result').textContent = `Failed to buy invoice on Amoy: ${error.message}`;
    }
}
