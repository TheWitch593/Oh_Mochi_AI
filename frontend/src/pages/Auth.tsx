import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";
import { api } from "@/services/api";

const Auth = () => {
  const handleGoogleAuth = () => {
    // This calls the backend to start the Google OAuth flow
    api.login();
  };

  return (
    <div className="min-h-screen flex flex-col mochi-gradient">
      {/* Decorative dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-mochi-pink opacity-40" />
        <div className="absolute top-32 right-20 w-2 h-2 rounded-full bg-mochi-green opacity-50" />
        <div className="absolute bottom-40 left-1/4 w-4 h-4 rounded-full bg-mochi-pink opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-mochi-green opacity-40" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 z-10">
        {/* Logo */}
        <Link to="/" className="mb-6 float-animation">
          <img 
            src={logo} 
            alt="Oh, Mochi" 
            className="w-40 h-auto drop-shadow-lg"
          />
        </Link>

        {/* Auth Card */}
        <Card className="w-full max-w-md border-2 border-mochi-pink-light bg-card/90 backdrop-blur-sm mochi-shadow animate-fade-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome to Oh, Mochi!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to continue your conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Auth Button */}
            <Button 
              variant="outline" 
              className="w-full h-12 gap-3 border-2"
              onClick={handleGoogleAuth}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <Separator className="my-4" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
                or
              </span>
            </div>

            {/* Ghost Mode */}
            <Link to="/chat">
              <Button variant="ghost" className="w-full h-12 text-muted-foreground hover:text-foreground text-base">
                👻 Continue as Guest
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;