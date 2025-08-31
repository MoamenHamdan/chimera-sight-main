import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Device } from '@/lib/deviceTypes';
import { DeviceNode } from './DeviceNode';

interface NetworkVisualizationProps {
  devices: Device[];
  onDeviceSelect: (device: Device | null) => void;
  selectedDevice: Device | null;
  searchTerm: string;
  groupFilter: string | null;
}

interface SimulationNode extends d3.SimulationNodeDatum, Device {
  group_id: number;
}

export function NetworkVisualization({ 
  devices, 
  onDeviceSelect, 
  selectedDevice, 
  searchTerm,
  groupFilter 
}: NetworkVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState<SimulationNode[]>([]);
  const simulationRef = useRef<d3.Simulation<SimulationNode, undefined> | null>(null);

  // Filter devices based on search and group filter
  const filteredDevices = devices.filter(device => {
    const matchesSearch = !searchTerm || 
      device.given_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm) ||
      device.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = !groupFilter || device.group.name === groupFilter;
    
    return matchesSearch && matchesGroup;
  });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: container.clientHeight
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize and update simulation
  useEffect(() => {
    if (!svgRef.current || filteredDevices.length === 0) return;

    // Create simulation nodes with group information
    const simulationNodes: SimulationNode[] = filteredDevices.map(device => ({
      ...device,
      group_id: device.group.id,
      x: dimensions.width / 2 + (Math.random() - 0.5) * 100,
      y: dimensions.height / 2 + (Math.random() - 0.5) * 100
    }));

    // Create force simulation
    const simulation = d3.forceSimulation<SimulationNode>(simulationNodes)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(30))
      .force('group', d3.forceX().x(d => {
        // Group devices by their group ID
        const node = d as SimulationNode;
        const groupX = (node.group_id - 1) * (dimensions.width / 4) + dimensions.width / 4;
        return groupX;
      }).strength(0.1));

    simulation.on('tick', () => {
      setNodes([...simulationNodes]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [filteredDevices, dimensions]);

  // Group colors for background
  const groupPositions = [
    { id: 1, name: 'Default', x: dimensions.width / 4, color: 'hsl(var(--muted))' },
    { id: 2, name: 'Staff', x: dimensions.width / 2, color: 'hsl(var(--device-computer))' },
    { id: 3, name: 'Guests', x: (3 * dimensions.width) / 4, color: 'hsl(var(--device-mobile))' },
    { id: 4, name: 'IoT', x: dimensions.width, color: 'hsl(var(--device-iot))' }
  ];

  return (
    <div className="w-full h-full relative">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-gradient-to-br from-background to-secondary/20 rounded-lg border border-border"
      >
        {/* Group background areas */}
        {groupPositions.map(group => (
          <g key={group.id}>
            <circle
              cx={group.x}
              cy={dimensions.height / 2}
              r={120}
              fill={group.color}
              opacity={0.1}
              stroke={group.color}
              strokeWidth={1}
              strokeOpacity={0.3}
            />
            <text
              x={group.x}
              y={dimensions.height / 2 - 140}
              textAnchor="middle"
              className="fill-muted-foreground text-sm font-medium"
            >
              {group.name}
            </text>
          </g>
        ))}

        {/* Device nodes */}
        {nodes.map(device => (
          <DeviceNode
            key={device.id}
            device={device}
            x={device.x || 0}
            y={device.y || 0}
            isSelected={selectedDevice?.id === device.id}
            onSelect={onDeviceSelect}
            scale={1}
          />
        ))}

        {/* Legend */}
        <g transform={`translate(20, ${dimensions.height - 120})`}>
          <rect width={200} height={100} fill="hsl(var(--card))" stroke="hsl(var(--border))" rx={8} opacity={0.9} />
          <text x={10} y={20} className="fill-foreground text-sm font-semibold">Device Status</text>
          
          <circle cx={20} cy={35} r={6} fill="hsl(var(--device-active))" />
          <text x={35} y={40} className="fill-foreground text-xs">Active</text>
          
          <circle cx={20} cy={50} r={6} fill="hsl(var(--device-inactive))" />
          <text x={35} y={55} className="fill-foreground text-xs">Inactive</text>
          
          <circle cx={20} cy={65} r={4} fill="hsl(var(--device-blocked))" />
          <text x={35} y={70} className="fill-foreground text-xs">Restricted</text>
          
          <rect x={15} y={78} width={8} height={8} fill="hsl(var(--warning))" rx={1} />
          <text x={35} y={85} className="fill-foreground text-xs">Custom Rules</text>
        </g>
      </svg>
    </div>
  );
}