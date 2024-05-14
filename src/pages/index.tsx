import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
import { redirect } from 'next/navigation'
import { Router } from 'next/router'

import { useRouter } from 'next/router'

function RedirectPage() {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push('/collections')
  }
}

export default RedirectPage

// const Home: NextPage = (props) => {
//   return (
//     <div>
//       <Head>
//         <title>NFT Minter</title>
//         <meta
//           name="description"
//           content="Solana Scaffold"
//         />
//       </Head>
//       <HomeView />
//     </div>
//   );
// };

// export default Home;
