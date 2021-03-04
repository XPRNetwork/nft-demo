import Image from 'next/image';
import {
  FooterBackground,
  ImageContainer,
  StyledFooter,
  Section,
  FooterLink,
} from './Footer.styled';

const links = [
  {
    name: 'Proton Blockchain',
    url: 'https://www.protonchain.com/',
  },
  {
    name: 'Documentation',
    url: 'https://docs.protonchain.com/',
  },
  {
    name: 'Wallet',
    url: 'https://www.protonchain.com/wallet',
  },
  {
    name: 'Support',
    url: 'https://support.protonchain.com/support/tickets/new',
  },
];

const Footer = (): JSX.Element => {
  return (
    <FooterBackground>
      <StyledFooter>
        <ImageContainer>
          <Image
            priority
            layout="fixed"
            width={143}
            height={32}
            src="/logo@3x.png"
          />
        </ImageContainer>
        <Section>
          {links.map(({ name, url }) => (
            <FooterLink key={name} href={url} target="_blank" rel="noreferrer">
              {name}
            </FooterLink>
          ))}
        </Section>
      </StyledFooter>
    </FooterBackground>
  );
};

export default Footer;
