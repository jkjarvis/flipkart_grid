import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import Link from "next/link";

import styles from "../styles/MyNfts.module.scss";

import { contractAddress } from "../config";
import Warranty from "../artifacts/contracts/WarrantyNFT.sol/Warranty.json";

export default function MyNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const warrantyContract = new ethers.Contract(
      contractAddress,
      Warranty.abi,
      signer
    );

    const data = await warrantyContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await warrantyContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let item = {
          name: meta.data.name,
          serialNumber: i.serialNumber,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          warrantyExpiry: new Date(
            i.warrantyExpiry.toNumber() * 1000
          ).toISOString(),
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className={styles.noNft}>No NFTs owned</h1>;
  return (
    <div className={styles.nftContainer}>
      {nfts.map((nft, i) => (
        <div key={i} className={styles.nftCard}>
          <div
            className={styles.nft}
            style={{ backgroundImage: `url(` + nft.image + `)` }}
          >
            <p className={styles.name}>{nft.name}</p>

            <div className={styles.details}>
              <p>
                <b>Serial No:</b> {nft.serialNumber}
              </p>
              <p>
                <b>Expiry:</b> {nft.warrantyExpiry}
              </p>
            </div>
          </div>
          <Link href={`/check-repair/${JSON.stringify(nft.tokenId)}`}>
            <button className={styles.nftRepair}>Check Repairs</button>
          </Link>
          <Link href={`/resell/${JSON.stringify(nft.tokenId)}`}>
            <button className={styles.nftRepair}>Resell</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
