import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import useAuthStore from "../lib/Store/authStore";

export const Home = () => {
  const { isAuthenticated } = useAuthStore();

  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO SECTION */}
      <main className="flex-1 flex items-center justify-center px-4">
  <div className="container mx-auto text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      Take control of your <span className="text-primary">finances</span> today
    </h1>

    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
      Track your income, expenses, and savings all in one place. Gain insights
      and build a better financial future with ease.
    </p>

    <div className="flex justify-center gap-4">
      <Button onClick={() => navigate("/dashboard")}>Get Started</Button>
      <Button variant="outline" onClick={() => navigate("/about")}>
        Learn More
      </Button>
    </div>
  </div>
</main>


      {/* FOOTER */}
      <footer className="w-full py-4 bg-gray-100 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Personal Finance Tracker. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
