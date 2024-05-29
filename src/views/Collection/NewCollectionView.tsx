/* eslint-disable */
"use client";
// Next, React
import React, { FC, useEffect, useState, useRef, ChangeEvent } from "react";
import { Button, Checkbox } from "flowbite-react";
import {
  Tabs,
  Label,
  TextInput,
  Datepicker,
  ToggleSwitch,
  Textarea,
  FileInput,
  TabsRef,
} from "flowbite-react";
import { TbCurrencySolana } from "react-icons/tb";
import { CgMathPercent } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import {
  addItems,
  createCollectionNft,
  CreateProject,
  generateCandyMachine,
  GetLaunchpad,
  SetProjectData,
} from "utils/web3";
//ipfs
import axios from "axios";
import FormData from "form-data";
// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "flowbite-react";
import { fr } from "date-fns/locale";
import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
const secret =
  "41a14iDkoRa6LMLAg8QVRyEeMd2qbneWNzw3GzEKriLdD5NGfNJ9AWJTMtLVh3gnq5i7n2LoKbSo1NN9Ud6s1n4p";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
  }
}

export const NewCollectionView: FC = ({}) => {
  const wallet2 = useWallet();
  const { connection } = useConnection();
  const [feeWallet, setFeeWallet] = useState("");
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  const [switch3, setSwitch3] = useState(false);
  const [switch4, setSwitch4] = useState(false);
  const [switch5, setSwitch5] = useState(false);

  const [pictures, setPictures] = useState([]);
  const [nfts_base_art_name, setBaseArtName] = useState("NFT #");
  const [nfts_description, setDescription] = useState(
    "{name}-Generated and deployed on LaunchMyNFT."
  );
  const [nfts_mint_cost, setMintCost] = useState(0.05);
  const [nfts_royalties, setRoyalties] = useState(250);
  const [second_royalty, setSecondRoyalty] = useState([
    { share: 100, address: wallet2.publicKey?.toString() },
  ]);
  const [collection_name, setCollectionName] = useState("");
  const [collection_symbol, setCollectionSymbol] = useState("");
  const [collection_description, setCollectionDescription] = useState("");
  const [launch_date, setLaunchDate] = useState("2024-05-16T19:30");
  const [uploadedRes, setUploadedRes] = useState("");
  const [images_to_upload, setImagesToUpload] = useState([]);
  const [metadatas_to_upload, setMetadatasToUpload] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPic, setSelectedPic] = useState(null);
  const [duplicatedCnt, setDuplicatedCnt] = useState(0);
  const [addCounter, setAddCounter] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(0);

  const REACT_APP_PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
  const REACT_APP_PINATA_API_SECRET = process.env.REACT_APP_PINATA_API_SECRET;

  const parseJsonFile = async (file_name) => {
    console.log(file_name);
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) =>
        resolve(JSON.parse((event.target as any).result));
      fileReader.readAsText(file_name);
    });
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(">>> uploaded file list : ", event.target);
    const len = event.target.files.length;
    // var fileURL = URL.createObjectURL(event.target.files[0]);
    // console.log("fff",fileURL)
    if (len > 0) {
      const temp_images = [];
      const temp_metas = [];
      for (let i = 0; i < len; i++) {
        const tempFile = event.target.files[i];
        console.log(">>> file: ", tempFile);
        if (tempFile.type.startsWith("image")) {
          temp_images.push(event.target.files[i]);
        } else if (tempFile.type.startsWith("application/json")) {
          temp_metas.push(event.target.files[i]);
        }
      }
      setImagesToUpload([...temp_images]);
      setMetadatasToUpload([...temp_metas]);
      const newResults = [];
      for (let i = 0; i < temp_images.length; i++) {
        const img_name = temp_images[i].name;
        const nft_name = collection_name + " # " + i;
        const nft_desc = collection_description;
        newResults.push({
          index: i,
          img_name: URL.createObjectURL(event.target.files[i]),
          nft_name: nft_name,
          nft_desc: nft_desc,
          real_name: img_name,
        });
      }
      setPictures(newResults);
      console.log("new result", newResults);
    } else {
      setPictures([]);
    }
  };

  const sendMetaToIPFS = async (ImgHash, len) => {
    try {
      const formData = new FormData();

      const metadata = JSON.stringify({
        name: "solpad",
      });
      formData.append("pinataMetadata", metadata);
      const temp_files = [];
      if (metadatas_to_upload.length > 0) {
        // user input json data
        for (let i = 0; i < metadatas_to_upload.length; i++) {
          let res = await parseJsonFile(metadatas_to_upload[i]);
          let mut_res = Object.assign({}, res, {
            image:
              "https://gateway.pinata.cloud/ipfs/" +
              ImgHash +
              "/images/" +
              images_to_upload[i].name,
          });
          temp_files.push(mut_res);
        }
      } else {
        // generate json data
        for (let i = 0; i < images_to_upload.length; i++) {
          const metaData = {
            name: collection_name + " # " + i,
            symbol: collection_symbol,
            description: collection_description,
            seller_fee_basis_points: 250,
            external_url: "",
            attributes: [],
            image:
              "https://gateway.pinata.cloud/ipfs/" +
              ImgHash +
              "/images/" +
              images_to_upload[i].name,
          };
          temp_files.push(metaData);
        }
      }

      temp_files.map((temp_file, index) => {
        const jsonBlob = new Blob([JSON.stringify(temp_file)], {
          type: "application/json",
        });
        formData.append(
          "file",
          jsonBlob,
          "solpad" + "/metadata/" + index.toString() + ".json"
        );
      });

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);
      //formData.append("file", image_name);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `${REACT_APP_PINATA_API_KEY}`,
          pinata_secret_api_key: `${REACT_APP_PINATA_API_SECRET}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // const MetaHash = `ipfs://${resFile.data.IpfsHash}`;
      const MetaHash = resFile.data.IpfsHash;

      setUploadedRes(MetaHash);
      console.log("meta hash", MetaHash);
      // sendJSONtoIPFS(MetaHash);
    } catch (error) {
      console.log("File to IPFS: ");
      console.log(error);
    }
  };

  const sendFileToIPFS = async (e) => {
    e.preventDefault();

    if (pictures.length > 0) {
      try {
        console.log(">>> Images: ", images_to_upload);
        const formData = new FormData();
        const metadata = JSON.stringify({
          name: "solpad",
        });
        formData.append("pinataMetadata", metadata);
        images_to_upload.map((dir_item) => {
          formData.append(
            "file",
            dir_item,
            "solpad" + "/images/" + dir_item.name
          );
        });

        const options = JSON.stringify({
          cidVersion: 0,
        });
        formData.append("pinataOptions", options);
        console.log("formData", formData);

        const resFile = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxBodyLength: Infinity,
            headers: {
              pinata_api_key: `${REACT_APP_PINATA_API_KEY}`,
              pinata_secret_api_key: `${REACT_APP_PINATA_API_SECRET}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const ImgHash = resFile.data.IpfsHash;
        console.log(">>>>>>>> resFile", resFile);
        sendMetaToIPFS(ImgHash, images_to_upload.length);
      } catch (error) {
        console.log(">>> File to IPFS: ", error);
      }
      setConfirmClicked(1);
    }
  };

  const updateSecondRoyalty = (
    event: ChangeEvent<HTMLInputElement>,
    indexToUpdate: number,
    mod: number
  ) => {
    const newData = [...second_royalty];
    if (mod == 0) {
      newData[indexToUpdate].share = parseInt(event.target.value);
    } else if (mod == 1) {
      newData[indexToUpdate].address = event.target.value;
    }
    setSecondRoyalty(newData);
  };

  const [deploySuccess, setDeploySuccess] = useState(false);

  const createNftCollection = async (object) => {
    try {
      const projectId = object.projectId;
      const nftMetaData = object.metadata;
      const name = object.name;
      const items = object.items;
      const wallet = Keypair.fromSecretKey(bs58.decode(secret));
      const data = {
        uploadedCnt: object.uploadedCnt,
        royalty: object.royalty,
        symbol: object.symbol,
        creators: object.creators,
        baseArtName: object.baseArtName,
        launchDate: object.launchDate,
        mintCost: object.mintCost,
        feeWallet: object.feeWallet,
      };
      console.log(">>> creating collectionNFT -> data ...", data);
      const collectionNftMint = await createCollectionNft(
        name,
        nftMetaData,
        wallet
      );
      if (collectionNftMint.length > 0) {
        console.log("creating candymachine ...", collectionNftMint);
        const candyMachineId = await generateCandyMachine(
          wallet,
          collectionNftMint,
          data
        );
        if (candyMachineId.length == 0) {
          console.log("error while create candymachine");
          return false;
        }

        

        console.log("addint items ...", candyMachineId, items);
        const addItemsSuccess = await addItems(wallet, candyMachineId, items);
        if (addItemsSuccess === false) {
          console.log("addItems failed");
          return false;
        }

        console.log(
          "setting project data ...",
          projectId,
          candyMachineId,
          collectionNftMint,
          name,
          nftMetaData
        );
        const success = await SetProjectData(
          wallet2,
          new PublicKey(projectId),
          new PublicKey(candyMachineId),
          new PublicKey(collectionNftMint),
          name,
          nftMetaData
        );
        if (success) {
          return true;
        } else {
          console.log("SettingProjectData failed");
          return false;
        }
      } else {
        console.log("createCollectionNft failed");
        return false;
      }
    } catch (err) {
      console.log("err", err);
      return false;
    }
  };

  const handleDeploy = async () => {
    toast("Your NFT Collection is deploying now."); // play notification
    console.log(">>> uploadedRes: ", uploadedRes);
    const hash = uploadedRes;
    const project_id = await CreateProject(wallet2, switch1);
    console.log(">>> project created : ", project_id, project_id.length);

    if (project_id.length > 0) {
      if (switch1) {
        console.log(">>> cNFT creation >>>");
        const _items = [];
        for (let i = 0; i < images_to_upload.length; i++) {
          _items.push({
            uri:
              "https://gateway.pinata.cloud/ipfs/" +
              hash +
              "/metadata/" +
              i.toString() +
              ".json",
            name: collection_name + "#" + (i + 1).toString(),
          });
        }
        const data = {
          metadata:
            "https://gateway.pinata.cloud/ipfs/" + hash + "/metadata/0.json",
          items: _items,
          projectId: project_id,
          name: collection_name,
          symbol: "TEST",
        };

        createNftCollection(data);
        // await fetch("/api/createCnftCollection", {
        //   method: "POST",
        //   body: JSON.stringify(data),
        // }).then((res) => {
        //   console.log("Great Done!!! ", res);
        // });
      } else {
        console.log(">>> NFTcollection creation >>>");
        const _items = [];
        for (let i = 0; i < images_to_upload.length; i++) {
          _items.push({
            uri:
              "https://gateway.pinata.cloud/ipfs/" +
              hash +
              "/metadata/" +
              i.toString() +
              ".json",
            name: collection_name + "#" + (i + 1).toString(),
          });
        }
        const data = {
          metadata:
            "https://gateway.pinata.cloud/ipfs/" + hash + "/metadata/0.json",
          items: _items,
          projectId: project_id,
          name: collection_name,
          uploadedCnt: images_to_upload.length,
          symbol: collection_symbol,
          royalty: nfts_royalties,
          creators: second_royalty,
          baseArtName: nfts_base_art_name,
          launchDate: launch_date + ":00Z",
          mintCost: nfts_mint_cost,
          feeWallet: feeWallet,
        };
        // await fetch("/api/createNftCollection", {
        //     method: "POST",
        //     body: JSON.stringify(data),
        // }).then(res => {
        //     console.log("Great Done!!! ", res);
        //     setActiveTab(3);
        // });
        // const res = await axios({
        //   method: "POST",
        //   url: "/api/createNftCollection",
        //   data: data,
        // });
        const res = await createNftCollection(data);
        console.log("Great done!!!", res);
        tabsRef.current?.setActiveTab(3);
      }

      toast("Deploying has been completed!"); // delete notificatoin
    } else {
      toast.error("Failed to create!");
    }
    // delete notificatoin
  };

  useEffect(() => {
    if (wallet2.publicKey) {
      console.log(wallet2.publicKey.toBase58());
      getUserSOLBalance(wallet2.publicKey, connection);
    }
    setSecondRoyalty([{ share: 100, address: wallet2.publicKey?.toString() }]);
    GetLaunchpad(wallet2).then((value) => {
      setFeeWallet(value.feeWallet.toBase58());
      console.log(">>> Fee Wallet : ", feeWallet);
    });
  }, [wallet2.publicKey, connection, getUserSOLBalance]);

  const tabsRef = useRef<TabsRef>(null);

  const on_clicked_cntf_toggle = () => {
    if (!switch1) {
      setSwitch1(true);
      setSwitch5(true);
    } else {
      setSwitch1(false);
      setSwitch5(false);
    }
  };

  return (
    <div
      className="flex px-20 py-16 w-1/2 items-center justify-center m-auto my-10 flex-col text-lg text-white"
      style={{
        backgroundColor: "rgba(100,100,100,0.3)",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.4)",
      }}
    >
      <h1
        className="mb-6 text-center"
        style={{ fontSize: "40px", fontWeight: "bold" }}
      >
        Launch Collection
      </h1>

      <Tabs aria-label="Pills" style="pills" ref={tabsRef} className="w-full">
        {/* -------------------------- Details tab ------------------------------- */}
        <Tabs.Item active title="Details" disabled>
          <div className="flex flex-col gap-3 w-full">
            <span
              className="py-5 text-center w-full"
              style={{ fontSize: "35px", color: "white" }}
            >
              Collection Details
            </span>
            <div className="flex flex-col w-full gap-2">
              <span style={{ fontSize: "30px" }}>Collection</span>
              <div className="flex flex-row gap-5">
                <div className="px-1 w-1/3">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="collection_name"
                      value="Collection Name"
                      style={{ color: "white" }}
                    />
                  </div>
                  <TextInput
                    id="collection_name"
                    type="email"
                    placeholder="My NFTs"
                    required
                    color="gray"
                    value={collection_name}
                    onChange={(event) =>
                      setCollectionName((event.target as any).value)
                    }
                  />
                </div>
                <div className="px-1 w-1/3">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="symbol"
                      value="Symbol"
                      style={{ color: "white" }}
                    />
                  </div>
                  <TextInput
                    id="symbol"
                    type="email"
                    placeholder="MNFT"
                    required
                    color="gray"
                    value={collection_symbol}
                    onChange={(event) =>
                      setCollectionSymbol((event.target as any).value)
                    }
                  />
                </div>
                <div className="px-1 w-1/3">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="collection_description"
                      value="Collection Description"
                      style={{ color: "white" }}
                    />
                  </div>
                  <TextInput
                    id="collection_description"
                    type="email"
                    placeholder="My collection description"
                    required
                    color="gray"
                    value={collection_description}
                    onChange={(event) =>
                      setCollectionDescription((event.target as any).value)
                    }
                  />
                </div>
              </div>
              <div className="px-1 py-2">
                <div className="mb-2">
                  <Label
                    htmlFor="launch_date"
                    value="Launch Date"
                    style={{ color: "white" }}
                  ></Label>
                </div>
                {/* <datetimep id='launch_date' value={launch_date} onChange={(event) => setLaunchDate((event.target as any).value)} /> */}
                {/* <DateTimePicker></DateTimePicker> */}
                <input
                  type="datetime-local"
                  value={launch_date}
                  onChange={(event) =>
                    setLaunchDate((event.target as any).value)
                  }
                  style={{ color: "black" }}
                ></input>
              </div>

              <div className="flex flex-col w-full items-start gap-2 pl-5 text-left">
                <ToggleSwitch
                  className="mr-auto"
                  checked={switch1}
                  color="blue"
                  label="Compressed NFTs"
                  onChange={on_clicked_cntf_toggle}
                />
                {!switch1 && (
                  <ToggleSwitch
                    className="mr-auto"
                    checked={switch2}
                    color="blue"
                    label="Immutable"
                    onChange={setSwitch2}
                  />
                )}
                {!switch1 && (
                  <ToggleSwitch
                    className="mr-auto"
                    checked={switch3 && !switch1}
                    color="blue"
                    label="Reveal Later"
                    onChange={setSwitch3}
                  />
                )}
                {!switch1 && (
                  <ToggleSwitch
                    className="mr-auto"
                    checked={switch4 && !switch1}
                    color="blue"
                    label="Freeze Collection"
                    onChange={setSwitch4}
                  />
                )}
                {switch4 && (
                  <div className="px-1 py-2">
                    <div className="mb-2">
                      <Label
                        htmlFor="unfreeze_date"
                        value="Unfreeze Date"
                      ></Label>
                    </div>
                    <Datepicker id="unfreeze_date" />
                  </div>
                )}

                <ToggleSwitch
                  className="mr-auto"
                  checked={switch5}
                  color="blue"
                  label="Enforce Royalties"
                  onChange={setSwitch5}
                />
              </div>
            </div>
            <div className="flex flex-col justify-start gap-2">
              <span style={{ fontSize: "30px" }}>NFTs</span>
              <div className="px-1">
                <div className="mb-2 block">
                  <Label
                    htmlFor="base_art_name"
                    value="Base art name"
                    style={{ color: "white" }}
                  />
                </div>
                <TextInput
                  id="base_art_name"
                  type="text"
                  placeholder="NFT #"
                  required
                  color="gray"
                  value={nfts_base_art_name}
                  onChange={() => setBaseArtName((event.target as any).value)}
                />
              </div>
              <div className="px-1">
                <div className="mb-2 block">
                  <Label
                    htmlFor="description"
                    value="Description"
                    style={{ color: "white" }}
                  />
                </div>
                <Textarea
                  id="description"
                  rows={4}
                  required
                  color="gray"
                  value={nfts_description}
                  onChange={() => setDescription((event.target as any).value)}
                />
              </div>
              <div className="flex flex-row justify-start">
                <div className="px-1">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="mint_cost"
                      value="Mint Cost"
                      style={{ color: "white" }}
                    />
                  </div>
                  <TextInput
                    id="mint_cost"
                    rightIcon={TbCurrencySolana}
                    value={nfts_mint_cost}
                    required
                    onChange={(event) =>
                      setMintCost((event.target as any).value)
                    }
                  />
                </div>
                <div className="px-1 pr-5">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="mint_royalties"
                      value="Royalties"
                      style={{ color: "white" }}
                    />
                  </div>
                  <TextInput
                    id="mint_royalties"
                    rightIcon={CgMathPercent}
                    value={nfts_royalties / 100}
                    required
                    onChange={(event) =>
                      setRoyalties((event.target as any).value * 100)
                    }
                  />
                </div>
              </div>
              {/* <TextInput className='px-1 py-4 hidden' id="input_infor" defaultValue="Custom token minting/Whitelists/Sale Phases can be setup later" required /> */}
            </div>
            <div className="flex flex-col py-5 w-full gap-2">
              <span style={{ fontSize: "30px", color: "white" }}>
                Secondary Royalty Split
              </span>
              {second_royalty.map((val, index) => (
                <div className="flex flex-row items-end" key={"second" + index}>
                  <div className="px-1">
                    <div className="mb-2 block">
                      <Label
                        htmlFor="share"
                        value="Share"
                        style={{ color: "white" }}
                      />
                    </div>
                    <TextInput
                      id="share_percent"
                      value={val.share}
                      rightIcon={CgMathPercent}
                      required
                      color="gray"
                      onChange={(event) => updateSecondRoyalty(event, index, 0)}
                    />
                  </div>
                  <div className="px-1 w-full">
                    <div className="mb-2 block">
                      <Label
                        htmlFor="address"
                        value="Address"
                        style={{ color: "white" }}
                      />
                    </div>
                    <TextInput
                      id="address"
                      placeholder="Address"
                      value={val.address}
                      className="w-full"
                      required
                      color="gray"
                      onChange={(event) => updateSecondRoyalty(event, index, 1)}
                    />
                  </div>
                  {index != 0 && (
                    <div className="flex flex-end justify-end flex-end inline-block mb-2">
                      <MdDelete
                        className="mr-2 h-5 w-5"
                        onClick={() =>
                          setSecondRoyalty(
                            second_royalty.filter((_, ind) => index !== ind)
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-row justify-center items-center px-1 py-3">
                <Button
                  outline
                  color="gray"
                  className="w-full"
                  onClick={() =>
                    setSecondRoyalty([
                      ...second_royalty,
                      { share: 0, address: "" },
                    ])
                  }
                >
                  Add split
                </Button>
              </div>
            </div>

            {/* <div className='flex flex-col hidden'>
                            <span style={{ fontSize: "20px" }}>
                                Show Advanced
                            </span>
                            <ToggleSwitch checked={switchShowMode} color="blue" label="Compressed NFTs" onChange={setSwitchShowMode} />
                            {
                                switchShowMode &&
                                <div className='pt-5'>
                                    <span style={{ fontSize: "15px" }}>
                                        Image Storage
                                    </span>
                                    <fieldset className="flex max-w-md flex-row gap-4">
                                        <div className="flex items-center gap-2">
                                            <Radio id="s3" name="s3" value="s3" defaultChecked />
                                            <Label htmlFor="s3">S3</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Radio id="IPFS" name="ipfs" value="IPFS" />
                                            <Label htmlFor="ipfs">IPFS</Label>
                                        </div>
                                    </fieldset>
                                </div>

                            }
                        </div> */}

            <div className="flex items-end justify-end mt-6 items-center">
              <Button
                outline
                gradientDuoTone="purpleToBlue"
                pill
                onClick={() => {
                  if (
                    collection_name.length == 0 ||
                    collection_symbol.length == 0 ||
                    collection_description.length == 0
                  ) {
                    toast("Please fill all the fileds");
                    return;
                  }
                  tabsRef.current?.setActiveTab(1);
                }}
                style={{ textAlign: "center" }}
              >
                Next &rarr;
              </Button>
            </div>
          </div>
        </Tabs.Item>

        {/* -------------------------- Upload tab ------------------------------- */}
        <Tabs.Item title="Upload" disabled>
          <div className="flex flex-col items-center justify-center mt-10 gap-3 w-full">
            <div className="flex items-center justify-center mb-4 w-full">
              <Button
                outline
                gradientDuoTone="purpleToBlue"
                pill
                onClick={() => tabsRef.current?.setActiveTab(0)}
              >
                &larr;&nbsp;Back
              </Button>
            </div>
            <h3>Drop your NFT assets below to launch!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Meta data is optional. To include it provide JSON files with
              matching file names.
            </p>
            <div className="flex w-full items-center justify-center">
              {/* <DropTarget onDrop={loadDirectory}> */}
              <Label
                htmlFor="dropzone-file"
                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                style={{ color: "white" }}
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg
                    className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      {"Click to here or Drag n drop NFT assets folder here"}
                    </span>
                  </p>
                </div>
                {
                  // eslint-disable-next-line
                  <FileInput
                    className=""
                    // webkitdirectory="true"
                    id="dropzone-file"
                    itemType="file"
                    onChange={(event) => handleFileInputChange(event)}
                  />
                }
              </Label>
              {/* </DropTarget> */}
            </div>
            <p className="text-xm text-gray-500 dark:text-gray-400">
              Download example input folder
            </p>

            <div className="previewProfilePic w-full mb-5">
              <div className="flex items-center justify-center mt-6 gap-4">
                <Button
                  outline
                  gradientDuoTone="purpleToBlue"
                  pill
                  onClick={() => tabsRef.current?.setActiveTab(0)}
                >
                  &larr;&nbsp;Back
                </Button>
                <Button
                  outline
                  gradientDuoTone="purpleToBlue"
                  pill
                  onClick={(e: { preventDefault: () => void }) =>
                    sendFileToIPFS(e)
                  }
                >
                  Push up
                </Button>

                {confirmClicked ? (
                  <Button
                    outline
                    gradientDuoTone="purpleToBlue"
                    pill
                    onClick={() => tabsRef.current?.setActiveTab(2)}
                  >
                    Next&nbsp;&rarr;
                  </Button>
                ) : (
                  <Button
                    outline
                    gradientDuoTone="purpleToBlue"
                    pill
                    disabled
                    onClick={() => tabsRef.current?.setActiveTab(2)}
                  >
                    Next&nbsp;&rarr;
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {pictures.map((pic, ind) => (
                  <div key={"pic_line_" + ind}>
                    {/* {pic_in_line.val.map((pic, index) => ( */}
                    <div
                      className="p-4 flex flex-col flex-start"
                      // key={"pic_line_pic_" + ind}
                    >
                      <img
                        className="playerProfilePic_home_tile w-full pt-10"
                        src={pic.img_name}
                      ></img>
                      <label style={{ color: "white" }}>{pic.nft_name}</label>
                      <label style={{ color: "white" }}>{pic.nft_desc}</label>
                      <div className="flex flex-row flex-start justify-around gap-1">
                        <Button
                          onClick={() => {
                            setSelectedPic(pic);
                            setOpenModal(true);
                          }}
                        >
                          +
                        </Button>
                        {/* <Button>Edit</Button> */}
                        <Button>Del</Button>
                      </div>
                    </div>
                    {/* ))} */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Item>

        {/* -------------------------- Deploy tab ------------------------------- */}
        <Tabs.Item title="Deploy" disabled>
          <div className="flex flex-col items-center justify-start mt-10 w-full h-full">
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => handleDeploy()}
              style={{ width: "200px" }}
            >
              Deply!
            </Button>
          </div>
        </Tabs.Item>

        {/* -------------------------- Success tab ------------------------------- */}
        <Tabs.Item title="Success!" disabled>
          <div className="flex flex-col items-center justify-start mt-10 gap-3 w-full h-full">
            {deploySuccess && (
              <p className="text-3xl text-gray-500 dark:text-gray-800">
                You have deploied NFT successfully!
              </p>
            )}
          </div>
        </Tabs.Item>
      </Tabs>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Duplicate NFT</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <img
              className="w-1/2 pt-10 m-auto"
              src={selectedPic?.img_name}
            ></img>
            <div>
              <div className="m-auto flex justify-center text-black">
                {selectedPic?.nft_name}
              </div>
              <div className="m-auto flex justify-center text-black">
                {selectedPic?.nft_desc}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col justify-items-center items-center">
                <div>
                  <label className="text-black">Add counter to names</label>
                </div>
                <Checkbox className="" id="disabled" />
              </div>
              <div className="ml-4">
                <TextInput
                  type="number"
                  onChange={(e) => {
                    setDuplicatedCnt(Number(e.target.value));
                  }}
                ></TextInput>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="m-auto"
            onClick={() => {
              for (let i = 0; i < duplicatedCnt; i++) {
                pictures.push({
                  ...selectedPic,
                  index: pictures.length,
                  nft_name: addCounter
                    ? collection_name + " # " + (selectedPic.index + i + 1)
                    : selectedPic.name,
                });

                images_to_upload.push(images_to_upload[selectedPic.index]);
                if (metadatas_to_upload.length > 0) {
                  metadatas_to_upload.push(
                    metadatas_to_upload[selectedPic.index]
                  );
                }
              }
              setImagesToUpload(images_to_upload);
              if (metadatas_to_upload.length > 0) {
                setMetadatasToUpload(metadatas_to_upload);
              }
              setOpenModal(false);
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
