import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Web3Modal from "web3modal";

import { contractAddress } from "../config";

import Warrenty from "../artifacts/contracts/WarrantyNFT.sol/Warranty.json";

import '../styles/globalStyles.scss'

import Navbar from "../components/Navbar/Navbar";

function MyApp({ Component, pageProps }) {
  const [role, setRole] = useState(4);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [connected, setConnectedState] = useState("NA");

  const getRole = {
    0: "USER",
    1: "MINTER",
    2: "ADMIN",
    4: "NA",
  };

  async function connect() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const warrantyContract = new ethers.Contract(
      contractAddress,
      Warrenty.abi,
      provider
    );

    const haveRole = await warrantyContract.checkRole();
    console.log(haveRole);
    setRole(haveRole);
    setLoadingState("loaded");
    setConnectedState(getRole[role]);
  }

  return (
    <div>
      <Navbar connected={connected} connect={connect}/>
      <Component 
        {...pageProps} 
        connect={connect}
        connected={connected}
      />
    </div>
  );
}

export default MyApp;
