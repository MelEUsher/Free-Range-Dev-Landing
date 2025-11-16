import { CtaGrid } from '@/app/components/CtaGrid';

const Hero = () => {
  return (
    <header
      role="banner"
      aria-label="Site header"
      className="mx-auto flex w-full max-w-[760px] flex-col items-center justify-center px-5 pt-12 pb-7 text-center text-[#333333] min-h-[calc(100vh-160px)]"
    >
      <h1 className="font-hand text-[3.75rem] leading-[1.1] text-[#333333] mb-3 text-balance">
        The Free Range Dev
      </h1>
      <h2 className="font-display font-bold text-[1.4rem] sm:text-[1.75rem] text-[#58786a] leading-snug sm:whitespace-nowrap whitespace-normal mb-2.5 text-balance">
        From Command Line to Coast Line
      </h2>
      <p className="font-alans font-semibold sm:font-normal text-[1.1rem] text-[#876a5a] mt-[0.2rem] mb-[0.2rem] text-pretty">
        Breaking Stuff, Building Income, Living Free - Together
      </p>
      <p className="font-alans font-semibold sm:font-normal text-[1.1rem] text-[#876a5a] mt-[0.2rem] mb-5 text-pretty">
        Dev &amp; Entrepreneur Hacks | Join the squad &amp; build your freedom.
      </p>
      <CtaGrid />
    </header>
  );
};

export default Hero;
