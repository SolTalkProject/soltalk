console.log("app.js chargé");

const supabase = supabase.createClient(
  'https://wvdqwrheipulozuzdlxj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZHF3cmhlaXB1bG96dXpkbHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDgzMzMsImV4cCI6MjA2NjgyNDMzM30.2XXmz9Zh_oeUdr7STD8kha_LaCr5KtWaslbmCowFwMI'
);

document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById('connect-button');
  const addressDisplay = document.getElementById('wallet-address');
  const formSection = document.getElementById('messaging-form');

  let userPublicKey = null;

  connectButton.addEventListener('click', async () => {
    console.log("Connect Wallet cliqué");
    if ('solana' in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        try {
          const resp = await provider.connect();
          userPublicKey = resp.publicKey.toString();
          addressDisplay.innerText = `Connected: ${userPublicKey}`;
          formSection.style.display = 'block';
        } catch (err) {
          console.error('Wallet connection failed', err);
          alert('Erreur de connexion au wallet.');
        }
      } else {
        alert('Phantom Wallet non détecté.');
      }
    } else {
      alert('Aucun portefeuille Solana détecté.');
    }
  });

  window.sendMessage = async function () {
    const to = document.getElementById('recipient-address').value;
    const alias = document.getElementById('recipient-alias').value;
    const content = document.getElementById('message-content').value;

    if (!to || !content) {
      alert("L'adresse et le message sont requis.");
      return;
    }

    const { data, error } = await supabase.from('message').insert([
      {
        from: userPublicKey,
        to,
        alias,
        content,
        date: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert("Erreur lors de l'envoi du message.");
      console.error(error);
    } else {
      alert("Message envoyé !");
      document.getElementById('recipient-address').value = '';
      document.getElementById('recipient-alias').value = '';
      document.getElementById('message-content').value = '';
    }
  };
});