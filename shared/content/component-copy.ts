/*
 * Wording used inside shared Admin Web components (Phase B1).
 */

export const uploadFieldCopy = {
  choose: 'Choose an image',
  replace: 'Replace image',
  remove: 'Remove image',
  hint: (types: string, maxMb: number) => `${types}, up to ${maxMb} MB. Stays in this browser until you save.`,
  altLabel: 'Alt text (required)',
  altHelper: 'Describe what the image shows for people who can’t see it. Write "Decorative" only if it adds no information.',
  altMissing: 'Add alt text before saving this image.',
  tooLarge: (maxMb: number) => `This file is larger than ${maxMb} MB. Choose a smaller image.`,
  wrongType: 'This file type isn’t supported. Choose a JPG, PNG or WebP image.',
  preview: 'Image preview',
};
