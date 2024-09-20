interface NuxtUiLink {
  label: string;
  to?: string;
  icon?: string;
  click?: (() => void) | undefined;
}
