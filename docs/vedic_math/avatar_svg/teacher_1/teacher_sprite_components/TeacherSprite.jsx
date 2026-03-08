export function TeacherSprite({ id, width = 160, height, className = '' }) {
  return (
    <svg width={width} height={height} className={className} aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}
