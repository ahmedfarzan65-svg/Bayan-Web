import React from 'react';
import MoodCard from './MoodCard';

export default function MoodGrid({ matrix, selectedId, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {matrix.map((item) => (
        <MoodCard
          key={item.id}
          item={item}
          isActive={selectedId === item.id}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}