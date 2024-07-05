import Link from 'next/link';

const MobileFriendlyComponent: React.FC = () => {
  return (
    <div className="flex flex-col w-full items-center lg:w-1/3 bg-primary-foreground text-black rounded-lg p-4 lg:p-8 sm:mx-8">
      <div className="mb-4 lg:mb-8 px-20 lg:p-6 bg-primary text-center rounded">
        <Link href="/" className="text-black hover:underline ">
          ANNOUNCEMENT!
        </Link>
      </div>
      <div className="px-20 lg:p-3 bg-primary text-center rounded">
        STATUS
        <div className="mt-4">
          <div className="relative w-16 h-16 lg:w-24 lg:h-24 mx-auto">
            <svg className="absolute inset-0 w-full h-full">
              <circle cx="50%" cy="50%" r="45%" stroke="black" strokeWidth="10" fill="none" />
              <circle cx="50%" cy="50%" r="45%" stroke="orange" strokeWidth="10" strokeDasharray="calc(282.6 * 0.25) 282.6" fill="none" />
            </svg>
          </div>    
        </div>
      </div>
    </div>
  );
};

export default MobileFriendlyComponent;
