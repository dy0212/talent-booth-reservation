import Link from "next/link";

export default function BoothCard({ booth }) {
  return (
    <div className="booth-card">
      <h2>{booth.name}</h2>

      <p>{booth.description}</p>

      <p>
        <strong>장소:</strong> {booth.location}
      </p>

      <Link href={`/booth/${booth.id}`}>
        상세 보기
      </Link>
    </div>
  );
}