'use client';

import { useState } from 'react';
import { profilePageCopy as copy } from '../../../shared/content/account-pages';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { notificationsSeed } from '../../../shared/content/notifications';
import { roleNames } from '../../../shared/content/permissions';
import { Toast } from '../../components/feedback/Toast';
import { TextInput } from '../../components/forms/TextInput';
import { UploadField, type UploadValue } from '../../components/forms/UploadField';
import { markRead, unreadCount, useNotifications } from '../../components/layout/notificationsStore';
import { Drawer } from '../../components/overlay/Drawer';
import { Button } from '../../components/ui/Button';
import { useIdentity } from '../_data/identity';
import { isSupabaseMode } from '../_data/config';
import profileCard from '../../../shared/brand/illustrations/profile/profile-card.webp';
import styles from './account.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function ProfileView() {
  const me = useIdentity();
  const notifications = useNotifications();
  const unread = unreadCount(notifications);
  const [name, setName] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [tried, setTried] = useState(false);
  const [photo, setPhoto] = useState<UploadValue>(null);
  const [notice, setNotice] = useState('');
  const shownName = name || me.name;

  return (
    <div className={styles.page}>
      {notice && <Toast tone="success" message={notice} />}
      <div className={styles.grid2}>
        <section className={styles.card} aria-labelledby="profile-card">
          <h2 id="profile-card" className={styles.eyebrow}>
            {copy.cardEyebrow}
          </h2>
          <div className={styles.profile}>
            <span className={`${styles.avatar} ${styles.avatarLarge}`} aria-hidden="true">
              {me.initials}
            </span>
            <span className={styles.profileText}>
              <span className={styles.profileName}>{shownName}</span>
              <span className={styles.note}>{me.adminRole ? roleNames[me.adminRole] : me.role}</span>
              <span className={styles.note}>{me.status}</span>
            </span>
            <img className={styles.profileArt} src={profileCard.src} width={144} height={96} alt="" />
          </div>
          {/* Sample mode only: Supabase mode has no profile editing yet */}
          {!isSupabaseMode && (
            <>
              <UploadField label={copy.uploadPhoto} value={photo} onChange={setPhoto} maxMb={2} />
              <div className={styles.actions}>
                <Button
                  variant="primary"
                  aria-haspopup="dialog"
                  onClick={() => {
                    setDraftName(shownName);
                    setEditOpen(true);
                  }}
                >
                  {copy.editProfile}
                </Button>
              </div>
            </>
          )}
        </section>

        <section className={styles.card} aria-labelledby="profile-notifications">
          <div>
            <p className={styles.eyebrow}>{copy.notificationsEyebrow}</p>
            <h2 id="profile-notifications" className={styles.title}>
              {copy.unread(unread)}
            </h2>
          </div>
          <ul className={styles.list}>
            {notificationsSeed.map((n) => {
              const isUnread = !notifications.read.includes(n.id);
              return (
                <li key={n.id} className={styles.listRow}>
                  <a href={`${base}${n.href}`}>{n.message}</a>
                  <span className={styles.listMeta}>
                    {isUnread && <><span className={styles.unreadDot}>New</span> · </>}
                    {n.when}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className={styles.linkRow}>
            <button type="button" className={styles.link} onClick={() => markRead(notificationsSeed.map((n) => n.id))}>
              {copy.markAllRead}
            </button>
            <a className={styles.link} href={`${base}${adminScreens.settings.path}#notifications-settings`}>
              {copy.notificationSettings}
            </a>
          </div>
        </section>
      </div>

      <section className={styles.card} aria-labelledby="profile-activity">
        <div className={styles.cardHeader}>
          <h2 id="profile-activity" className={styles.title}>
            {copy.activityTitle}
          </h2>
          <p className={styles.note}>{copy.activityNote}</p>
        </div>
        <ul className={styles.list}>
          {copy.activity.map((a) => (
            <li key={a.what} className={styles.listRow}>
              <strong>{a.what}</strong>
              <span className={styles.listMeta}>
                {a.area} · {a.when}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Drawer
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setTried(false);
        }}
        eyebrow={copy.cardEyebrow}
        title={copy.editTitle}
        description={copy.editDescription}
        footer={
          <>
            <Button onClick={() => setEditOpen(false)}>{copy.cancel}</Button>
            <Button
              variant="primary"
              onClick={() => {
                setTried(true);
                if (!draftName.trim()) return;
                setName(draftName.trim());
                setNotice(copy.saved);
                setEditOpen(false);
              }}
            >
              {copy.save}
            </Button>
          </>
        }
      >
        <TextInput
          id="profile-name"
          label={copy.displayName}
          error={tried && !draftName.trim() ? copy.displayNameError : undefined}
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
        />
      </Drawer>
    </div>
  );
}
