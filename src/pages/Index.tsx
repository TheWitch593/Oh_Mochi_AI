import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center mochi-gradient">
      {/* Decorative dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-mochi-pink opacity-40" />
        <div className="absolute top-32 right-20 w-2 h-2 rounded-full bg-mochi-green opacity-50" />
        <div className="absolute bottom-40 left-1/4 w-4 h-4 rounded-full bg-mochi-pink opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-mochi-green opacity-40" />
        <div className="absolute bottom-1/4 right-10 w-3 h-3 rounded-full bg-mochi-pink opacity-35" />
        <div className="absolute top-1/2 left-16 w-2 h-2 rounded-full bg-mochi-green opacity-45" />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 z-10">
        {/* Logo */}
        <div className="float-animation mb-8">
          <img 
            src={logo} 
            alt="Oh, Mochi - Cute chatbot assistant" 
            className="w-64 md:w-80 h-auto drop-shadow-lg"
          />
        </div>

        {/* Tagline */}
        <p className="text-muted-foreground text-lg md:text-xl mb-10 text-center max-w-md animate-fade-in">
          Your friendly AI companion, always here to help! ✨
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link to="/auth?mode=signup">
            <Button variant="mochi" size="lg" className="min-w-[160px]">
              SIGN UP
            </Button>
          </Link>
          <Link to="/auth?mode=login">
            <Button variant="mochi-green" size="lg" className="min-w-[160px]">
              LOGIN
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
