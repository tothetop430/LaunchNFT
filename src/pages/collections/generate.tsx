import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../../views";
import { GenerateCollectionView } from '../../views/Collection/GenerateCollectionView';

const Home: NextPage = (props) => {
  return (
    <GenerateCollectionView />
  );
};

export default Home;
