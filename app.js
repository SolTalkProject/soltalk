const connectButton = document.getElementById('connect-button');
const addressDisplay = document.getElementById('wallet-address');
const form = document.getElementById('messaging-form');

const supabase = window.supabase.createClient(
    'https://wvdqwrheipulozuzdlxj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZHF3cmhlaXB1bG96dXpkbHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDgzMzMsImV4cCI6MjA2NjgyNDMzM30.2XXmz9Zh_oeUdr7STD8kha_LaCr5KtWaslbmCowFwMI'
);

async function connectWallet() {
    if ('solana' in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
            try {
                const resp = await provider.connect();
                const address = resp.publicKey.toString();
                addressDisplay.innerText = 'Connected: ' + address;
                form.style.display = 'block';
            } catch (err) {
                console.error('Connection failed', err);
            }
        } else {
            alert('Phantom Wallet not found. Please install it.');
        }
    } else {
        alert('Solana wallet not found. Please install Phantom.');
    }
}

connectButton.addEventListener('click', connectWallet);

async function sendMessage() {
    const to = document.getElementById('recipient-address').value;
    const alias = document.getElementById('recipient-alias').value;
    const content = document.getElementById('message-content').value;
    const from = window.solana.publicKey.toString();

    if (!to || !content) {
        alert("Address and message are required.");
        return;
    }

    const { data, error } = await supabase.from('messages').insert([
        { from, to, alias, content, date: new Date().toISOString() }
    ]);

    if (error) {
        alert("Error sending message.");
        console.error(error);
    } else {
        alert("Message sent!");
        document.getElementById('recipient-address').value = '';
        document.getElementById('recipient-alias').value = '';
        document.getElementById('message-content').value = '';
    }
}