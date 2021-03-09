import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../Button';
import {
  Background,
  Nav,
  AvatarContainer,
  HamburgerContainer,
  ImageContainer,
  Section,
  NavLink,
  GradientBackground,
  MobileOnlySection,
  DesktopOnlySection,
  PlaceholderAvatar,
} from './NavBar.styled';
import { useScrollLock } from '../../hooks';
import { useAuthContext } from '../Provider';

const NavBar = (): JSX.Element => {
  const router = useRouter();
  const { currentUser, login, logout } = useAuthContext();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  useScrollLock(isMobileNavOpen);

  const routes = [
    {
      name: 'Marketplace',
      path: '/',
      isHidden: false,
    },
    {
      name: 'Collection',
      path: `/collection/testuser1111`, // TODO: Remove when Proton NFTs are live
      // path: `/collection/${currentUser ? currentUser.actor : ''}`, // TODO: Comment back in when Proton NFTs are live
      isHidden: !currentUser,
    },
  ];

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

  const closeMobileNav = () => {
    if (isMobileNavOpen) setIsMobileNavOpen(false);
  };

  const connectWallet = () => {
    closeMobileNav();
    login();
  };

  const welcomeMessage = currentUser ? (
    <h1>
      Welcome, {currentUser.name.split(' ')[0]} ({currentUser.actor})
    </h1>
  ) : null;

  const currentUserAvatar = currentUser ? (
    <AvatarContainer>
      <Image
        priority
        layout="fixed"
        width={32}
        height={32}
        alt="chain account avatar"
        src={currentUser.avatar}
      />
    </AvatarContainer>
  ) : (
    <PlaceholderAvatar />
  );

  return (
    <Background>
      <Nav>
        <HamburgerContainer onClick={toggleMobileNav}>
          <Image
            priority
            layout="fixed"
            width={40}
            height={40}
            alt={isMobileNavOpen ? 'close' : 'open'}
            src={isMobileNavOpen ? '/icons-close.svg' : '/icons-small-menu.svg'}
          />
        </HamburgerContainer>
        <ImageContainer>
          <Image
            priority
            layout="fixed"
            width={143}
            height={32}
            alt="logo"
            src="/logo@3x.png"
          />
        </ImageContainer>
        <Section isMobileNavOpen={isMobileNavOpen}>
          {routes.map(({ name, path, isHidden }) => {
            const isActive =
              router.pathname.split('/')[1] === path.split('/')[1];
            return isHidden ? null : (
              <Link href={path} passHref key={name}>
                <NavLink isActive={isActive} onClick={closeMobileNav}>
                  {name}
                </NavLink>
              </Link>
            );
          })}
          <DesktopOnlySection>
            {welcomeMessage}
            {currentUserAvatar}
          </DesktopOnlySection>
          <Button onClick={currentUser ? logout : connectWallet}>
            {currentUser ? 'Log out' : 'Connect Wallet'}
          </Button>
          <GradientBackground onClick={closeMobileNav} />
        </Section>
        <MobileOnlySection>{currentUserAvatar}</MobileOnlySection>
      </Nav>
    </Background>
  );
};

export default NavBar;
