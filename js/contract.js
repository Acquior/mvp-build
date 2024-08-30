const contractAddress = '0x524b0F673D311C35368eca5FB03957d9701D37AA';
const contractABI = [
    // Your existing ABI here
];
const ETH_TO_RAND = 1000000; // 1 ETH = 1,000,000 Rand
let contract;
let signer;

function setupEventListeners() {
    contract.on("InvoiceCreated", (tokenId, amount, issuer, recipient) => {
        console.log('Invoice created:', { tokenId: tokenId.toString(), amount: ethToRand(amount), issuer, recipient });
        updateDashboards();
    });

    contract.on("InvoiceListedForSale", (tokenId, salePrice) => {
        console.log('Invoice listed for sale:', { tokenId: tokenId.toString(), salePrice: ethToRand(salePrice) });
        updateDashboards();
    });

    contract.on("InvoiceSold", (tokenId, buyer, price) => {
        console.log('Invoice sold:', { tokenId: tokenId.toString(), buyer, price: ethToRand(price) });
        updateDashboards();
    });
}

async function updateDashboards() {
    const currentAddress = await signer.getAddress();
    updateSmallBusinessDashboard(currentAddress);
    updateInvestorDashboard(currentAddress);
    updateBigBusinessDashboard(currentAddress);
}
