import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

function App() {

  const [greeting, setGreetingValue] = useState('')


  async function requestAccount() {
    //request account from metamask
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function fetchGreeting() {
    //get contract instance
    if (typeof window.ethereum !== 'undefined') {
      //get account from metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      //get contract instance
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (e) {
        console.log('error: ', e)
      }
    }
  }

  async function setGreeting() {
    //check if account is available
    if (!greeting) return

    if (typeof window.ethereum !== 'undefined') {
      //get account from metamask
      await requestAccount()

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      //create a signer for transaction 
      const signer = provider.getSigner()
      //get contract instance with signer from metamask account
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      //send transaction to blockchain and wait for confirmation 
      await transaction.wait()
      //get new greeting from blockchain
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch greeting</button>
        <button onClick={setGreeting}>Set greeting</button>
        <input type="text"
          value={greeting}
          onChange={e => setGreetingValue(e.target.value)}
          placeholder="Enter greeting"
        />
      </header>
    </div>
  );
}

export default App;
