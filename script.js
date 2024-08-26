document.addEventListener('DOMContentLoaded', function() {
    const connectWalletButton = document.querySelector('.connect-wallet');
    
    connectWalletButton.addEventListener('click', async function() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await ethereum.request({ method: 'eth_requestAccounts' });
                this.textContent = 'Connected';
                this.disabled = true;
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    });
});
