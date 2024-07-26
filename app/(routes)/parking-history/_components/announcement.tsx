import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";



const Announcement: React.FC = () => {
  return (
    <Card className="flex flex-col items-stretch p-4 bg-primary text-white rounded-lg">
      <CardHeader className="mb-4 text-center">
        <CardTitle className="bg-primary-foreground p-4 rounded">
          <Link href="/dashboard" className="text-black hover:underline">
            ANNOUNCEMENT!
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center bg-primary-foreground p-4 rounded">
        STATUS
        <div className="mt-4 flex justify-center">
          <div className="relative w-[100px] h-[100px]">
            <svg
              className="absolute inset-0 w-[100px] h-[100px] animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="black"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="orange"
                strokeWidth="4"
                strokeDasharray="31.4 31.4"
                fill="none"
                strokeDashoffset="0"
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Announcement;
