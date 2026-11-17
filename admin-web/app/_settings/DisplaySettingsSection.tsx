'use client';

import { useState } from 'react';
import {
  displaySettingsCopy as copy,
  type DisplaySettings,
} from '../../../shared/content/display-settings';
import { resetDisplaySettings, updateDisplaySettings, useDisplaySettings } from '../../components/layout/displayStore';
import { Toggle } from '../../components/ui/Toggle';
import styles from './displaySettings.module.css';

type ChoiceKey = 'textSize' | 'density' | 'contrast' | 'motion';

// Settings > Accessibility & display (approved prototype). Changes apply at once and are
// saved in this browser only. Without JavaScript the section explains it needs scripts.
export function DisplaySettingsSection() {
  const settings = useDisplaySettings();
  const [status, setStatus] = useState('');

  const change = (next: Partial<DisplaySettings>) => {
    updateDisplaySettings(next);
    setStatus(copy.saved);
  };

  const group = <K extends ChoiceKey>(key: K, legend: string, options: Record<DisplaySettings[K] & string, string>) => (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {(Object.entries(options) as [DisplaySettings[K] & string, string][]).map(([value, label]) => (
          <label key={value} className={styles.option}>
            <input
              type="radio"
              className={styles.radio}
              name={`display-${key}`}
              value={value}
              checked={settings[key] === value}
              onChange={() => change({ [key]: value } as Partial<DisplaySettings>)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <section className={styles.section} aria-labelledby="display-settings-heading">
      <div className={styles.intro}>
        <h2 id="display-settings-heading" className={styles.title}>
          {copy.sectionTitle}
        </h2>
        <p className={styles.note}>{copy.sectionIntro}</p>
      </div>
      {group('textSize', copy.textSize.legend, copy.textSize.options)}
      {group('density', copy.density.legend, copy.density.options)}
      {group('contrast', copy.contrast.legend, copy.contrast.options)}
      {group('motion', copy.motion.legend, copy.motion.options)}
      <Toggle
        label={copy.alwaysShowFocus.label}
        hint={copy.alwaysShowFocus.hint}
        checked={settings.alwaysShowFocus}
        onChange={(checked) => change({ alwaysShowFocus: checked })}
      />
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            resetDisplaySettings();
            setStatus(copy.saved);
          }}
        >
          {copy.reset}
        </button>
        <p className={styles.status} role="status">
          {status}
        </p>
      </div>
    </section>
  );
}
