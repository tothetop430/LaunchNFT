import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../../views";
import { NewCollectionView } from '../../views/Collection/NewCollectionView';

const Home: NextPage = (props) => {
  return (
    <NewCollectionView />
  );
};

export default Home;
