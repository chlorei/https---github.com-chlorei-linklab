type FeatureCardProps = {
    title: string;
    description: string;
};


const FeatureCard = ({title, description}: FeatureCardProps) => {
  return (
    <div>
        {title}
        {description}
    </div>
  )
}

export default FeatureCard
