type CtaLink = {
  ariaLabel: string;
  href: string;
  label: string;
};

const CTA_LINKS: CtaLink[] = [
  {
    ariaLabel: "Visit The Free Range Dev YouTube channel",
    href: "https://www.youtube.com/@TheFreeRangeDev",
    label: "YouTube",
  },
  {
    ariaLabel: "Visit The Free Range Dev TikTok profile",
    href: "https://www.tiktok.com/@thefreerangedev",
    label: "TikTok",
  },
  {
    ariaLabel: "Visit The Free Range Dev Instagram profile",
    href: "https://www.instagram.com/thefreerangedev/",
    label: "Instagram",
  },
  {
    ariaLabel: "Shop The Free Range Dev store",
    href: "https://www.thefreerangedev.store/",
    label: "Shop",
  },
  {
    ariaLabel: "Visit The Free Range Dev Skool Community",
    href: "https://www.skool.com/the-free-range-dev",
    label: "Skool Community",
  },
  {
    ariaLabel: "Open The Free Range Dev Support Squad modal",
    href: "#supportModal",
    label: "Support Squad",
  },
];

const buttonBaseClasses =
  "inline-flex items-center justify-center w-full max-w-[148.5px] min-h-[3rem] px-[1.215rem] py-[1.485rem] text-[1.1rem] font-bold text-[#1f2d3d] rounded-[8px] bg-[linear-gradient(180deg,_#a8bdb0_0%,_#95a89d_100%)] shadow-[0_6px_16px_rgba(168,189,176,0.12),_inset_0_-1px_0_rgba(0,0,0,0.06)] antialiased outline-none filter transition-[transform,box-shadow,filter] duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]";

const buttonInteractiveClasses =
  "hover:-translate-y-[2px] hover:shadow-[0_10px_26px_rgba(168,189,176,0.18)] hover:outline-2 hover:outline-[#ffbd59] hover:outline-offset-2 hover:brightness-[0.95] focus-visible:-translate-y-[2px] focus-visible:shadow-[0_10px_26px_rgba(168,189,176,0.18)] focus-visible:outline-2 focus-visible:outline-[#ffbd59] focus-visible:outline-offset-2 focus-visible:brightness-[0.95] active:translate-y-0 active:shadow-[0_6px_16px_rgba(168,189,176,0.12),_inset_0_-1px_0_rgba(0,0,0,0.06)] active:brightness-[0.92]";

export const CtaGrid = () => {
  return (
    <div
      aria-label="Primary Free Range Dev calls to action"
      className="grid w-full max-w-[720px] place-items-center gap-y-[0.85rem] sm:grid-cols-3 sm:gap-x-8 sm:gap-y-[0.85rem] mx-auto"
    >
      {CTA_LINKS.map(({ ariaLabel, href, label }) => {
        const isExternal = href.startsWith("http");
        return (
          <a
            key={label}
            aria-label={ariaLabel}
            className={`${buttonBaseClasses} ${buttonInteractiveClasses}`}
            href={href}
            rel={isExternal ? "noopener noreferrer" : undefined}
            target={isExternal ? "_blank" : undefined}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
};
