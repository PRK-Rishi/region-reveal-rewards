import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categories = [
  { id: 'all', name: 'All', icon: '🎁', color: 'bg-primary/20 text-primary' },
  { id: 'dining', name: 'Dining', icon: '🍽️', color: 'bg-orange-500/20 text-orange-400' },
  { id: 'entertainment', name: 'Fun', icon: '🎭', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'wellness', name: 'Wellness', icon: '🧘', color: 'bg-green-500/20 text-green-400' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-pink-500/20 text-pink-400' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: 'bg-blue-500/20 text-blue-400' },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  offerCounts: Record<string, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  offerCounts
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={`
            flex items-center gap-2 whitespace-nowrap transition-all duration-300
            ${selectedCategory === category.id 
              ? 'bg-gradient-primary text-white shadow-glow scale-105' 
              : 'glass hover:scale-105 hover:shadow-elegant'
            }
          `}
        >
          <span className="text-lg">{category.icon}</span>
          <span className="font-medium">{category.name}</span>
          {offerCounts[category.id] > 0 && (
            <Badge 
              className={`
                ${selectedCategory === category.id 
                  ? 'bg-white/20 text-white' 
                  : category.color
                } 
                text-xs px-2 py-0.5 ml-1
              `}
            >
              {category.id === 'all' ? Object.values(offerCounts).reduce((sum, count) => sum + count, 0) : offerCounts[category.id]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;