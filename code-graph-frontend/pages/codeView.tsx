import Link from "next/link";
import data from "../src/data.json";

export default function CodeView() {

    // its a little spaghetti but it works
    const jsonString = JSON.stringify(data, null, 2);
    const jsonData = JSON.parse(jsonString);

    // Map over the JSON object and access "daten" property
    const datenList = Object.keys(jsonData)
        .slice(0, 25) // Slice the first ten elements
        .map(key => jsonData[key].daten);

    return (
        <div>
            <header className="w-screen h-16 bg-blue-900 p-3 mb-5">
                <h1 className="font-bold text-3xl">Code View</h1>
            </header>
            <div className="w-[20%] max-h-[600px] overflow-auto float-left ml-3">
            <table className="table-auto border-2">
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
            </div>
            <div className="max-h-[400px] w-[20%] float-right mr-3 overflow-auto">
            <table className="table-auto border-2">
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
            </div>
            <Link className="absolute right-5 bottom-5 button" href="/clusterView">Change View</Link>
        </div>
    )
}