// Predefined vibrant color palette with good contrast
export const EXERCISE_COLORS = [
  // Reds
  '#FF3B30', '#FF6B6B', '#FF8787',
  // Oranges
  '#FF9500', '#FFA94D', '#FFB366',
  // Yellows
  '#FFCC00', '#FFD43B', '#FFE066',
  // Greens
  '#34C759', '#51CF66', '#69DB7C',
  // Teals
  '#5AC8FA', '#66D9E8', '#72E5F2',
  // Blues
  '#007AFF', '#339AF0', '#4DABF7',
  // Indigos
  '#5856D6', '#7048E8', '#845EF7',
  // Purples
  '#AF52DE', '#CC5DE8', '#DA77F2',
  // Pinks
  '#FF2D55', '#F783AC', '#FDA7DF',
  // Browns
  '#A2845E', '#BA8761', '#D19C66',
  // Unique hues
  '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#D4A5A5', '#9B6B9D',
  '#E84A5F', '#FF847C', '#FECEA8',
  '#2A363B', '#99B898', '#FECEAB',
  '#FF847C', '#E84A5F', '#2A363B',
  '#A8E6CE', '#DCEDC2', '#FFD3B5',
  '#FFAAA6', '#FF8C94', '#A8A7A7',
  '#CC527A', '#E8175D', '#474747'
];

export function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const index = Math.abs(hash) % EXERCISE_COLORS.length;
  return EXERCISE_COLORS[index];
}

export function getContrastColor(color: string): string {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}