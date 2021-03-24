import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../Button';
import {
  Background,
  Nav,
  Section,
  UserMenuButton,
  UserMenuText,
  AvatarContainer,
  ImageLink,
  DropdownLink,
  GradientBackground,
  DropdownList,
  MobileIcon,
  DesktopIcon,
  DesktopNavLink,
  DesktopOnlySection,
  Name,
  Subtitle,
  Balance,
} from './NavBar.styled';
import { useScrollLock } from '../../hooks';
import { useAuthContext } from '../Provider';

type DropdownProps = {
  isOpen: boolean;
  closeNavDropdown: () => void;
};

const Logo = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  return (
    <Link href="/" passHref>
      <ImageLink>
        <DesktopIcon>
          <Image
            priority
            layout="fixed"
            width={143}
            height={32}
            alt="logo"
            src="/logo@3x.png"
          />
        </DesktopIcon>
        <MobileIcon>
          <Image
            priority
            layout="fixed"
            width={currentUser ? 143 : 32}
            height={32}
            alt="logo"
            src={currentUser ? '/logo@3x.png' : '/logo.svg'}
          />
        </MobileIcon>
      </ImageLink>
    </Link>
  );
};

const UserAvatar = ({ isOpen, avatar, toggleNavDropdown }) => {
  const { currentUserBalance } = useAuthContext();

  const currentUserAvatar = (
    <UserMenuButton>
      <UserMenuText>{currentUserBalance}</UserMenuText>
      <AvatarContainer>
        <Image priority layout="fill" alt="chain account avatar" src={avatar} />
      </AvatarContainer>
    </UserMenuButton>
  );

  const mobileNavbarIcon = isOpen ? (
    <AvatarContainer>
      <Image priority layout="fill" alt="close" src="/x.svg" />
    </AvatarContainer>
  ) : (
    currentUserAvatar
  );

  return (
    <>
      <DesktopIcon onClick={toggleNavDropdown} role="button">
        {currentUserAvatar}
      </DesktopIcon>
      <MobileIcon onClick={toggleNavDropdown} role="button">
        {mobileNavbarIcon}
      </MobileIcon>
    </>
  );
};

const Dropdown = ({ isOpen, closeNavDropdown }: DropdownProps): JSX.Element => {
  const { currentUser, currentUserBalance, logout } = useAuthContext();

  const routes = [
    {
      name: 'My NFTs',
      path: `/my-nfts/${currentUser ? currentUser.actor : ''}`,
      onClick: closeNavDropdown,
    },
    {
      name: 'Marketplace',
      path: '/',
      onClick: closeNavDropdown,
    },
    {
      name: 'Sign out',
      path: '',
      onClick: () => {
        closeNavDropdown();
        logout();
      },
      isRed: true,
    },
  ];

  return (
    <DropdownList isOpen={isOpen}>
      <Name>{currentUser ? currentUser.name : ''}</Name>
      <Subtitle>Balance</Subtitle>
      <Balance>{currentUserBalance ? currentUserBalance : 0}</Balance>
      {routes.map(({ name, path, onClick, isRed }) =>
        path ? (
          <Link href={path} passHref key={name}>
            <DropdownLink onClick={onClick}>{name}</DropdownLink>
          </Link>
        ) : (
          <DropdownLink onClick={onClick} key={name} red={isRed}>
            {name}
          </DropdownLink>
        )
      )}
    </DropdownList>
  );
};

const DesktopNavRoutes = () => {
  const router = useRouter();
  const { currentUser } = useAuthContext();

  const routes = [
    {
      name: 'Marketplace',
      path: '/',
      isHidden: false,
    },
    {
      name: "My NFT's",
      path: `/my-nfts/${currentUser ? currentUser.actor : ''}`,
      isHidden: !currentUser,
    },
  ];

  return (
    <DesktopOnlySection>
      {routes.map(({ name, path, isHidden }) => {
        const isActive = router.pathname.split('/')[1] === path.split('/')[1];
        return isHidden ? null : (
          <Link href={path} passHref key={name}>
            <DesktopNavLink isActive={isActive}>{name}</DesktopNavLink>
          </Link>
        );
      })}
    </DesktopOnlySection>
  );
};

const NavBar = (): JSX.Element => {
  const { currentUser, login } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState<boolean>(false);
  useScrollLock(isOpen);

  const toggleNavDropdown = () => setIsOpen(!isOpen);

  const closeNavDropdown = () => setIsOpen(false);

  const connectWallet = async () => {
    setIsLoginDisabled(true);
    await login();
    closeNavDropdown();
    setIsLoginDisabled(false);
  };

  return (
    <Background>
      <Nav>
        <Logo />
        <Section>
          <DesktopNavRoutes />
          {currentUser && currentUser.avatar ? (
            <UserAvatar
              isOpen={isOpen}
              avatar={currentUser.avatar}
              toggleNavDropdown={toggleNavDropdown}
            />
          ) : (
            <Button
              rounded
              filled
              disabled={isLoginDisabled}
              onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </Section>
        <Dropdown isOpen={isOpen} closeNavDropdown={closeNavDropdown} />
        <GradientBackground isOpen={isOpen} onClick={closeNavDropdown} />
      </Nav>
    </Background>
  );
};

export default NavBar;
