import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnnouncementBanner from '../components/AnnouncementBanner';
import PrizeWheel from '../components/PrizeWheel';

function Dashboard() {
  const { user } = useAuth();
  const [lastPrize, setLastPrize] = useState(null);
  const navigate = useNavigate();

  const handlePrizeWon = (prize) => {
    setLastPrize(prize);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">
          Welcome, {user?.username}!
        </h1>
      </div>

      <AnnouncementBanner />

      <div className="card mb-6">
        <PrizeWheel onPrizeWon={handlePrizeWon} />
        
        {lastPrize && (
          <div className="mt-4 text-center">
            <h3 className="text-xl font-semibold">Congratulations!</h3>
            <p className="text-lg">
              You won: <span className="text-secondary font-bold">{lastPrize}</span>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/assets')}
          className="btn btn-primary"
        >
          My Assets
        </button>
        <button
          onClick={() => navigate('/referral')}
          className="btn btn-secondary"
        >
          Referral Program
        </button>
      </div>
    </div>
  );
}

export default Dashboard;