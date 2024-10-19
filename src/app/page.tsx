import { auth } from "@clerk/nextjs";
import Layout from "@/components/layout";

export default function Home() {
  const { userId } = auth();

  if (!userId) {
    return <div>Please sign in to access the application.</div>;
  }

  return <Layout>Welcome to the Trainee Attendance Tracker</Layout>;
}
