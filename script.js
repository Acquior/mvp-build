document.addEventListener('DOMContentLoaded', function() {
    const connectWalletButton = document.querySelector('.connect-wallet');
    const cards = document.querySelectorAll('.card');

    // Connect Wallet functionality
    connectWalletButton.addEventListener('click', async function() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await ethereum.request({ method: 'eth_requestAccounts' });
                connectWalletButton.textContent = 'Connected';
                connectWalletButton.disabled = true;
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    });

    // Card click functionality
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const cardType = this.querySelector('h2').textContent;
            alert(`You clicked on ${cardType}. This feature is coming soon!`);
        });
    });
});
