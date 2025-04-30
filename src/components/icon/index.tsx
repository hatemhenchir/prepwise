import { upload } from "./upload";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  fill?: string;
}

const Icon: React.FC<IconProps & { name: string }> = ({
  name,
  fill,
  ...rest
}) => {
  const icons: { [key: string]: React.FC<IconProps> } = {
    upload: upload,
    // Add more imported SVG components here
  };

  const SelectedIcon = icons[name];

  if (!SelectedIcon) {
    return null;
  }

  return <SelectedIcon fill={fill} {...rest} />;
};

export default Icon;
