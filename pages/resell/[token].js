import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";

import { contractAddress } from "../../config";

import styles from "../../styles/CreateMinter.module.scss";

import Warrenty from "../../artifacts/contracts/WarrantyNFT.sol/Warranty.json";

export default function CreateMinter() {
  const [repairs, setRepairs] = useState([]);

  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  const { token } = router.query;
  const [tokenId, setToken] = useState(token);

  const [formInput, updateFormInput] = useState({
    resellAddress: "",
  });

  async function resell() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(contractAddress, Warrenty.abi, signer);
    let transaction = await contract
      .resell(token, formInput.resellAddress)
      .catch((e) => console.log(e));

    await transaction.wait();

    router.push("/");
  }

  return (
    <div className={styles.container}>
      <input
        placeholder="Buyer Address"
        className="mt-8 border rounded p-4"
        onChange={(e) =>
          updateFormInput({ ...formInput, resellAddress: e.target.value })
        }
      />
      <button onClick={resell} className={styles.mintButton}>
        Resell
      </button>
    </div>
  );
}
