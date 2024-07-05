import Link from "next/link";

const Announcement: React.FC = () => {
  return (
    <div className="flex flex-col items-stretch bg-primary-foreground text-black rounded-lg p-4  ">
      <div className="mb-4 px-10 p-4 bg-primary text-center rounded">
        <Link href="" className="text-black hover:underline ">
          ANNOUNCEMENT!
        </Link>
      </div>
      <div className="px-10 p-4 bg-primary text-center rounded ">
        STATUS
        <div className="mt-4">
          <div className="relative w-[100px] h-[100px] mx-auto">
            <svg className="absolute inset-0 w-[100px] h-[100px]">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="black"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="orange"
                strokeWidth="10"
                strokeDasharray="calc(282.6 * 0.25) 282.6"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
