import { Link, useNavigate, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "../lib/Store/authStore";
import  logo from "../assets/logo.svg"

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/transactions", label: "Transactions" },
    { path: "/analytics", label: "Analytics" },
  ];

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} className="h-8 w-8" alt="Logo" /> <h1 className="text-xl font-bold text-primary">
            Finance Tracker</h1> 
        </Link>

        {/* Navigation Links */}
        <div className=" hidden sm:flex items-center space-x-4">
          {isAuthenticated &&
            navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium px-3 py-1 rounded transition ${
                    isActive
                      ? "bg-secondary text-blue-600 border border-gray-300"
                      : "text-primary hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
        </div>

        {/* Right side: Avatar / Login */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Welcome text */}
              <div className="hidden md:block text-muted-foreground">
                Hello,{" "}
                <span className="text-gray-600 font-medium">
                  {user?.name ?? "Guest"}
                </span>
              </div>

              {/* Avatar Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar
                    className="cursor-pointer w-11 h-11 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition"
                  >
                    <AvatarImage src={user?.profile} alt="avatar" />
                    <AvatarFallback className="font-medium">
                      {user?.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuItem className="sm:hidden" onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="sm:hidden" onClick={() => navigate("/transactions")}>
                    Transactions
                  </DropdownMenuItem>
                  <DropdownMenuItem className="sm:hidden" onClick={() => navigate("/analytics")}>
                    Analytics
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-primary border bg-secondary px-4 py-2 rounded transition hover:bg-secondary/90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
