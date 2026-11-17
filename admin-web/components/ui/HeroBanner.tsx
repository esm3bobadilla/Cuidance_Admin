import type { ReactNode } from 'react';
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
  actions?: ReactNode;
  // h1 by default: the banner is the page's main heading
  headingLevel?: 1 | 2;
};

// Page hero banner (approved prototype). The image fills the banner; the text sits on a
// solid Warm Care panel on the left so it never depends on the photo for contrast.
export function HeroBanner({ title, description, eyebrow, image, wideImage, actions, headingLevel = 1 }: HeroBannerProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <section className={styles.hero}>
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
