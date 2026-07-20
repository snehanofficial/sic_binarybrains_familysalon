export default function NotFound() {
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
          fontSize: "6rem",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          color: "#5F8D6D",
          lineHeight: 1,
        }}
      >
        404
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
        Page Not Found
      </h2>
      <p style={{ color: "#6B7280", fontSize: "0.875rem", margin: 0 }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <a
        href="/"
        style={{
          background: "#C97C5D",
          color: "#fff",
          borderRadius: 12,
          padding: "12px 28px",
          fontWeight: 600,
          fontSize: "0.875rem",
          textDecoration: "none",
        }}
      >
        Back to Home
      </a>
    </div>
  );
}
