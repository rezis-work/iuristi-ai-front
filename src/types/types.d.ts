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

export interface Award {
  id: string;
  title: string;
  type: string;
  client: string;
  year: string;
}
