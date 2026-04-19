import React from "react";
import Image from "next/image";

type DashboardLinkProps = {
  title: string;
  count: number | string;
  image: string;
};

const DashboardLinks = (props: DashboardLinkProps) => {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
        <Image
          src={props.image}
          alt=""
          width={20}
          height={20}
          className="dark:invert"
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{props.title}</p>
      <h3 className="mt-1 text-2xl font-bold text-card-foreground">
        {props.count}
      </h3>
    </div>
  );
};

export default DashboardLinks;
