import type { Metadata } from 'next';
import { adminRoles } from '../../../shared/content/admin-roles';
import { DataTable } from '../../components/data/DataTable';
import { MetricTile } from '../../components/data/MetricTile';
import { Toast } from '../../components/feedback/Toast';
import { Checkbox } from '../../components/forms/Checkbox';
import { SearchField } from '../../components/forms/SearchField';
import { Select } from '../../components/forms/Select';
import { TextInput } from '../../components/forms/TextInput';
import { Textarea } from '../../components/forms/Textarea';
import { RolesPolicy } from '../../components/content/RolesPolicy';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DisclosureLabel } from '../../components/ui/DisclosureLabel';
import { IconButton } from '../../components/ui/IconButton';
import { ReviewStatePanel } from '../_review/ReviewShared';
import styles from './dev.module.css';

export const metadata: Metadata = {
  title: 'Component Preview · Cuidance Admin Web',
};

const dashboardHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`;

// Example wording for the state panels on this preview page only
const devStateMessages = {
  loading: 'Loading example items…',
  empty: 'Nothing to show in this example.',
  emptyAction: 'Go to Dashboard',
  error: "Couldn't load example items. Check your connection, then reload the page.",
};

// Internal, static preview of the approved components. Not linked from navigation.
export default function ComponentPreviewPage() {
  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Internal preview"
        title="Component Preview"
        description="Internal Admin Web development screen. It previews the approved components and their states, isn't linked from navigation, and isn't part of participant testing. Switch your device to dark mode to check dark states."
        actions={
          <>
            <Button variant="secondary">Export</Button>
            <Button variant="secondary">Create task</Button>
          </>
        }
      />

      <Card title="Buttons">
        <p className={styles.note}>Hover and pressed states respond to the pointer. One primary button per screen.</p>
        <div className={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className={styles.row}>
          <Button variant="primary" disabled>
            Primary
          </Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
        </div>
        <p className={styles.note}>Disabled buttons need their reason shown nearby.</p>
      </Card>

      <Card title="Icon buttons">
        <div className={styles.row}>
          <IconButton icon="?" label="Help" />
          <IconButton icon="‹" label="Back" />
          <IconButton icon="‹" label="Back (disabled)" disabled />
        </div>
      </Card>

      <Card title="Disclosure labels">
        <div className={styles.row}>
          <DisclosureLabel kind="partner" />
          <DisclosureLabel kind="sponsored" />
        </div>
      </Card>

      <Card title="Text fields">
        <div className={styles.grid}>
          <TextInput id="dev-input-default" label="Question ID" placeholder="Q-1042" helper="Shown in review tasks." />
          <TextInput
            id="dev-input-error"
            label="Source link"
            defaultValue="example"
            error="Enter a full link, like https://example.org."
          />
          <TextInput id="dev-input-disabled" label="Created by" defaultValue="System" disabled />
          <Select
            id="dev-select"
            label="Care area"
            options={[
              { value: 'skin', label: 'Skin' },
              { value: 'hair', label: 'Hair' },
              { value: 'makeup', label: 'Makeup' },
              { value: 'body', label: 'Body' },
            ]}
          />
          <Textarea id="dev-textarea" label="Review note" helper="Plain language. No diagnosis or medical advice." />
          <SearchField id="dev-search" label="Search content" placeholder="Search by title or ID" />
        </div>
      </Card>

      <Card title="Checkboxes">
        <Checkbox id="dev-check-default" label="Source checked against the original" />
        <Checkbox id="dev-check-checked" label="Partner label is visible" defaultChecked />
        <Checkbox id="dev-check-error" label="Safety line reviewed" error="Confirm the safety line before approving." />
        <Checkbox id="dev-check-disabled" label="Locked by another reviewer" disabled />
        <Checkbox id="dev-check-consent" label="I agree to the review guidelines" consent />
        <p className={styles.note}>Consent checkboxes always start unchecked.</p>
      </Card>

      <section className={styles.section} aria-labelledby="dev-metrics">
        <h2 id="dev-metrics" className={styles.sectionTitle}>
          Metric tiles
        </h2>
        <div className={styles.tiles}>
          <MetricTile label="Needs review" value="14" note="Across all content areas" />
          <MetricTile label="Approved" value="128" note="In the last 30 days" />
          <MetricTile label="Partner items" value="5" />
        </div>
      </section>

      <DataTable
        caption="Review queue (static example)"
        columns={[
          { key: 'task', header: 'Task' },
          { key: 'type', header: 'Type' },
          { key: 'status', header: 'Status' },
          { key: 'due', header: 'Due', align: 'end' },
        ]}
        rows={[
          { id: 'r1', cells: { task: 'Quiz question needs internal review', type: 'Quiz', status: 'Needs review', due: 'Oct 28' } },
          { id: 'r2', cells: { task: 'Product summary pending approval', type: 'Product', status: 'Needs review', due: 'Oct 29' } },
          { id: 'r3', cells: { task: 'Source check needed', type: 'Source', status: 'Revision needed', due: 'Oct 30' } },
        ]}
        selectedRowId="r1"
      />

      <DataTable
        caption="Team access (static internal pattern)"
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'role', header: 'Role' },
          { key: 'access', header: 'Access' },
        ]}
        rows={adminRoles.map((role, index) => ({
          id: role.id,
          cells: { name: `Team member ${String.fromCharCode(65 + index)}`, role: role.name, access: role.summary },
        }))}
      />

      <section className={styles.section} aria-labelledby="dev-roles">
        <h2 id="dev-roles" className={styles.sectionTitle}>
          Roles policy card
        </h2>
        <p className={styles.note}>The same static card shown in Settings, with the shared role wording.</p>
        <RolesPolicy headingLevel={3} />
      </section>

      <section className={styles.section} aria-labelledby="dev-card">
        <h2 id="dev-card" className={styles.sectionTitle}>
          Card and panel
        </h2>
        <Card as="div" title="Example card">
          <p className={styles.note}>
            A bordered surface for grouped content, with the 16 px radius. Cards and panels are the same pattern.
          </p>
        </Card>
      </section>

      <section className={styles.section} aria-labelledby="dev-states">
        <h2 id="dev-states" className={styles.sectionTitle}>
          Loading, empty and error states
        </h2>
        <p className={styles.note}>
          Static examples with the approved Week 8 symbols. Empty and Loading are provisional on the board.
        </p>
        <ReviewStatePanel
          state="loading"
          messages={devStateMessages}
          emptyActionHref={dashboardHref}
        />
        <ReviewStatePanel
          state="empty"
          messages={devStateMessages}
          emptyActionHref={dashboardHref}
        />
        <ReviewStatePanel
          state="error"
          messages={devStateMessages}
          emptyActionHref={dashboardHref}
        />
      </section>

      <Card title="Toasts">
        <Toast tone="success" message="Saved to the review queue" action={{ label: 'View' }} />
        <Toast tone="error" message="Couldn't save. Check your connection." action={{ label: 'Retry' }} />
        <p className={styles.note}>
          Toast actions show as plain text in this static preview. They become links once a real page exists to go to.
        </p>
      </Card>
    </main>
  );
}
