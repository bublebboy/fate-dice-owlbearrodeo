import OBR from '@owlbear-rodeo/sdk';
import LocalRoller from './LocalRoller';
import OwlbearRoller from './OwlbearRoller';

export default function App() {
    const limit = 12;
    return OBR.isAvailable ? <OwlbearRoller limit={limit} /> : <LocalRoller limit={limit} />;
}