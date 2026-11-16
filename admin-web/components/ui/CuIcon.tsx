import { useId } from 'react';
import { cuIconBadge, cuIcons, type CuIconName, type CuIconShape } from '../../../shared/brand/icons/cu-icons';

type CuIconProps = {
  name: CuIconName;
  // Pixel size of the drawn icon. Default 20.
  size?: number;
  // plain: one color (currentColor by default). badge: icon on a filled circle.
  variant?: 'plain' | 'badge';
  // Plain icon color, or the badge's icon color. Use a token, e.g. 'var(--color-ink)'.
  color?: string;
  // Badge circle color. Defaults to the icon's approved badge color.
  surface?: string;
};

// Always decorative: pair it with visible text or an aria-label on the control.
export function CuIcon({ name, size = 20, variant = 'plain', color, surface }: CuIconProps) {
  const id = useId();
  const shape: CuIconShape = cuIcons[name];
  const badge = variant === 'badge';
  const ink = color ?? (badge ? 'var(--color-badge-ink)' : 'currentColor');
  const fill = surface ?? cuIconBadge[name] ?? 'var(--color-badge-green)';
  const stroke = shape.sw ?? 1.2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={badge ? '-12 -12 24 24' : '-9.2 -9.2 18.4 18.4'}
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', flex: 'none' }}
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-12} y={-12} width={24} height={24}>
          {shape.f && <path d={shape.f} fill="#fff" stroke="#fff" strokeWidth={stroke} strokeLinejoin="round" />}
          {shape.s && <path d={shape.s} fill="none" stroke="#fff" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" />}
          {shape.c && <path d={shape.c} fill="#000" />}
          {shape.k && <path d={shape.k} fill="none" stroke="#000" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />}
        </mask>
      </defs>
      {badge && <circle r={12} fill={fill} />}
      <rect x={-12} y={-12} width={24} height={24} fill={ink} mask={`url(#${id})`} />
    </svg>
  );
}
