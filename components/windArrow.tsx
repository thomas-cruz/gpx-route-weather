export function WindArrow({ direction }: { direction: number }) {
  return (
    <div
      style={{
        transform: `rotate(${direction}deg)`,
      }}
    >
      ↑
    </div>
  );
}
