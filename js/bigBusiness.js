async function updateBigBusinessDashboard(currentAddress) {
    const table = document.getElementById('bigBusinessTable');
    table.innerHTML = '';

    for (let i = 0; i < 100; i++) {
        try {
            const invoice = await contract.invoices(i);
            if (invoice[2] === currentAddress) {
                const row = table.insertRow(-1);
                row.insertCell(0).innerHTML = `<td data-label="Token ID"><strong>Token ID:</strong> ${i}</td>`;
                row.insertCell(1).innerHTML = `<td data-label="Amount"><strong>Amount:</strong> ${formatRand(ethToRand(invoice[0]))}</td>`;
                row.insertCell(2).innerHTML = `<td data-label="Issuer"><strong>Issuer:</strong> ${truncateAddress(invoice[1])}</td>`;
                row.insertCell(3).innerHTML = `<td data-label="Recipient"><strong>Recipient:</strong> ${truncateAddress(invoice[2])}</td>`;
                row.insertCell(4).innerHTML = `<td data-label="Paid"><strong>Paid:</strong> ${invoice[3] ? "Yes" : "No"}</td>`;
                row.insertCell(5).innerHTML = `<td data-label="For Sale"><strong>For Sale:</strong> ${invoice[4] ? "Yes" : "No"}</td>`;
                row.insertCell(6).innerHTML = `<td data-label="Sale Price"><strong>Sale Price:</strong> ${formatRand(ethToRand(invoice[5]))}</td>`;
                
                const actionCell = row.insertCell(7);
                actionCell.setAttribute('data-label', 'Action');
                if (!invoice[3]) {
                    const payButton = document.createElement('button');
                    payButton.textContent = "Pay";
                    payButton.onclick = () => payInvoice(i, invoice[0]);
                    actionCell.appendChild(payButton);
                }
            }
        } catch (error) {
            console.error(`Error fetching invoice ${i}:`, error);
            break;
        }
    }
}

async function payInvoice(tokenId, amount) {
    try {
        console.log(`Attempting to pay invoice on Amoy. Token ID: ${tokenId}, Amount: ${ethers.utils.formatEther(amount)} MATIC`);
        
        const gasPrice = await getGasPrice();
        const estimatedGas = await contract.estimateGas.payInvoice(tokenId, { value: amount });
        const gasLimit = estimatedGas.mul(120).div(100); // 20% buffer
        
        const tx = await contract.payInvoice(tokenId, { 
            value: amount,
            gasPrice: gasPrice,
            gasLimit: gasLimit
        });
        console.log('Transaction sent, waiting for confirmation...');
        const receipt = await tx.wait();
        console.log('Invoice paid successfully on Amoy', receipt);
        document.getElementById('big-business-result').textContent = 'Invoice paid successfully on Amoy!';
        updateDashboards();
    } catch (error) {
        console.error('Error paying invoice on Amoy:', error);
        document.getElementById('big-business-result').textContent = `Failed to pay invoice on Amoy: ${error.message}`;
    }
}
