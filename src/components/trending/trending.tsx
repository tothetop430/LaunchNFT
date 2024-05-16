import Card from "../card/card"
import React, { ReactElement } from "react"

type nftData = any[] | null

const Trending = ({ displayMode, data }: { displayMode: string, data?: nftData }) => {
    // console.log(data.length);
    console.log(data);

    let trendingCards: ReactElement | any[] = <>
        <Card displayMode={displayMode} />
        <Card displayMode={displayMode} />
        <Card displayMode={displayMode} />
        <Card displayMode={displayMode} />
        <Card displayMode={displayMode} />
        <Card displayMode={displayMode} />
        <Card displayMode={displayMode} />
        <Card displayMode={displayMode} />
    </>

    if (data) {
        trendingCards =
            data.map((obj) => {
                return <Card
                    displayMode={displayMode}
                    key={obj.id}
                    title={obj.name}
                    image={obj.image}
                    // floor_price={obj.floorPrice}
                    floor_price={obj.seller_fee_basis_points}
                    collectionName={obj.collectionName}
                />
            })
    }

    return (
        <div className="trending">
            {trendingCards}
        </div>
    )
}

export default Trending;