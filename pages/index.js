import { useState, useEffect } from "react";

import Image from "next/image";

import styles from "../styles/Home.module.scss";

import introImage from "../assets/images/introImg2.svg";

export default function Home({ connect, checkRole }) {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = ["4.0", "Warranty Systems using NFTs"];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className={styles.homeLogin}>
      {/* <div className={styles.intro}>
        <h1>Web3</h1>
        <h2>Warranties</h2>
      </div> */}

      <div className={styles.introAnim}>
        <h1>
          {`Flipkart GRID |`}{" "}
          <span
            className={styles.textRotate}
            dataPeriod="1000"
            data-rotate='[ "4.0", "Warranty System using NFTs"]'
          >
            <span className={styles.wrap}>{text}</span>
          </span>
        </h1>
        <p>
          Introducing the all new NFT based Warranties. Forget about worrying
          where your warranty cards are and just with a click of a button, prove
          your ownership for your products.
        </p>
      </div>

      <Image className={styles.introImg} src={introImage} />
    </div>
  );
}
