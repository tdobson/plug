import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import {ElevationTable} from "@/components/ElevationTable/ElevationTable";
import {Elevation} from "@/types/elevation";


export default function HomePage() {
    const sampleElevations: Elevation[] = [
        {
            id: '1',
            plotId: 'Plot1',
            jobCode: 'JOB001',
            instanceId: 'instance1'
        },
        {
            id: '2',
            plotId: 'Plot2',
            jobCode: 'JOB002',
            instanceId: 'instance2'
        }
    ];

  return (
    <>
      <Welcome />
      <ColorSchemeToggle />

        <ElevationTable
            elevations={sampleElevations}

        />
    </>
  );
}
