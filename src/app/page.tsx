import Main from "./components/Main/Main";
import { getSession } from "@/lib/auth/auth";
import Button from "@/app/components/UI/Button/Button";
import BenefitCard from "@/app/components/BenefitCard/BenefitCard";
import AnonymousLinks from "@/app/components/AnonymousLinks/AnonymousLinks";
import { getAnonKey } from "@/lib/auth/anonymous";
import { listLinks } from "@/lib/services/link.service";

export const dynamic = "force-dynamic";

const ANON_LINKS_SHOWN = 20;

export default async function Home() {
  const session = await getSession();

  if (session) {
    return (
      <main className="min-h-screen flex justify-center mt-40">
        <div className="container mx-auto px-4">
          <Main />
        </div>
      </main>
    );
  }

  const anonKey = await getAnonKey();
  const anonLinks = anonKey ? await listLinks({ anonKey }, ANON_LINKS_SHOWN) : [];

  return (
 <main className="min-h-screen flex justify-center mt-40">
  <div className="container mx-auto px-4">
      <Main/>
      <AnonymousLinks links={anonLinks} />
      <div>
        <div className="mt-20 from-primary/5 to-primary/10 rounded-3xl p-8">
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
        {/* <div className="mt-20 flex flex-col items-center gap-12">
          <FeatureCard title="Custom Links" description="Create memorable short links that reflect your brand" />
          <FeatureCard title="Analytics" description="Track clicks and engagement with detailed insights" />
          <FeatureCard title="QR Codes" description="Generate QR codes for your shortened links instantly" />
        </div> */}

        <div className="mt-30 space-y-8">
          <h2 className="text-center text-3xl font-semibold">All Features Included</h2>

          <div className="flex flex-row justify-around flex-wrap gap-8">
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
              title="Instant refresh of stats"
              description="Get latest statistics about your links ASAP"
              icon="⚡"
            />
            <BenefitCard
              title="Custom slugs"
              description="Use your own slugs for branded short links that build trust"
              icon="🌐"
            />
          </div>
        </div>

        {/* <div className="mt-20 rounded-3xl border border-border bg-card p-12 text-center">
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
        </div> */}
      {/* Footer */}
      {/* <footer className="mt-20 border-t border-border py-6 text-center text-sm text-muted-foreground">
        © 2025 Relinxr —{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </footer> */}
      </div>
  </div>
</main>
    
  );
}
