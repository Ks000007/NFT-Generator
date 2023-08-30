import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

import "../styles/globals.css";
import { NFT_COLLECTION_ADDRESS } from "../../const/yourDetails";

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
   
    
    // De-structure the arguments we passed in out of the request body
    const { authorAddress, nftImage,nftGlobalId,nftOrigin,nftRarity,nftcoolDifferenceTime,nftminrate,nftpower,nftpowerValue,nftpowerlevels, mintNum} = JSON.parse(req.body);

    // You'll need to add your private key in a .env.local file in the root of your project
    // !!!!! NOTE !!!!! NEVER LEAK YOUR PRIVATE KEY to anyone!
    if (!process.env.PRIVATE_KEY) {
      throw new Error("You're missing PRIVATE_KEY in your .env.local file.");
    }

    // Initialize the Thirdweb SDK on the serverside
    const sdk = ThirdwebSDK.fromPrivateKey(
      // Your wallet private key (read it in from .env.local file)
      process.env.PRIVATE_KEY as string,
      "mumbai"
    );

    // Load the NFT Collection via it's contract address using the SDK
    const nftCollection = await sdk.getContract(
      // Use your NFT_COLLECTION_ADDRESS constant
      NFT_COLLECTION_ADDRESS,
      "nft-collection"
    );

 
    // const signedPayload = await nftCollection.signature.generate({
    //   to: authorAddress,
    //   metadata: {
    //     name: nftName as string,
    //     description: "An awesome animal NFT",
    //     image:"ipfs://QmPuGkbw4aEbWHK4Um3Bt1hkwPcjLHJYTpTB232nS3WZ1C/2.jpg"
    //   },
    // });
    let signedPayload;
    if(mintNum === 5){
      signedPayload = await nftCollection.signature.generateBatch([
        {
          to: authorAddress,
          metadata: {
          image:nftImage[0],
          globalId:nftGlobalId[0],
          Origin:nftOrigin[0],
          Rarity:nftRarity[0],
          coolDifferenceTime:nftcoolDifferenceTime[0],
          minrate:nftminrate[0],
          power:nftpower[0],
          powerValue:nftpowerValue[0],
          powerLevels: nftpowerlevels[0]
          },
        },
        {
          to:authorAddress,
          metadata: {
            image:nftImage[1],
            globalId:nftGlobalId[1],
            Origin:nftOrigin[1],
            Rarity:nftRarity[1],
            coolDifferenceTime:nftcoolDifferenceTime[1],
            minrate:nftminrate[1],
            power:nftpower[1],
            powerValue:nftpowerValue[1],
            powerLevels: nftpowerlevels[1]
    
          },
        },
        {
          to:authorAddress,
          metadata: {
            image:nftImage[2],
            globalId:nftGlobalId[2],
            Origin:nftOrigin[2],
            Rarity:nftRarity[2],
            coolDifferenceTime:nftcoolDifferenceTime[2],
            minrate:nftminrate[2],
            power:nftpower[2],
            powerValue:nftpowerValue[2],
            powerLevels: nftpowerlevels[2]
    
          },
        },
        {
          to:authorAddress,
          metadata: {
            image:nftImage[3],
            globalId:nftGlobalId[3],
            Origin:nftOrigin[3],
            Rarity:nftRarity[3],
            coolDifferenceTime:nftcoolDifferenceTime[3],
            minrate:nftminrate[3],
            power:nftpower[3],
            powerValue:nftpowerValue[3],
            powerLevels: nftpowerlevels[3]
    
          },
        },
        {
          to:authorAddress,
          metadata: {
            image:nftImage[4],
          globalId:nftGlobalId[4],
          Origin:nftOrigin[4],
          Rarity:nftRarity[4],
          coolDifferenceTime:nftcoolDifferenceTime[4],
          minrate:nftminrate[4],
          power:nftpower[4],
          powerValue:nftpowerValue[4],
          powerLevels: nftpowerlevels[4]
  
          },
        }
      ]);
    }
    
    // Return back the signedPayload to the client.
    res.status(200).json({
      signedPayload: JSON.parse(JSON.stringify(signedPayload)),
    });
  } catch (e) {
    res.status(500).json({ error: `Server error ${e}` });
  }
}
