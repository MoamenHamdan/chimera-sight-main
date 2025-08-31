import React from 'react';
import { Device } from '@/lib/deviceTypes';
import { cn } from '@/lib/utils';

interface DeviceNodeProps {
  device: Device;
  x: number;
  y: number;
  isSelected: boolean;
  onSelect: (device: Device) => void;
  scale?: number;
}

export function DeviceNode({ device, x, y, isSelected, onSelect, scale = 1 }: DeviceNodeProps) {
  const getDeviceColor = () => {
    if (!device.is_active) return 'hsl(var(--device-inactive))';
    
    switch (device.ai_classification.device_category) {
      case 'computer':
        return 'hsl(var(--device-computer))';
      case 'mobile':
        return 'hsl(var(--device-mobile))';
      case 'entertainment':
      case 'iot':
        return 'hsl(var(--device-iot))';
      case 'office':
        return 'hsl(var(--device-network))';
      default:
        return 'hsl(var(--primary))';
    }
  };

  const getDeviceSize = () => {
    const baseSize = 12;
    const confidenceMultiplier = device.ai_classification.confidence * 0.5 + 0.5;
    return baseSize * confidenceMultiplier * scale;
  };

  const hasRestrictions = () => {
    return Object.values(device.blocklist).some(blocked => blocked && blocked !== device.blocklist.safesearch);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer transition-all duration-300"
      onClick={() => onSelect(device)}
    >
      {/* Glow effect for active devices */}
      {device.is_active && (
        <circle
          r={getDeviceSize() + 6}
          fill="none"
          stroke={getDeviceColor()}
          strokeWidth="1"
          opacity="0.3"
          className={cn(
            "animate-pulse",
            isSelected && "opacity-60"
          )}
        />
      )}
      
      {/* Main device circle */}
      <circle
        r={getDeviceSize()}
        fill={getDeviceColor()}
        stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
        strokeWidth={isSelected ? 3 : 1}
        className={cn(
          "transition-all duration-300",
          "hover:stroke-primary hover:stroke-2",
          isSelected && "drop-shadow-glow"
        )}
        opacity={device.is_active ? 1 : 0.6}
      />

      {/* Restriction indicator */}
      {hasRestrictions() && (
        <circle
          r={getDeviceSize() * 0.3}
          fill="hsl(var(--device-blocked))"
          transform={`translate(${getDeviceSize() * 0.6}, ${-getDeviceSize() * 0.6})`}
        />
      )}

      {/* Custom blocklist indicator */}
      {device.has_custom_blocklist && (
        <rect
          width={getDeviceSize() * 0.4}
          height={getDeviceSize() * 0.4}
          fill="hsl(var(--warning))"
          transform={`translate(${-getDeviceSize() * 0.7}, ${getDeviceSize() * 0.5})`}
          rx="2"
        />
      )}

      {/* Device label */}
      <text
        y={getDeviceSize() + 16}
        textAnchor="middle"
        className="fill-foreground text-xs font-medium"
        style={{ fontSize: `${10 * scale}px` }}
      >
        {device.given_name || device.hostname}
      </text>
      
      <text
        y={getDeviceSize() + 28}
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
        style={{ fontSize: `${8 * scale}px` }}
      >
        {device.ip}
      </text>
    </g>
  );
}