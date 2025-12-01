type BenefitCardProps = {
    title: string;
    description: string;
    icon: string;
}


const BenefitCard = ({title, description, icon} : BenefitCardProps) => {
  return (
    <div className=" text-center flex h-40 w-1/3 flex-col border-black p-4 rounded-2xl">
      <div className="text-2xl">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default BenefitCard
