import styles from "./styles/Home.module.css";
import {
  ThirdwebNftMedia,
  ConnectWallet,
  useAddress,
  useContract,
  useNFTs,
  useOwnedNFTs,
  Web3Button,
  useContractMetadata,
} from "@thirdweb-dev/react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import {ref, set,push ,onValue} from "firebase/database";
import type { NextPage } from "next";
import { useEffect,useState } from "react";
import { NFT_COLLECTION_ADDRESS } from '../const/yourDetails';
import { Link } from "react-router-dom";
const Home: NextPage = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBs7zsMewLWsxXxMESHgxzib5MtgY_9ao4",
    authDomain: "apeofmars-30bd3.firebaseapp.com",
    projectId: "apeofmars-30bd3",
    databaseURL: "https://apeofmars-30bd3-default-rtdb.firebaseio.com/",
    storageBucket: "apeofmars-30bd3.appspot.com",
    messagingSenderId: "28414968159",
    appId: "1:28414968159:web:735e70b99ad76c381a76ea",
    measurementId: "G-0WC1V1954L"
  };
  let mintNum=5;
  //ids owned by the user wallet
  let ownedIds:any[]=[];
  //ids owned by the user db
  let dbIds:any[]=[];
  const app = initializeApp(firebaseConfig);
  //ids to be minted
  const [nftGlobalId, setGlobalId] = useState<any[]>([]);
  const [nftImage, setImages] = useState<string[]>([]);
  const [nftOrigin, setOrigin] = useState<number[]>([]);
  const [nftRarity, setRarity] = useState<number[]>([]);
  const [nftcoolDifferenceTime, setcoolDifferenceTime] = useState<number[]>([]);
  const [nftminrate, setminrate] = useState<number[]>([]);
  const [nftpower, setpower] = useState<number[]>([]);
  const [nftpowerlevels, setpowerlevels] = useState<number[]>([]);
  const [nftpowerValue, setpowerValue] = useState<number[]>([]);
  useEffect(() => {
    const database = getDatabase(app);
    const starCountRef = ref(database, 'users/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
      // console.log(data);
      setGlobalId(keys.slice(0,5));
      
      const imageArray: string[] = [];
      const originArray: number[] = [];
      const rarityArray: number[] = [];
      const coolDiffereneTimeArray: number[] = [];
      const minrateArray: number[] = [];
      const powerArray: number[] = [];
      const powerLevelsArray: number[] = [];
      const powerValueArray: number[] = [];
      keys.slice(0,5).forEach((key) => {
        const { imageurl, Origin, Rarity, coolDifferenceTime, minrate, power, powerLevels, powerValue } = data[key];
        imageArray.push(imageurl);
        originArray.push(Origin);
        rarityArray.push(Rarity); 
        coolDiffereneTimeArray.push(coolDifferenceTime);
        minrateArray.push(minrate);
        powerArray.push(power);
        powerLevelsArray.push(powerLevels);
        powerValueArray.push(powerValue);
      });

      setImages(imageArray);
      setOrigin(originArray);
      setRarity(rarityArray);
      setcoolDifferenceTime(coolDiffereneTimeArray);
      setminrate(minrateArray);
      setpower(powerArray);
      setpowerlevels(powerLevelsArray);
      setpowerValue(powerValueArray);
    });
  }, []);

  console.log("GlobalId",nftGlobalId);
  // console.log("Origin",nftOrigin);
  // console.log("ImageUrls",nftImage);
  // console.log("Rarity",nftRarity);
  // console.log("cooldifference",nftcoolDifferenceTime);
  // console.log("minrate",nftminrate);
  // console.log("power",nftpower);
  // console.log("powerlevels",nftpowerlevels);
  // console.log("powervalue",nftpowerValue);
  const address = useAddress(); 
  // console.log(address);
  const [hover, setHover] = useState<boolean>(false);
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data: contractMetadata, isLoading: contractLoading } =
    useContractMetadata(contract);
  // Fetch the NFT collection from thirdweb via it's contract address.
  const { contract: nftCollection } = useContract(
    NFT_COLLECTION_ADDRESS,
    "nft-collection"
  );


  const { data: nfts, isLoading:loadingNfts } = useOwnedNFTs(nftCollection, address);
 
  if(nfts){
    nfts.forEach((nft)=>{
      ownedIds.push(nft.metadata.globalId);
    })
  }  
  console.log(ownedIds);
  const deletionFB = (globalIds: string[]) => {
    globalIds.forEach((id)=>{

      console.log(id,"Deleted");
    });
  };
  const updateDb = (array1: string[], array2: string[]) => {
    // Remove elements from array1 that don't appear in array2
    const newArray1 = array1.filter((element) => array2.includes(element));
  
    // Add elements to newArray1 that are in array2 but not originally in array1
    array2.forEach((element) => {
      if (!array1.includes(element)&&element!=undefined) {
        newArray1.push(element);
      }
    });
    //new array for db
    return newArray1;
  };
  //need to be updated after nfts minted
  dbIds=updateDb(dbIds,ownedIds);
  console.log("dbIds",dbIds);

  
  const mintWithSignature = async (num:any) => {
    try {
      mintNum = num;
      const signedPayloadReq = await fetch(`/api/server`, {
        method: "POST",
        body: JSON.stringify({
          authorAddress: address, 
          nftImage: nftImage,
          nftGlobalId: nftGlobalId,
          nftOrigin: nftOrigin,
          nftRarity: nftRarity,
          nftcoolDifferenceTime: nftcoolDifferenceTime,
          nftminrate: nftminrate,
          nftpower: nftpower,
          nftpowerValue: nftpowerValue,
          nftpowerlevels: nftpowerlevels,
          mintNum: mintNum
        }),
      });
      const json = await signedPayloadReq.json();

      if (!signedPayloadReq.ok) {
        alert(json.error);
      }
      const signedPayload = json.signedPayload;

      const nft = await nftCollection?.signature.mintBatch(signedPayload);

      alert("Minted succesfully!");
      deletionFB(nftGlobalId);
      return nft;
    } catch (e) {
      console.error("An error occurred trying to mint the NFT:", e);
    }
  };
  
  return (
    
    <div className={styles.container}>
       <ConnectWallet theme="dark" />
      <div className={styles.collectionContainer}>
    <h2>
      {contractMetadata?.name}
    </h2>
        <input
          type="text"
          placeholder="Search"
          className={styles.textInput}
          maxLength={26}
          // onChange={(e) => setNftName(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 24, marginLeft: 40 }}>
      
      {address ? <Web3Button style={{ marginRight: 40 }}
          
          contractAddress="0x975eDbCcb2C2f804002f9c7268756aFcb77b2EC8"
          action={() => mintWithSignature(5)}
        >
          Mint 5 NFTs
        </Web3Button> : <></>}
        {address ? <Web3Button style={{ marginRight: 40 }}
          
          contractAddress="0x975eDbCcb2C2f804002f9c7268756aFcb77b2EC8"
          action={() => mintWithSignature(10)}
        >
          Mint 10 NFTs
        </Web3Button> : <></>}
        {address ? <Web3Button style={{ marginRight: 40 }}
          
          contractAddress="0x975eDbCcb2C2f804002f9c7268756aFcb77b2EC8"
          action={() => mintWithSignature(15)}
        >
          Mint 15 NFTs
        </Web3Button> : <></>}    
      </div>

      <hr className={styles.smallDivider} />

      <div className={styles.collectionContainer}>
        <h2 className={styles.ourCollection}>Other Owned NFTs in this collection:</h2>

        {loadingNfts ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.nftGrid}>
            {nfts?.map((nft) => (
              <div className={styles.nftItem} key={nft.metadata.id.toString()}>
              <div style={{ textAlign: "center" }}
               onMouseEnter={() => setHover(true)}
               onMouseLeave={() => setHover(false)}
               >

                <ThirdwebNftMedia
          metadata={nft.metadata}
          
          />
          
          </div>
                <div style={{ textAlign: "center" }}>
                  <p>#{nft.metadata.id}</p>
                 
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
