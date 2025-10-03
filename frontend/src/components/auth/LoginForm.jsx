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
import api from "@/lib/api/apiClient";
import { extractErrorMessages } from "../../utils/errorUtils";
import useAuthStore from "../../lib/Store/authStore";
export const LoginForm = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const { setAuth } = useAuthStore();

  const LoginMutation = useMutation({
    mutationFn: async (credential) => {
      const response = await api.post("/auth/login", credential);
      return response.data;
    },
    onSuccess: (data) => {
      //TODO: handle tokens
      if(data.token){
        const user = data.user;
        const token = data.token;
        setAuth(user, token);
        navigate('/dashboard')
      }
    },
    onError: (error) => {
      setError(extractErrorMessages(error));
      console.error("err", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formValues.email || !formValues.password) {
      setError("Please enter the credentials");
      setIsLoading(false)
      return;
    }
    LoginMutation.mutate({
      email: formValues.email,
      password: formValues.password
    });
    setError(false);
    setIsLoading(false)
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
        <CardTitle className="text-xl text-center">Sign in</CardTitle>
        <CardDescription className="text-md text-center text-wrap">
          Enter your credentials to sign in to your account
        </CardDescription>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-0">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
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

            <div className="pb-6">
              <Button type="submit" className="w-full cursor-pointer">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" /> Login account....
                  </span>
                ) : (
                  "Login account"
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <div className="text-center text-sm">
              I don't have an account?{" "}
              <a
                onClick={() => navigate("/register")}
                className="text-primary hover:underline cursor-pointer">
                Create an account
              </a>
            </div>
          </CardFooter>
        </form>
      </CardHeader>
    </Card>
  );
};
