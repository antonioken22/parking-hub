"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Kenette John",
    avatar: "KJ",
    title: "Computer Engineer",
    description: "nakasud ko na fake ang sticker",
  },
  {
    name: "Ryan Angelo",
    avatar: "RA",
    title: "Computer Engineer",
    description: "Samokas guard ninyo oy!",
  },
  {
    name: "Annamie",
    avatar: "A",
    title: "Computer Engineer",
    description: "ASA MAN ANG CCTV NINYO OYYY",
  },
  {
    name: "Benz Gerald",
    avatar: "BG",
    title: "Computer Engineer",
    description: "worth it ang sticker!",
  },
  {
    name: "Anne Breanne",
    avatar: "AB",
    title: "Computer Engineer",
    description: "gwapo kaayo si kuya guard <3",
  },
  {
    name: "Shawnnheiser",
    avatar: "S",
    title: "Computer Engineer",
    description: "Great parking space.",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-primary font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-muted border border-primary text-primary"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-primary opacity-80 text-sm">
                    {item.title}
                  </p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
