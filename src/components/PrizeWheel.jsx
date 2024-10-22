import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import axios from 'axios';

const CRYPTO_DATA = [
  { option: 'USDT', style: { backgroundColor: '#26A17B' } },
  { option: 'BTC', style: { backgroundColor: '#F7931A' } },
  { option: 'ETH', style: { backgroundColor: '#627EEA' } },
  { option: 'SOL', style: { backgroundColor: '#00FFA3' } },
  { option: 'BNB', style: { backgroundColor: '#F3BA2F' } },
  { option: 'TON', style: { backgroundColor: '#0088CC' } },
  { option: 'DOGE', style: { backgroundColor: '#C2A633' } },
];

function PrizeWheel({ onPrizeWon }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [nextSpinTime, setNextSpinTime] = useState(null);

  useEffect(() => {
    fetchSpinData();
  }, []);

  const fetchSpinData = async () => {
    try {
      const { data } = await axios.get('/api/user/spins');
      setSpinsLeft(data.spinsRemaining);
      setNextSpinTime(data.nextSpinTime);
    } catch (error) {
      console.error('Error fetching spin data:', error);
    }
  };

  const handleSpinClick = async () => {
    if (spinsLeft === 0 || mustSpin) return;

    try {
      const { data } = await axios.post('/api/user/spin');
      setPrizeNumber(CRYPTO_DATA.findIndex(crypto => crypto.option === data.prize));
      setMustSpin(true);
      setSpinsLeft(prev => prev - 1);
      setNextSpinTime(data.nextSpinTime);
    } catch (error) {
      console.error('Error spinning wheel:', error);
    }
  };

  const handleSpinStop = () => {
    setMustSpin(false);
    onPrizeWon(CRYPTO_DATA[prizeNumber].option);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <span className="text-lg font-semibold">
          Spins: {spinsLeft}/10
        </span>
        {spinsLeft < 10 && nextSpinTime && (
          <div className="text-sm text-gray-600">
            Next spin in: <SpinTimer nextSpinTime={nextSpinTime} onComplete={fetchSpinData} />
          </div>
        )}
      </div>
      
      <div className="relative">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={CRYPTO_DATA}
          onStopSpinning={handleSpinStop}
          backgroundColors={CRYPTO_DATA.map(crypto => crypto.style.backgroundColor)}
          textColors={['#ffffff']}
          outerBorderColor="#ccc"
          outerBorderWidth={2}
          innerRadius={0}
          radiusLineColor="#dedede"
          radiusLineWidth={1}
          fontSize={20}
        />
        <button
          onClick={handleSpinClick}
          disabled={spinsLeft === 0 || mustSpin}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-secondary text-white rounded-full w-16 h-16 
                     flex items-center justify-center font-bold
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          SPIN
        </button>
      </div>
    </div>
  );
}

function SpinTimer({ nextSpinTime, onComplete }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(nextSpinTime).getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
        onComplete();
        return;
      }

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextSpinTime, onComplete]);

  return <span>{timeLeft}</span>;
}

export default PrizeWheel;