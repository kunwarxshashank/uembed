import { useSearchParams } from "next/navigation";

export default function Loading(props) {
  const searchParams = useSearchParams();
  const color = props.color || searchParams.get("color") || "#f5f5f5";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundImage: `url(${props.poster})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-[96px] h-[96px] z-10">
        {/* Track ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            borderWidth: "8px",
            borderStyle: "solid",
            borderColor: `rgba(245, 245, 245, 0.25)`,
          }}
        ></div>
        {/* Fill ring (animated) */}
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            borderWidth: "9px",
            borderStyle: "solid",
            borderColor: `${props.color || color} transparent transparent transparent`,
            opacity: 0.75,
            transformOrigin: "center",
          }}
        ></div>
      </div>
    </div>
  );
}
