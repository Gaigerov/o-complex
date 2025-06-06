export const SvgPlaceholder = ({ width = 400, height = 300, text = "Product" }) => {
  const bgColor = '#f0f0f0';
  const textColor = '#999999';
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill={bgColor} />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={textColor}
        fontSize="20"
        fontFamily="Arial, sans-serif"
      >
        {text}
      </text>
    </svg>
  );
};
