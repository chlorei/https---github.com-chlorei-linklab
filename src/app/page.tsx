import Main from "./components/Main/Main";
import { getSession } from "@/lib/auth/auth";
import Button from "@/app/components/UI/Button/Button";
import BenefitCard from "@/app/components/BenefitCard/BenefitCard";

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

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 pt-32 pb-20">
        <Main />

        {/* CTA Section */}
        <section className="mt-24">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-card-foreground md:text-4xl">
                Get Started for Free
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Sign up now to access all features including analytics, projects, and link management
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/signup">Create Free Account</Button>
                <Button href="/signin" variant="secondary">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              All Features Included
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to manage and track your links effectively
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <BenefitCard
              title="Organize with Projects"
              description="Group your links into projects with custom colors and manage everything in one place"
              icon="folder"
            />
            <BenefitCard
              title="Advanced Analytics"
              description="Get detailed insights on clicks, geographic data, and link performance over time"
              icon="chart"
            />
            <BenefitCard
              title="Instant Refresh"
              description="Get latest statistics about your links in real-time with instant updates"
              icon="zap"
            />
            <BenefitCard
              title="Custom Slugs"
              description="Use your own slugs for branded short links that build trust"
              icon="globe"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
