

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />
    </div>
  );
};

export default ScrollProgress;
