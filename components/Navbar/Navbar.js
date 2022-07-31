import Link from "next/link";

import styles from "./Navbar.module.scss";

export default function Navbar({ connect, connected }) {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logo} />

      {connected === "NA" ? (
        <button onClick={() => connect()}>Connect</button>
      ) : (
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/create-product">Mint Token</Link>
          </li>
          <li>
            <Link href="/make-repair">Make Repair</Link>
          </li>
          <li>
            <Link href="/create-minter">Create Minter</Link>
          </li>
          <li>
            <Link href="/my-nfts">My NFTs</Link>
          </li>
        </ul>
      )}
    </div>
  );
}
