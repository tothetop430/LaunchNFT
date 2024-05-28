import { FC, useEffect, useState } from "react";
import { Collection_Item } from "components/Collection_Item";
import { GetNftCollections } from "utils/web3";

const PINATA_GATEWAY_TOKEN = process.env.PINATA_GATEWAY_TOKEN;
const PINATA_GATEWAY_URL= process.env.PINATA_GATEWAY_URL;

export const CollectionsView: FC = ({}) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    GetNftCollections().then(async (values) => {
      console.log(">>> raw projects : ", values);
      let temp_projects = [];
      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        let uri = value.account.metadataUri;

        if (uri == "") {
          // show demo uri
          uri =
            "https://gateway.pinata.cloud/ipfs/QmXPraCJLkhw9aYHsSKBd7ZgzHoV52f9egEdXXZA2dTSGM/metadata/0.json";
        }

        try {
          let res;
          try {
            const temp_url =
              uri.replace(
                "gateway.pinata.cloud",
                PINATA_GATEWAY_URL
              ) +
              `?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
            const result = await fetch(temp_url);
            res = await result.json();
          } catch (e) {
            res = JSON.parse(
              '{"name":"NFT #0","symbol":"123123123","description":"NFT #0 - Generated and deployed on LaunchMyNFT.","attributes":[{"trait_type":"Accessory","value":"Tear Tattoo Red"},{"trait_type":"Background","value":"Black"},{"trait_type":"Face","value":"Round Aqua"},{"trait_type":"Left Eye","value":"Swirl Purple"},{"trait_type":"Mouth","value":"Grin Pink"},{"trait_type":"Right Eye","value":"Swirl Pink"},{"trait_type":"Rarity Rank","value":48,"display_type":"number","max_value":100}],"image":"https://gateway.pinata.cloud/ipfs/QmYA2eiJ4AiaMtgXz965bTuARgJt8eAEX4Yhew4G8RmLAX/images/0.jpeg"}'
            ) as any;
          }
          const temp_img_url =
            res.image.replace(
              "gateway.pinata.cloud",
              PINATA_GATEWAY_URL
            ) +
            `?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;

          temp_projects.push({
            ...value,
            imageUri: temp_img_url,
          });
        } catch (e) {}
      }
      setProjects(temp_projects);
    });
  }, []);

  const description =
    "GetNftCollections Err->16 UnexpectedAccountError: The account at the provided address [] is not of the expected type [CandyMachine].Source: SDK Caused By: RangeError: Trying to access beyond buffer length";

  //All information can be find in item.image_url
  return (
    <div className="flex flex-row flex-wrap justify-start items-center w-full my-10">
      {/* {projects.length} */}
      {projects.map((item, ind) => (
        <div
          className="flex flex-row flex-wrap w-1/4 p-4"
          key={"project_" + ind}
        >
          <a
            className="w-full"
            href={"project_detail/" + item.publicKey.toString()}
          >
            <Collection_Item project={item} />
          </a>
        </div>
      ))}
    </div>
  );
};
