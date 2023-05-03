import Link from "next/link";

export default function ClusterView() {
    return (   
    <div>
        <h1>Clusters are displayed here</h1>
        <Link className="absolute right-5 bottom-5 button" href="/codeView">Change View</Link>
    </div>
    )
}