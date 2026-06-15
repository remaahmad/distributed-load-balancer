import { useState, useCallback } from 'react';
import type { LBAlgo, NodeMetrics } from '../types';

export function useGatewayLoadBalancer(initialServers: NodeMetrics[]) {
  const [servers] = useState<NodeMetrics[]>(initialServers);
  const [activeStrategy, setActiveStrategy] =
    useState<LBAlgo>('least-connections');

  const routeRequest = useCallback(
    async (payloadKey = 'default_user') => {
      const healthy = servers.filter((s) => s.status === 'online');

      if (healthy.length === 0) {
        throw new Error('No available servers');
      }

      let target: NodeMetrics = healthy[0];

      switch (activeStrategy) {
        case 'round-robin': {
          const idx = Math.floor(Math.random() * healthy.length);
          target = healthy[idx];
          break;
        }

        case 'least-connections': {
          target = [...healthy].sort(
            (a, b) => a.connections - b.connections
          )[0];
          break;
        }

        case 'latency-based': {
          target = [...healthy].sort(
            (a, b) => a.cpu - b.cpu
          )[0];
          break;
        }

        case 'consistent-hashing': {
          let hash = 0;

          for (let i = 0; i < payloadKey.length; i++) {
            hash =
              (hash << 5) -
              hash +
              payloadKey.charCodeAt(i);
          }

          target =
            healthy[Math.abs(hash) % healthy.length];

          break;
        }

        default:
          target = healthy[0];
      }

      return target;
    },
    [servers, activeStrategy]
  );

  return {
    servers,
    activeStrategy,
    setActiveStrategy,
    routeRequest,
  };
}