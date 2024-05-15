import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
import { CreateView } from '../views/CreateView';

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>SolPad</title>
        <meta
          name="description"
          content="SolPad"
        />
      </Head>
      <CreateView />
    </div>
  );
};

export default Home;
