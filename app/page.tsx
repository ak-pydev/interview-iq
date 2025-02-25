import Image from "next/image";
import GradientText from '../components/ui/GradientText'
import Navbar from "@/components/Navbar";
import Head from "@/components/Head";


export default function Home() {
  return (

    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Navbar></Navbar>
      <Head></Head>
    </div>
  );
}
