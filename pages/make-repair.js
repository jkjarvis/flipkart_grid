import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

import { contractAddress } from "../config";

import styles from '../styles/MakeRepair.module.scss';

import Warrenty from "../artifacts/contracts/WarrantyNFT.sol/Warranty.json";

export default function MakeRepair() {
  const [formInput, updateFormInput] = useState({
    serialNumber: "",
    description: "",
  });
  const router = useRouter();

  async function makeRepair(tokenId) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(contractAddress, Warrenty.abi, signer);
    console.log(formInput);
    let transaction = await contract
      .makeRepair(formInput.serialNumber, formInput.description)
      .catch((e) => alert(e));
    await transaction.wait();

    router.push("/");
  }

  return (
    <div className={styles.container}>
        <input
          placeholder="Serial Number"
          onChange={(e) =>
            updateFormInput({ ...formInput, serialNumber: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <button
          onClick={makeRepair}
          className={styles.mintButton}
        >
          Make Repair
        </button>
    </div>
  );
}
