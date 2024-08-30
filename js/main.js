// Utility functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if (pageId !== 'home' && contract) {
        updateDashboards();
    }
    // Hide welcome message on dashboards
    document.querySelector('.welcome-message').style.display = pageId === 'home' ? 'block' : 'none';
}

function ethToRand(ethAmount) {
    return ethers.utils.formatEther(ethAmount) * ETH_TO_RAND;
}

function randToEth(randAmount) {
    return ethers.utils.parseEther((randAmount / ETH_TO_RAND).toString());
}

function formatRand(amount) {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
}

function truncateAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Initialization
function clearLogAndReset() {
    console.clear();
    console.log('Logs cleared and UI reset');

    document.getElementById('small-business-result').textContent = '';
    document.getElementById('big-business-result').textContent = '';
    document.getElementById('investor-result').textContent = '';

    document.getElementById('smallBusinessTable').innerHTML = '';
    document.getElementById('bigBusinessTable').innerHTML = '';
    document.getElementById('investorTable').innerHTML = '';

    contract = null;
    signer = null;
}

window.addEventListener('load', clearLogAndReset);
