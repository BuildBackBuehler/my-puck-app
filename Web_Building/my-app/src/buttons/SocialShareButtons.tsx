import { FacebookShare, LinkedinShare, RedditShare, TwitterShare } from 'react-share-kit';
import { useBreakpoint } from '@/utils/hooks/use-breakpoints';

interface ShareUrls {
  facebook?: string;
  linkedin?: string;
  reddit?: string;
  twitter?: string;
}

interface SocialShareButtonsProps {
  urls: ShareUrls;
  title: string;
}

export const SocialShareButtons = ({ urls, title }: SocialShareButtonsProps) => {
  const { isMobile, isTablet } = useBreakpoint();
  const size = isMobile ? 20 : isTablet ? 28 : 36;

  return (
    <div className="flex gap-1">
      <FacebookShare url={urls.facebook || ''} quote={title} round size={size} blankTarget />
      <LinkedinShare url={urls.linkedin || ''} round size={size} blankTarget />
      <RedditShare url={urls.reddit || ''} title={title} round size={size} blankTarget />
      <TwitterShare url={urls.twitter || ''} title={title} round size={size} blankTarget />
    </div>
  );
};