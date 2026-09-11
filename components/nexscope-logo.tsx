import Image from 'next/image';

type NexscopeLogoProps = {
  dark?: boolean;
};

export function NexscopeLogo({ dark = false }: NexscopeLogoProps) {
  return (
    <Image
      className="nexscope-logo"
      src={dark ? '/logo-dark.png' : '/logo.png'}
      alt="Nexscope"
      width={165}
      height={32}
      priority
      unoptimized
    />
  );
}
