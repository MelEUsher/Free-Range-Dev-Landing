import Image from "next/image";

const Footer = () => {
  return (
    <footer
      aria-label="Site footer"
      className="fixed inset-x-0 bottom-0 z-[1000] w-full border-t border-[#dddddd] bg-[#f9f8f3]"
    >
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-5 text-center">
        <p className="font-['Inter',system-ui,-apple-system,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif] text-sm text-[#666666]">
          © 2025 The Free Range Dev. All rights reserved.
        </p>
        <Image
          src="/assets/freerange-logo.png"
          alt="The Free Range Dev logo"
          width={100}
          height={100}
          className="mt-2.5 w-[60px] sm:w-[100px]"
          loading="lazy"
          sizes="(max-width: 640px) 60px, 100px"
        />
      </div>
    </footer>
  );
};

export default Footer;
