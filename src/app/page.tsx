import { auth } from "@clerk/nextjs/server";
import MainPage from "@/components/main-page";

export default function Home() {
  const { userId } = auth();

  if (!userId) {
    return <div>Please sign in to access the application.</div>;
  }

  return <MainPage />;
}
