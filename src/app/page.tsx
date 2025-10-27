import Main from "./components/Main/Main";
import { getSession } from "@/lib/auth/auth";
import Button from "@/app/components/UI/Button/Button";
import FeatureCard from "@/app/components/FeatureCard/FeatureCard";
import BenefitCard from "@/app/components/BenefitCard/BenefitCard";

export default async function Home() {
  const session = await getSession();
  
  


  if (session) {
      return (
        <main className="min-h-screen flex justify-center mt-40">
          <div className="container mx-auto  px-4 ">
              <Main/>
          </div>
        </main>
      );
    }



  return (
 <main className="min-h-screen flex justify-center mt-40">
  <div className="container mx-auto  px-4 ">.
      <Main/>
      <div>
        <div className="mt-16 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
          <div className="text-center">
            <h2 className="mb-3 text-3xl font-semibold">Get Started for Free</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Sign up now to access all features including analytics, projects, and link management
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button href="/signup" >
                Create Free Account
              </Button>
              <Button href="/signin">
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <FeatureCard title="Custom Links" description="Create memorable short links that reflect your brand" />
          <FeatureCard title="Analytics" description="Track clicks and engagement with detailed insights" />
          <FeatureCard title="QR Codes" description="Generate QR codes for your shortened links instantly" />
        </div>

        <div className="mt-20 space-y-8">
          <h2 className="text-center text-3xl font-semibold">All Features Included</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <BenefitCard
              title="Organize with Projects"
              description="Group your links into projects with custom colors and manage everything in one place"
              icon="📁"
            />
            <BenefitCard
              title="Advanced Analytics"
              description="Get detailed insights on clicks, geographic data, and link performance over time"
              icon="📊"
            />
            <BenefitCard
              title="Team Collaboration"
              description="Share projects with your team and collaborate on link management"
              icon="👥"
            />
            <BenefitCard
              title="Custom Domains"
              description="Use your own domain for branded short links that build trust"
              icon="🌐"
            />
          </div>
        </div>

        <div className="mt-20 rounded-3xl border border-border bg-card p-12 text-center">
          <h2 className="mb-4 text-4xl font-semibold">Ready to get started?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of users managing their links with Relinxr — completely free
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button href="/signin">
              Create Free Account
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="#" className="font-medium text-foreground underline">
              Sign in here
            </a>
          </p>
        </div>
      {/* Footer */}
      <footer className="mt-20 border-t border-border py-6 text-center text-sm text-muted-foreground">
        © 2025 Relinxr —{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </footer>
      </div>
  </div>
</main>
    
  );
}
