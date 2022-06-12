import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faTwitter,
  faApple,
  faYoutube,
  faInstagram,
  faFacebook,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faEllipsis,
  faPen,
  faPlus,
  faVolumeUp,
  faVolumeDown,
  faLightbulb,
  faAngleLeft,
  faXmark,
  faUser,
  faWallet,
  faGear,
  faRightFromBracket,
  faCrown,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

interface iconProps {
  color?: string;
  size?: string;
}
export const GoogleIcon = (props: iconProps) => {
  return (
    <FontAwesomeIcon
      icon={faGoogle as IconProp}
      color={props.color}
      size="lg"
      cursor="pointer"
    />
  );
};

export const TwitterIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faTwitter as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const AppleIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faApple as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const YoutubeIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faYoutube as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const InstagramIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faInstagram as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const PenIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faPen as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const BellIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faBell as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const PlusIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faPlus as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const FacebookIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faFacebook as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const EllipsisIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faEllipsis as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const VolumMuteIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faVolumeUp as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const VolumeIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faVolumeDown as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const LightBulbIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faLightbulb as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const AngleLeftIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faAngleLeft as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const CancelIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faXmark as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const WhatsappIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faWhatsapp as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const UserIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faUser as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const WalletIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faWallet as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const SettingIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faGear as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const LogoutIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faRightFromBracket as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
export const ActivityIcon = (props: iconProps) => (
  <FontAwesomeIcon
    icon={faCrown as IconProp}
    color={props.color}
    size="lg"
    cursor="pointer"
  />
);
