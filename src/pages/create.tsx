import type { NextPage } from "next";
import Head from "next/head";
import { CreateView } from '../views/CreateView';

const CreateCollectionPage: NextPage = (props) => {
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

export default CreateCollectionPage;
