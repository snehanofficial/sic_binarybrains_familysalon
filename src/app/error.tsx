"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        fontFamily: "Inter, sans-serif",
        background: "#F7F5F2",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#FAF0EC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        ⚠️
      </div>
      <h2
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#2B2B2B",
          margin: 0,
        }}
      >
        Something went wrong
      </h2>
      <p style={{ color: "#6B7280", fontSize: "0.875rem", margin: 0 }}>
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          background: "#C97C5D",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "12px 28px",
          fontWeight: 600,
          fontSize: "0.875rem",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
