type FeatureCardProps = {
    title: string;
    description: string;
};


const FeatureCard = ({title, description}: FeatureCardProps) => {
  return (
    <div className="border-1 text-center flex h-40 w-2/3 flex-col border-black p-4 rounded-2xl">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default FeatureCard
