import {
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  CalendarBlank,
  Check,
  Clock,
  FileText,
  Globe,
  House,
  Eye,
  EyeSlash,
  Leaf,
  List,
  LockSimple,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  SignOut,
  Sparkle,
  Trash,
  UploadSimple,
  X,
  type IconProps,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';

export type IconName =
  | 'home' | 'spark' | 'book' | 'file' | 'search' | 'plus' | 'arrow'
  | 'calendar' | 'clock' | 'logout' | 'upload' | 'close' | 'menu'
  | 'leaf' | 'check' | 'external' | 'lock' | 'globe' | 'edit' | 'trash'
  | 'eye' | 'eyeClosed';

interface Props extends Omit<IconProps, 'ref'> {
  name: IconName;
}

const icons: Record<IconName, PhosphorIcon> = {
  home: House,
  spark: Sparkle,
  book: BookOpen,
  file: FileText,
  search: MagnifyingGlass,
  plus: Plus,
  arrow: ArrowRight,
  calendar: CalendarBlank,
  clock: Clock,
  logout: SignOut,
  upload: UploadSimple,
  close: X,
  menu: List,
  leaf: Leaf,
  check: Check,
  external: ArrowSquareOut,
  lock: LockSimple,
  globe: Globe,
  edit: PencilSimple,
  trash: Trash,
  eye: Eye,
  eyeClosed: EyeSlash,
};

export default function Icon({ name, size = 20, weight = 'regular', ...props }: Props) {
  const Component = icons[name];
  return <Component aria-hidden="true" size={size} weight={weight} {...props} />;
}
