/* oxlint-disable next/no-img-element */
import { Compass, Contact, Globe2, Link2, MessageCircle, Users, Video } from 'lucide-react';

const logos: Record<string, string> = {
  tiktok: '/assets/video-channels/tiktok.webp',
  instagram: '/assets/video-channels/instagram.svg',
  youtube: '/assets/video-channels/youtube.svg',
  amazon: '/assets/video-channels/amazon.webp',
  facebook: '/assets/social-platforms/facebook.svg',
  reddit: '/assets/social-platforms/reddit.svg',
  twitter: '/assets/social-platforms/x.svg',
  github: '/assets/social-platforms/github.svg',
  'apple-music': '/assets/social-platforms/apple-music.svg',
  bluesky: '/assets/social-platforms/bluesky.svg',
  google: '/assets/social-platforms/google.webp',
  kick: '/assets/social-platforms/kick.svg',
  pinterest: '/assets/social-platforms/pinterest.svg',
  rumble: '/assets/social-platforms/rumble.svg',
  snapchat: '/assets/social-platforms/snapchat.svg',
  soundcloud: '/assets/social-platforms/soundcloud.svg',
  spotify: '/assets/social-platforms/spotify.svg',
  telegram: '/assets/social-platforms/telegram.svg',
  threads: '/assets/social-platforms/threads.svg',
  twitch: '/assets/social-platforms/twitch.svg',
  linktree: '/assets/social-platforms/linktree.svg',
  linkedin: '/assets/social-platforms/linkedin.svg',
};
const platformIcons: Record<string, typeof Globe2> = {
  cosmos: Compass,
  komi: Link2,
  linkbio: Contact,
  linkme: Link2,
  truthsocial: MessageCircle,
  kwai: Video,
  'creator-tools': Users,
};
export function SocialPlatformIcon({
  platform,
  size,
}: {
  platform: string;
  size?: number;
}) {
  const Icon = platformIcons[platform] || Globe2;
  return logos[platform] ? (
    <img src={logos[platform]} alt="" width={size ?? 28} height={size ?? 28} loading="lazy" />
  ) : (
    <Icon size={size ?? 23} aria-hidden="true" />
  );
}
