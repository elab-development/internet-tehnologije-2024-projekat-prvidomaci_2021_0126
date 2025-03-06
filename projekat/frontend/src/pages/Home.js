import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Account from '../components/Account';
import '../style/Home.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function Home({ user, accounts }) {
    const [currentAccount, setCurrentAccount] = useState(accounts.length > 0 ? accounts[0] : null);
    const [loading, setLoading] = useState(true);

    const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance_in_usd), 0);

    const chartData = {
        labels: accounts.map(account => account.account_number),
        datasets: [{
            label: '$',
            data: accounts.map(account => account.balance_in_usd),
            backgroundColor: [
                'rgba(33, 53, 85, 0.9)',
                'rgba(88, 111, 154, 0.9)',
                'rgba(216,196,182,0.6)',
                'rgba(136, 149, 212, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
                'rgba(33, 53, 85, 1)',
                'rgba(88, 111, 154, 1)',
                'rgba(216,196,182,1)',
                'rgba(136, 149, 212, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Account Balances in $',
            },
        },
    };

    useEffect(() => {
        if (accounts && accounts.length > 0) {
            setCurrentAccount(accounts[0]);
        }
        setLoading(false);
    }, [accounts]);

    const handleNextAccount = () => {
        if (accounts && accounts.length > 0) {
            const currentIndex = accounts.findIndex(acc => acc.id === currentAccount.id);
            const nextIndex = (currentIndex + 1) % accounts.length;
            setCurrentAccount(accounts[nextIndex]);
        }
    };

    const handlePreviousAccount = () => {
        if (accounts && accounts.length > 0) {
            const currentIndex = accounts.findIndex(acc => acc.id === currentAccount.id);
            const previousIndex = (currentIndex - 1 + accounts.length) % accounts.length;
            setCurrentAccount(accounts[previousIndex]);
        }
    };

    if (loading || !user) {
        return <p>Loading user data. Please wait...</p>;
    }

    return (
        <div>
            <div className="account-chart-container">
                <div className="info-container">
                    <h1 className="welcome-heading">Welcome {user.name}!</h1>
                    <Link to="/profile" className="profile-link">Profile Info</Link>
                    <p className="accounts-text">Your accounts:</p>
                    {currentAccount ? (
                        <Account account={currentAccount} />
                    ) : (
                        <p>No accounts available.</p>
                    )}
                </div>
                <div className="chart-container">
                    <Doughnut data={chartData} options={chartOptions} />
                    <div className="total-balance">
                        <strong>Total Balance:</strong> ${totalBalance.toFixed(2)}
                    </div>
                </div>
            </div>

            {accounts.length > 1 && (
                <div className="account-nav-buttons">
                    <button id='home-button1' className="account-button" onClick={handlePreviousAccount}>Previous</button>
                    <button id='home-button2' className="account-button" onClick={handleNextAccount}>Next</button>
                </div>
            )}
        </div>
    );
}

export default Home;