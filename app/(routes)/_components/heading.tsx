interface HeadingProps {
  title: string;
  description: string;
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <>
      <div className="flex items-center">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-primary">
            {title}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};
