import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api/ApiClient";
import { extractErrorMessages } from "../../utils/errorUtils";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/register", userData);
      console.log("response data:", response);
      return response.data;
    },
    onSuccess: (data) => {
      navigate("/login");
      console.log("success data:", data);
    },
    onError: (error) => {
      console.error("err", error);
      setError(extractErrorMessages(error));
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    registerMutation.mutate({
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  return (
    <Card className="w-full border-border">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-center">Create an account</CardTitle>
        <CardDescription className="text-md text-center">
          Enter your details to register!
        </CardDescription>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-0">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <div className="text-sm font-medium text-left">Full Name</div>
              <Input
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-left">Email</div>
              <Input
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="johndoe@email.com"
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-left">Password</div>
              <Input
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="********"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-left">
                Confirm Password
              </div>
              <Input
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder="********"
              />
            </div>
            <div className="pb-6">
              {/* <SubmitButton /> */}
              <Button type="submit" className="w-full cursor-pointer">
                {registerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" /> Creating
                    account....
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <div className="text-center text-sm">
              Already have an account ?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-primary hover:underline cursor-pointer">
                Sign in
              </a>
            </div>
          </CardFooter>
        </form>
      </CardHeader>
    </Card>
  );
};
