type BenefitCardProps = {
    title: string;
    description: string;
    icon: string;
}


const BenefitCard = ({title, description, icon} : BenefitCardProps) => {
  return (
    <div>
      {title}
      {description}
        {icon}
    </div>
  )
}

export default BenefitCard
