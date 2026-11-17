'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { CuIcon } from '../ui/CuIcon';
import { TextInput } from './TextInput';
import { uploadFieldCopy } from '../../../shared/content/component-copy';
import styles from './UploadField.module.css';

export type UploadValue = { file: File; alt: string } | null;


type UploadFieldProps = {
  label: string;
  value: UploadValue;
  onChange: (value: UploadValue) => void;
  maxMb?: number;
  // Shows the alt-text error once someone tries to save
  showErrors?: boolean;
};

const accepted = ['image/jpeg', 'image/png', 'image/webp'];

// Image upload with required alt text (approved prototype, Email and Content editors).
// Local only: the file is previewed in the browser and never sent anywhere by this component.
export function UploadField({ label, value, onChange, maxMb = 5, showErrors = false }: UploadFieldProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!value) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(value.file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value?.file]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!accepted.includes(file.type)) return setError(uploadFieldCopy.wrongType);
    if (file.size > maxMb * 1024 * 1024) return setError(uploadFieldCopy.tooLarge(maxMb));
    setError('');
    onChange({ file, alt: value?.alt ?? '' });
  };

  const altError = showErrors && value && !value.alt.trim() ? uploadFieldCopy.altMissing : undefined;

  return (
    <fieldset className={styles.field}>
      <legend className={styles.legend}>{label}</legend>
      <p id={`${id}-hint`} className={styles.hint}>
        {uploadFieldCopy.hint('JPG, PNG or WebP', maxMb)}
      </p>
      <input
        ref={input}
        id={`${id}-file`}
        type="file"
        accept={accepted.join(',')}
        className="visually-hidden"
        aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}
        onChange={(event) => {
          pick(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      {value && preview ? (
        <div className={styles.chosen}>
          <img className={styles.preview} src={preview} alt={value.alt || uploadFieldCopy.preview} />
          <div className={styles.meta}>
            <p className={styles.fileName}>{value.file.name}</p>
            <div className={styles.buttons}>
              <label htmlFor={`${id}-file`} className={styles.button}>
                <CuIcon name="upload" size={16} />
                {uploadFieldCopy.replace}
              </label>
              <button type="button" className={styles.button} onClick={() => onChange(null)}>
                <CuIcon name="close" size={16} />
                {uploadFieldCopy.remove}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`${id}-file`}
          className={styles.drop}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            pick(event.dataTransfer.files?.[0]);
          }}
        >
          <CuIcon name="upload" variant="badge" size={40} />
          <span className={styles.dropText}>{uploadFieldCopy.choose}</span>
        </label>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          <CuIcon name="alert" size={16} /> {error}
        </p>
      )}
      {value && (
        <TextInput
          id={`${id}-alt`}
          label={uploadFieldCopy.altLabel}
          helper={uploadFieldCopy.altHelper}
          error={altError}
          required
          value={value.alt}
          onChange={(event) => onChange({ ...value, alt: event.target.value })}
        />
      )}
    </fieldset>
  );
}
