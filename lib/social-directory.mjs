const platformNames = {
  amazon: 'Amazon',
  'apple-music': 'Apple Music',
  bluesky: 'Bluesky',
  cosmos: 'Cosmos',
  facebook: 'Facebook',
  github: 'GitHub',
  google: 'Google',
  instagram: 'Instagram',
  kick: 'Kick',
  komi: 'Komi',
  kwai: 'Kwai',
  linkbio: 'Linkbio',
  linkedin: 'LinkedIn',
  linkme: 'Linkme',
  linktree: 'Linktree',
  pinterest: 'Pinterest',
  reddit: 'Reddit',
  rumble: 'Rumble',
  snapchat: 'Snapchat',
  soundcloud: 'SoundCloud',
  spotify: 'Spotify',
  telegram: 'Telegram',
  threads: 'Threads',
  tiktok: 'TikTok',
  truthsocial: 'Truth Social',
  twitch: 'Twitch',
  twitter: 'X / Twitter',
  youtube: 'YouTube',
};
export function splitDataCollections(snapshot) {
  const social = snapshot.entries.filter(
    (e) => e.categorySlug === 'social-data',
  );
  const ecommerce = snapshot.entries.filter(
    (e) => e.categorySlug !== 'social-data',
  );
  if (!social.length || !ecommerce.length)
    throw new Error('Official Data collection partition is unavailable');
  if (
    new Set(snapshot.entries.map((e) => e.slug)).size !==
    snapshot.entries.length
  )
    throw new Error('Duplicate Data API');
  return { social, ecommerce: { ...snapshot, entries: ecommerce } };
}
export function projectSocialDirectory(entries, credits) {
  return entries.map((e) => {
    const platform =
      Object.keys(platformNames).find(
        (p) => e.slug.startsWith(`social-${p}-`) || e.slug === `social-${p}`,
      ) || 'creator-tools';
    const range = credits?.available ? credits.statistics?.[e.slug] : null;
    const minimum = range?.minimum > 0 ? Math.max(10, range.minimum) : null;
    const maximum =
      range?.maximum >= range?.minimum ? Math.max(10, range.maximum) : null;
    return {
      slug: e.slug,
      name: e.name,
      description: e.description,
      platform,
      platformName: platformNames[platform] || 'Creator tools',
      creditRange:
        minimum !== null && maximum !== null
          ? minimum === maximum
            ? String(minimum)
            : `${minimum}～${maximum}`
          : '-',
    };
  });
}
