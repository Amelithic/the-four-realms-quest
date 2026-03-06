export default function TorchGlow() {
  return (
    <>
      <div className="fixed top-0 left-0 w-64 h-96 pointer-events-none z-0 animate-torch"
        style={{
          background: "radial-gradient(ellipse at top left, hsl(var(--ember) / 0.08) 0%, transparent 70%)",
        }}
      />
      <div className="fixed top-0 right-0 w-64 h-96 pointer-events-none z-0 animate-torch"
        style={{
          background: "radial-gradient(ellipse at top right, hsl(var(--ember) / 0.06) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
    </>
  );
}
