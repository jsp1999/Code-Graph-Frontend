import React from "react";
///SCRUBER FOR ZOOMING

interface ScrubberProps {
  scrubberValue: number;
  onScrubberChange: (value: number) => void;
}

export const CollideForceScrubber: React.FC<ScrubberProps> = ({ scrubberValue, onScrubberChange }) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="collid_force">
      <div>Collide force Value: {scrubberValue}</div>
      <input type="range" min="-1" max="2" value={scrubberValue} onChange={handleScrubberChange} />
    </div>
  );
};

export const CenterForceScrubber: React.FC<ScrubberProps> = ({ scrubberValue, onScrubberChange }) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="center_force">
      <div>Center force Value: {scrubberValue}</div>
      <input type="range" min="-5" max="5" value={scrubberValue} onChange={handleScrubberChange} />
    </div>
  );
};

export const AttractionForceScrubber: React.FC<ScrubberProps> = ({ scrubberValue, onScrubberChange }) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="attraction_force">
      <div>Attraction force Value: {scrubberValue}</div>
      <input type="range" min="-5" max="5" value={scrubberValue} onChange={handleScrubberChange} />
    </div>
  );
};

export const LimitScruber: React.FC<ScrubberProps> = ({ scrubberValue, onScrubberChange }) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="limit">
      <div>Node Limit: {scrubberValue}</div>
      <input type="range" min="0" max="10000" value={scrubberValue} onChange={handleScrubberChange} />
    </div>
  );
};

export const RadiusScruber: React.FC<ScrubberProps> = ({ scrubberValue, onScrubberChange }) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="limit">
      <div>Radius: {scrubberValue}</div>
      <input type="range" min="2" max="10" value={scrubberValue} onChange={handleScrubberChange} />
    </div>
  );
};
