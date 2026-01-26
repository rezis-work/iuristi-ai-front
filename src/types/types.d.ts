interface Submenu {
  href: string;
  label: string;
}

interface DropdownItem {
  href: string;
  label: string;
  submenu?: Submenu[];
}

export interface NavLink {
  href: string;
  label: string;
  dropdown?: DropdownItem[];
}
