import type { NextPage } from "next";
import Head from "next/head";
import { AdminView } from '../views/AdminView';

const AdminPage: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>SolPad</title>
                <meta
                    name="description"
                    content="SolPad"
                />
            </Head>
            <div className="flex flex-row mt-6 text-white">
                <AdminView createAdminPanel={function (): void {
                    throw new Error("Function not implemented.");
                } } />
            </div>
        </div>
    );
};

export default AdminPage;