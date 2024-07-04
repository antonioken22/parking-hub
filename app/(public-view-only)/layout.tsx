import { LandingNavbar } from "../(landing)/_components/landing-navbar";

const PublicViewOnlyLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-screen relative">
      <LandingNavbar />
      <main>{children}</main>
    </div>
  );
};

export default PublicViewOnlyLayout;
