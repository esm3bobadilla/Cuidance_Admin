'use client';

import { useState } from 'react';
import { settingsPageCopy as copy } from '../../../shared/content/account-pages';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { can } from '../../../shared/content/permissions';
import { sampleWorkspaceName } from '../../../shared/content/team-roster';
import { Select } from '../../components/forms/Select';
import { TextInput } from '../../components/forms/TextInput';
import { ButtonLink } from '../../components/ui/Button';
import { CuIcon } from '../../components/ui/CuIcon';
import { Toggle } from '../../components/ui/Toggle';
import { useIdentity } from '../_data/identity';
import styles from './account.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function WorkspaceAndReviewSettings() {
  const me = useIdentity();
  const editable = !!can(me.adminRole)?.editWorkspaceSettings;
  const [name, setName] = useState(sampleWorkspaceName);
  const [window, setWindow] = useState(copy.review.windows[1]);
  const [prefs, setPrefs] = useState({ checklist: true, notes: true, reassign: true });

  return (
    <>
      <section className={styles.card} aria-labelledby="settings-workspace">
        <h2 id="settings-workspace" className={styles.title}>
          {copy.workspace.title}
        </h2>
        {!editable && (
          <p className={styles.locked}>
            <CuIcon name="lock" size={16} /> {copy.workspace.lockedNote}
          </p>
        )}
        <div className={styles.fields}>
          <TextInput id="workspace-name" label={copy.workspace.name} value={name} disabled={!editable} onChange={(e) => setName(e.target.value)} />
          <TextInput id="workspace-url" label={copy.workspace.siteUrl} helper={copy.workspace.siteUrlHelper} value="https://esm3bobadilla.github.io/Cuidance_Admin/" readOnly />
        </div>
      </section>

      <section className={styles.card} aria-labelledby="settings-review">
        <h2 id="settings-review" className={styles.title}>
          {copy.review.title}
        </h2>
        <p className={styles.locked}>
          <CuIcon name="lock" size={16} /> {copy.review.separation}
        </p>
        <div className={styles.fields}>
          <Select
            id="review-window"
            label={copy.review.window}
            disabled={!editable}
            options={copy.review.windows.map((w) => ({ value: w, label: w }))}
            value={window}
            onChange={(e) => setWindow(e.target.value)}
          />
        </div>
        <Toggle label={copy.review.checklist} hint={copy.review.checklistHint} checked={prefs.checklist} disabled={!editable} onChange={(v) => setPrefs({ ...prefs, checklist: v })} />
        <Toggle label={copy.review.notes} hint={copy.review.notesHint} checked={prefs.notes} disabled={!editable} onChange={(v) => setPrefs({ ...prefs, notes: v })} />
        <Toggle label={copy.review.reassign} hint={copy.review.reassignHint} checked={prefs.reassign} disabled={!editable} onChange={(v) => setPrefs({ ...prefs, reassign: v })} />
      </section>
    </>
  );
}

export function NotificationAndTeamSettings() {
  const me = useIdentity();
  const rights = can(me.adminRole);
  const [prefs, setPrefs] = useState({ reminders: true, approvals: true, weekly: false });
  const [timeout, setTimeoutValue] = useState(copy.notifications.timeouts[1]);
  return (
    <>
      <section className={styles.card} id="notifications-settings" aria-labelledby="settings-notifications">
        <h2 id="settings-notifications" className={styles.title}>
          {copy.notifications.title}
        </h2>
        <p className={styles.note}>{copy.notifications.deliveryNote}</p>
        <Toggle label={copy.notifications.reminders} hint={copy.notifications.remindersHint} checked={prefs.reminders} onChange={(v) => setPrefs({ ...prefs, reminders: v })} />
        <Toggle label={copy.notifications.approvals} hint={copy.notifications.approvalsHint} checked={prefs.approvals} onChange={(v) => setPrefs({ ...prefs, approvals: v })} />
        <Toggle label={copy.notifications.weekly} hint={copy.notifications.weeklyHint} checked={prefs.weekly} onChange={(v) => setPrefs({ ...prefs, weekly: v })} />
        <div className={styles.fields}>
          <Select
            id="session-timeout"
            label={copy.notifications.timeout}
            options={copy.notifications.timeouts.map((t) => ({ value: t, label: t }))}
            value={timeout}
            onChange={(e) => setTimeoutValue(e.target.value)}
          />
        </div>
      </section>

      <section className={styles.bar} aria-labelledby="settings-team">
        <div>
          <h2 id="settings-team" className={styles.subtitle}>
            {copy.team.title}
          </h2>
          <p>{rights?.seeManageTeam ? copy.team.text : copy.team.teamMemberText}</p>
        </div>
        {rights?.seeManageTeam && <ButtonLink href={`${base}${adminScreens['manage-team'].path}`}>{copy.team.open}</ButtonLink>}
      </section>
    </>
  );
}
