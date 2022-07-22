import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { contractAddress } from "../config";

import Warrenty from "../artifacts/contracts/WarrantyNFT.sol/Warranty.json";

export default function Home() {
  const [role, setRole] = useState(4);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const getRole = {
    0: "USER",
    1: "MINTER",
    2: "ADMIN",
    4: "NA",
  };

  useEffect(() => {}, []);

  async function checkRole() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const warrantyContract = new ethers.Contract(
      contractAddress,
      Warrenty.abi,
      provider
    );

    const role = await warrantyContract.checkRole();
    console.log(role);
    setRole(role);
    setLoadingState("loaded");
  }

  if (getRole[role] == "NA")
    return (
      <div className="center">
        <button onClick={() => checkRole()}>CONNECT</button>
      </div>
    );

  return (
    <div>
      <h1>{getRole[role]}</h1>
    </div>
  );
}
