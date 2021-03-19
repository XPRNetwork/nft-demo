import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../Button';
import {
  Background,
  Nav,
  Section,
  AvatarContainer,
  ImageLink,
  NavLink,
  GradientBackground,
  MobileIcon,
  MobileDropdownList,
  DesktopIcon,
  DesktopNavLink,
  DesktopDropdownList,
  DesktopOnlySection,
  Name,
  Subtitle,
  Balance,
} from './NavBar.styled';
import { useScrollLock } from '../../hooks';
import { useAuthContext, useModalContext, MODAL_TYPES } from '../Provider';

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
  const currentUserAvatar = (
    <AvatarContainer>
      <Image priority layout="fill" alt="chain account avatar" src={avatar} />
    </AvatarContainer>
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
  const { openModal } = useModalContext();

  const desktopRoutes = [
    {
      name: 'Deposit',
      path: '',
      onClick: () => openModal(MODAL_TYPES.DEPOSIT),
    },
    {
      name: 'Withdraw',
      path: '',
      onClick: () => openModal(MODAL_TYPES.WITHDRAW),
    },
    {
      name: 'Sign out',
      path: '',
      onClick: () => {
        closeNavDropdown();
        logout();
      },
    },
  ];

  const mobileRoutes = [
    {
      name: 'Deposit / Withdraw',
      path: '',
      onClick: () => openModal(MODAL_TYPES.DEPOSIT),
    },
    {
      name: "My NFT's",
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
    },
  ];

  const getContent = (routes) => (
    <>
      <Name>{currentUser ? currentUser.name : ''}</Name>
      <Subtitle>Balance</Subtitle>
      <Balance>{currentUserBalance ? currentUserBalance : 0}</Balance>
      {routes.map(({ name, path, onClick }) =>
        path ? (
          <Link href={path} passHref key={name}>
            <NavLink onClick={onClick}>{name}</NavLink>
          </Link>
        ) : (
          <NavLink onClick={onClick} key={name}>
            {name}
          </NavLink>
        )
      )}
    </>
  );

  return (
    <>
      <DesktopDropdownList isOpen={isOpen}>
        {getContent(desktopRoutes)}
      </DesktopDropdownList>
      <MobileDropdownList isOpen={isOpen}>
        {getContent(mobileRoutes)}
      </MobileDropdownList>
    </>
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
