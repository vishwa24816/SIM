
import * as React from "react";
import Image from "next/image";
import placeholderImages from '@/app/lib/placeholder-images.json';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <Image
    src={placeholderImages.logo.src}
    alt={placeholderImages.logo.alt}
    width={32}
    height={32}
    className="rounded-md"
    data-ai-hint={placeholderImages.logo['data-ai-hint']}
  />
);
