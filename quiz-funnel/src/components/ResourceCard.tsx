import { Resource } from "@/data/types";

type ResourceCardProps = {
  resource: Resource;
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="bg-steel border border-iron rounded-lg p-6 md:p-7">
      <h3 className="font-display text-white text-[20px] leading-[1.2] mb-3">
        {resource.name}
      </h3>
      <p className="font-body text-[14px] text-chalk-muted leading-[1.7] mb-5">
        {resource.description}
      </p>
      <a
        href="#"
        className="inline-block font-cond text-[12px] font-bold tracking-[0.12em] uppercase text-chalk-muted border border-iron px-4 py-2 rounded-sm hover:border-ash hover:text-chalk transition-colors duration-150"
      >
        Coming soon
      </a>
    </div>
  );
}
