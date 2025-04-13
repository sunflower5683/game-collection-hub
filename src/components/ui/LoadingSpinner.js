export default function LoadingSpinner({ size = 'md', color = 'blue' }) {
  // 尺寸映射
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  // 颜色映射
  const colorMap = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    white: 'text-white',
  };
  
  const spinnerSize = sizeMap[size] || sizeMap.md;
  const spinnerColor = colorMap[color] || colorMap.blue;
  
  return (
    <svg 
      className={`animate-spin ${spinnerSize} ${spinnerColor}`}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
} 