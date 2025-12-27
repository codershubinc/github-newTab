declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.json' {
  const content: string;
  export default content;
}

// === ADD THESE DEFINITIONS ===
export interface SocialAccount {
  provider: string;
  url: string;
}

export interface User {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  company?: string;
  blog?: string;
  location?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  social_accounts?: SocialAccount[]; // <--- New Field
}