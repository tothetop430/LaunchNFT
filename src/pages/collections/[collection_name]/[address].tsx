import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import Home from '../../collection_detail';
import ItemProps from "interfaces/ItemProps";
import { Badge, Button } from "flowbite-react";
import { AiOutlineTwitter, AiOutlineHeart, AiFillUnlock } from "react-icons/ai";

const CollectionDetail: NextPage = (props) => {
  const router = useRouter();
  const { collectionName, address } = router.query;
  const image_url = './NFT.svg';
  const description = 'Created at 05.13.2024';
  // const itemProps = {
  //   name : {collectionName},
  //   collections : {address},
  //   image_url : './NFT.svg',
  //   description : 'Created at 05.13.2024'
  // }

  return (
    <div>
      <div className="flex flex-row">
        <div className="w-full flex flex-row flex-start">
          <div className="flex flex-row w-full">
            <img src={image_url} alt="" className="w-40 h-40" />
            <div className="flex flex-col m-x-3 pl-5">
              <div className="flex flex-col">
                <p style={{ fontSize: '48px' }}>{collectionName}</p>
                <caption>CREATED Tue 06 Feb by <a href={'../../profile/' + address}>{address}</a> on </caption><span><img src="../../public/solana.avatar.svg" alt="" /></span>
                <Badge color="red" icon={AiFillUnlock} className="w-7" />
                <caption>{description}</caption>
              </div>
              <div className="flex flex-row">
                <div className="items-center justify-center flex flex-row px-3">
                  <AiOutlineHeart /> 0
                </div>
                <div className="items-center justify-center flex flex-row px-3">
                  <AiOutlineTwitter />Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CollectionDetail;
