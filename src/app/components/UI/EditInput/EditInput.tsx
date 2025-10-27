// import Image from "next/image";  

export default function TitleInput({ title }: { title: string }) {
  return (
    <div className="flex relative w-full max-w-md">
      <input
        type="text"
        value={title}
        readOnly
        className="w-full p-3 pr-12 text-2xl font-semibold rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      {/* <Image
        src="/icons/black/edit-2.svg"
        alt="Edit"
        width={24}
        height={24}
        className="ml-3 opacity-50"
      /> */}
    </div>
  );
}