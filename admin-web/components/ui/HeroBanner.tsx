import type { CSSProperties, ReactNode } from 'react';
import styles from './HeroBanner.module.css';

type StaticImage = { src: string; width: number; height: number };

type HeroBannerProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  // Decorative cut-paper image from shared/brand/heroes/ (always alt="")
  image: StaticImage;
  // Optional wider image for screens 1280 px and up
  wideImage?: StaticImage;
  // Optional banner proportions when the artwork is taller than the banner (Visual
  // Package 01). The artwork fills the banner (object-fit: cover) and is cropped on
  // screen only, toward `focus`; the file itself is never cropped.
  frame?: { width: number; height: number };
  focus?: string;
  actions?: ReactNode;
  // h1 by default: the banner is the page's main heading
  headingLevel?: 1 | 2;
};

// Visual Package 01 banners (Review Tasks, Metrics, Email): the 2:1 artwork is shown in a
// 5:2 banner, cropped on screen slightly below center so every object stays in view.
export const packageHeroFrame = { frame: { width: 5, height: 2 }, focus: 'right 70%' };

// Page hero banner (approved prototype). The image fills the banner; the text sits on a
// solid Warm Care panel on the left so it never depends on the photo for contrast.
// The artwork is unchanged; only its cropping, position and responsive behavior are set here.
export function HeroBanner({ title, description, eyebrow, image, wideImage, frame, focus, actions, headingLevel = 1 }: HeroBannerProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  // Phase 3: the banner keeps the artwork's own proportions, so it is never squashed and
  // the illustration is not cropped at the sides (the text sits over the plain paper area).
  const box = frame ?? image;
  const wide = frame ?? wideImage ?? image;
  const ratio = {
    '--hero-ratio': `${box.width} / ${box.height}`,
    '--hero-w': box.width,
    '--hero-h': box.height,
    '--hero-w-wide': wide.width,
    '--hero-h-wide': wide.height,
    ...(focus ? { '--hero-focus': focus } : {}),
  } as CSSProperties;
  return (
    <section className={styles.hero} style={ratio}>
      <picture className={styles.art} aria-hidden="true">
        {wideImage && <source media="(min-width: 1280px)" srcSet={wideImage.src} width={wideImage.width} height={wideImage.height} />}
        <img src={image.src} width={image.width} height={image.height} alt="" className={styles.image} />
      </picture>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <Heading className={styles.title}>{title}</Heading>
        {description && <p className={styles.description}>{description}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </section>
  );
}
