import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../Button';
import {
  NavBackground,
  Nav,
  ImageContainer,
  Section,
  NavLink,
} from './NavBar.styled';

const routes = [
  {
    name: 'Marketplace',
    path: '/',
  },
  {
    name: 'Collection',
    path: '/collection',
  },
];

const NavBar = (): JSX.Element => {
  const router = useRouter();

  return (
    <NavBackground>
      <Nav>
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
          {routes.map(({ name, path }) => (
            <Link href={path} passHref key={name}>
              <NavLink isActive={router.pathname === path}>{name}</NavLink>
            </Link>
          ))}
          <Button onClick={() => console.log('connect wallet')}>
            Connect Wallet
          </Button>
        </Section>
      </Nav>
    </NavBackground>
  );
};

export default NavBar;
