import { FC, ReactNode } from 'react';
import { Heart } from 'lucide-react';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterProps {
  companyName?: string;
  year?: number;
  links?: FooterLink[];
  showMadeWith?: boolean;
  madeByText?: string;
  madeByName?: string;
  customContent?: ReactNode;
  className?: string;
}

const Footer: FC<FooterProps> = ({
  companyName = 'Your Company',
  year = new Date().getFullYear(),
  links = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: '/contact' },
  ],
  showMadeWith = true,
  madeByText = 'Made with',
  madeByName = 'Cương',
  customContent,
  className = '',
}) => {
  if (customContent) {
    return (
      <div className={`px-4 md:px-6 py-4 ${className}`}>
        {customContent}
      </div>
    );
  }

  return (
    <div className={`px-4 md:px-6 py-4   bg-primary-dark  ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        {/* Copyright */}
        <p className="text-white/80 text-center md:text-left">
          © {year} {companyName}. All rights reserved.
        </p>

        {/* Links */}
        {links.length > 0 && (
          <div className="flex items-center gap-4 md:gap-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Made with love */}
        {showMadeWith && (
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span>{madeByText}</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" />
            <span>by {madeByName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;