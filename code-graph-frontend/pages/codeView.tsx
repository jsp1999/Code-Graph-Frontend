import Link from "next/link";
import data from "../src/data.json";

export default function CodeView() {
//    const map = new Map(Object.entries(JSON.parse(data)));

    const jsonString = JSON.stringify(data, null, 2);
    const jsonData = JSON.parse(jsonString);

    // Map over the JSON object and access "daten" property
    const datenList = Object.keys(jsonData)
        .slice(0, 20) // Slice the first ten elements
        .map(key => jsonData[key].daten);

    return (
        <div>
            <header className="w-screen h-16 bg-blue-900 p-3 mb-5">
                <h1 className="font-bold text-3xl">Code View</h1>
            </header>
            <table className="table-auto w-[20%] max-h-screen float-left border-2 ml-3">
                <thead className="border-2 bg-gray-100">
                <tr>
                    <th>Code</th>
                </tr>
                </thead>
                <tbody>
                {datenList.map((daten, index) => (
                    <tr className="border" key={index}>{daten}</tr>
                ))}
                </tbody>
            </table>
            <table className="table-auto w-[20%] max-h-screen float-right border-2 mr-3">
                <thead className="border-2 bg-gray-100">
                <tr>
                    <th>Category</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                </tr>
                <tr>
                    <td>Witchy Woman</td>
                </tr>
                <tr>
                    <td>Shining Star</td>
                </tr>
                <tr>
                    <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                </tr>

                </tbody>
            </table>
            <Link className="absolute right-5 bottom-5 button" href="/clusterView">Change View</Link>
        </div>
    )
}