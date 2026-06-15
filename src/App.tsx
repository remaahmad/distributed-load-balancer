import { useState } from 'react';
import { useGatewayLoadBalancer } from './hooks/useGatewayLoadBalancer';
import type { NodeMetrics } from './types';

function App() {
  const initialServers: NodeMetrics[] = [
    {
      id: 'Server A',
      cpu: 30,
      connections: 5,
      status: 'online',
    },
    {
      id: 'Server B',
      cpu: 20,
      connections: 2,
      status: 'online',
    },
    {
      id: 'Server C',
      cpu: 50,
      connections: 8,
      status: 'online',
    },
  ];

  const { routeRequest, servers } =
    useGatewayLoadBalancer(initialServers);

  const [selectedServer, setSelectedServer] = useState('');

  const handleRequest = async () => {
    const server = await routeRequest();
    setSelectedServer(server.id);
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>Distributed Load Balancer</h1>

      <h2>Servers</h2>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Server</th>
            <th>CPU</th>
            <th>Connections</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {servers.map((server) => (
            <tr key={server.id}>
              <td>{server.id}</td>
              <td>{server.cpu}%</td>
              <td>{server.connections}</td>
              <td>{server.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button onClick={handleRequest}>
        Send Request
      </button>

      <h2>
        Selected Server: {selectedServer}
      </h2>
    </div>
  );
}

export default App;