import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CRYPTO_ICONS = {
  USDT: '💵',
  BTC: '₿',
  ETH: 'Ξ',
  SOL: '◎',
  BNB: 'BNB',
  TON: '💎',
  DOGE: 'Ð'
};

function MyAssets() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await axios.get('/api/user/wallet');
        setWallet(data.wallet);
      } catch (error) {
        console.error('Error fetching wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">My Assets</h1>

      <div className="grid gap-4">
        {Object.entries(wallet || {}).map(([currency, amount]) => (
          <div key={currency} className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{CRYPTO_ICONS[currency]}</span>
              <span className="font-semibold">{currency}</span>
            </div>
            <span className="text-lg font-bold">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAssets;