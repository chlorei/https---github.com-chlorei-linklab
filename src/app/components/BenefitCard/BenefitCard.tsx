import { FolderOpen, BarChart3, Zap, Globe } from "lucide-react";

type BenefitCardProps = {
  title: string;
  description: string;
  icon: "folder" | "chart" | "zap" | "globe";
};

const iconMap = {
  folder: FolderOpen,
  chart: BarChart3,
  zap: Zap,
  globe: Globe,
};

const BenefitCard = ({ title, description, icon }: BenefitCardProps) => {
  const Icon = iconMap[icon];

  return (
    <div className="group relative flex w-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
};

export default BenefitCard;
