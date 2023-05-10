import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Audit from "./Pages/Audit"
import Layout from "./Pages/Layout"
import Public from "./Pages/Public"
import Upload from "./Pages/Upload"
import Viewer from "./Pages/Viewer"
import Login from "./Pages/Login"
import Register from "./Pages/Signup"
import Profile from "./Pages/Profile"

// import { useAuthContext } from './Hooks/useAuthContext'

import Web3 from "web3"
import Transactions from "./contracts/Transactions.json"

function App() {

    // const { user } = useAuthContext()

    const [contractInstance, setContractInstance] = useState(null)
    const [account, setAccount] = useState(null)

    useEffect(() => {
        const init = async () => {
          // Check for account in local storage
          const storedAccount = window.localStorage.getItem("account")
          if (storedAccount) {
            setAccount(storedAccount)
          }
    
          //Check if Web3 is injected by metamask
          if (window.ethereum) {
            try {
              //request account access if needed
              // await window.ethereum.request({ method: "eth_requestAccounts" })
    
              //get web3 instance
              const web3 = new Web3(window.ethereum)
    
              //get the contract instance
              const networkId = await web3.eth.net.getId()
              const deployedContract = Transactions.networks[networkId]
              // console.log(deployedContract)
              // console.log(deployedContract.address)
    
              if (!deployedContract) {
                console.error(`Contract not deployed on network ${networkId}`)
                return
              }
    
              const contractABI = Transactions.abi
              // console.log(contractABI)
              const myContract = new web3.eth.Contract(
                contractABI,
                deployedContract.address
              )
              setContractInstance(myContract)
            } catch (error) {
              console.log(error)
            }
          } else {
            alert("Please install Metamask to use this Dapp")
          }
        }
        init()
      }, [account])
    
      // wallet connection
      const connectWallet = async () => {

        try {
          //request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" })
          
          //get the user's account
          const web3 = new Web3(window.ethereum)
          const accounts = await web3.eth.getAccounts()
          if (accounts.length > 0) {
            setAccount(accounts[0])
            window.localStorage.setItem("account", accounts[0])

            // Wallet Connection to the database - using test-auth-wallet access-point
            const response = await fetch(`http://localhost:5000/test-auth-wallet?wallet=${accounts[0]}`)

            const json = await response.json()

            console.log(json)

            if (json.status){
              alert(json.message)
            }else{
              alert(json.message)
            }

          }
        } catch (error) {
          console.log(error)
        }
      }
    
      const disconnectWallet = () => {
        setAccount(null)
        window.localStorage.removeItem("account")
      }

    return (
        <>
            <BrowserRouter>
                <Routes>

                    <Route 
                        path = "/" 
                        element = {
                            // account ? 
                                <Layout 
                                    account={account}
                                    connectWallet={connectWallet}
                                    disconnectWallet={disconnectWallet}
                                /> 
                            // : 
                                // <Navigate to="/login"/>
                        }
                    >
                        <Route index element={<Public contract={contractInstance}/>} />
                        <Route path="public" element={<Public contract={contractInstance}/>} />
                        <Route path="audit" element={<Audit account={account} contract={contractInstance}/>} />
                        <Route path="upload" element={<Upload wallet={account} />} />
                        <Route path="profile" element={<Profile />} />

                    </Route>

                    <Route path="viewer" element={<Viewer wallet={account} contract={contractInstance}/>} />
                    
                  {/* 
                    <Route 
                        path="/login" 
                        element={!user ? <Login /> : <Navigate to="/" />} 
                    />

                    <Route 
                        path="/signup" 
                        element={!user ? <Register /> : <Navigate to="/" />} 
                    /> 
                  */}

                </Routes>
                
            </BrowserRouter>
        </>
    )
}

export default App
