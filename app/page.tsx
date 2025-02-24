import Image from "next/image";
import GradientText from '../components/ui/GradientText'
import Orb from '../components/ui/Orb';


export default function Home() {
  return (
  

    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Orb
        hoverIntensity={0.5}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />
    </div>
  );
}
