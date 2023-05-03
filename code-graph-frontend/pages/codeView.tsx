import Link from "next/link";

export default function CodeView() {
    return (
        <div>
            <h1>Codes are displayed here</h1>
            <Link className="absolute right-5 bottom-5 button" href="/clusterView">Change View</Link>
        </div>
    )
}