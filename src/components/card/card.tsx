import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import NFT from "./images/NFT.svg"

import Image from "next/image"

const Card = ({
        title, displayMode, image, floor_price
    }:{
        title?: string, displayMode: string, image?: string, floor_price?: string
    }) => {

    let cardContainerClass

    if (displayMode === 'dark') {
        cardContainerClass = "card--container"
    } else {
        cardContainerClass = "card--container-lm"
    }
    
    return (
        <div className="flex flex-col w-30">
            <div className="w-full">
                <Image width={200} height={150} src={'./NFT.svg'} alt="nft"></Image>
            </div>
            <div id = "title">{title}</div>
            <div className="vals">TTT</div>
        </div>
        // <div className={cardContainerClass}>
        //     <div className="
        //         self-center
        //         rounded-lg
        //         h-150px
        //         w-150px
        //     ">
        //         <Image width={125} height={125} src={(image) ? image : NFT} alt="nft"/>
        //     </div>
        //     <div id="title">{title}</div>
        //     <div className="vals">TTT</div>
        // </div>
    )
}

export default Card;