import styles from './Breadcrumb.module.css';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

// The last item is the current page; earlier items link back up the path.
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {isCurrent || !item.href ? (
                <span className={styles.current} aria-current={isCurrent ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <a className={styles.link} href={item.href}>
                  {item.label}
                </a>
              )}
              {!isCurrent && (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
