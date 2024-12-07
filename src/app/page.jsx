import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4 p-6">
      <h3 className="text-2xl font-semibold"> Hi i am </h3>
      <h1 className="text-4xl font-bold text-indigo-400">Vandit Kala</h1>
      <p className="text-lg text-center">I was asked to build 2 assignment ,<br /> Making a simple simon game and other and other was Creating the folder structure</p>
      <p>So here are there links</p>
      <div className="flex gap-4">
        <Link href="/simongame" className="bg-blue-500 text-white px-4 py-2 rounded">Simon Game</Link>
        <Link href="/flodertree" className="bg-blue-500 text-white px-4 py-2 rounded">Folder Tree</Link>
      </div>
    </div>
  );
}
