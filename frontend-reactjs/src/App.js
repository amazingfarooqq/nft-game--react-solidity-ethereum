import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ABI, CONTRACT_ADDRESS, transformCharacterData } from './constants';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [characterNFT, setCharacterNFT] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');

        setIsLoading(false);

        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);

  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    /*
     * The function we will call that interacts with our smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
  
      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      }

      setIsLoading(false);

    };
  
    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);
  

  return (
    <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
        <p className="sub-text">Team up to protect the Metaverse!</p>
        {/* This is where our button and image code used to be!
         *	Remember we moved it into the render method.
         */}

         {isLoading &&
         <LoadingIndicator />
         }
         {!currentAccount && (
           <div className="connect-wallet-container">
           {console.log('!currentAccount')}
            <img
              src="https://images.pexels.com/photos/5435456/pexels-photo-5435456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Monty Python Gif"
            />
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
              Connect Wallet To Get Started
            </button>
          </div>
         )}

         {currentAccount && !characterNFT && (
          <>
           {console.log('currentAccount && !characterNFT')}

          <SelectCharacter setCharacterNFT={setCharacterNFT} />
          </>
         )}

          {currentAccount && characterNFT && (
            <>
  <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} currentAccount={currentAccount}/>
            </>
          )}
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built with @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
  );
};

export default App;