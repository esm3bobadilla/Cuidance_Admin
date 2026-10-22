import type { Metadata } from 'next';
import { DataTable } from '../../components/data/DataTable';
import { MetricTile } from '../../components/data/MetricTile';
import { Toast } from '../../components/feedback/Toast';
import { Checkbox } from '../../components/forms/Checkbox';
import { SearchField } from '../../components/forms/SearchField';
import { Select } from '../../components/forms/Select';
import { TextInput } from '../../components/forms/TextInput';
import { Textarea } from '../../components/forms/Textarea';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DisclosureLabel } from '../../components/ui/DisclosureLabel';
import { IconButton } from '../../components/ui/IconButton';
import styles from './dev.module.css';

export const metadata: Metadata = {
  title: 'Component preview · Cuidance Admin Web',
};

// Internal, static preview of the approved components. Not linked from navigation.
export default function ComponentPreviewPage() {
  return (
    <main className={styles.page}>
      <PageHeader
        wayfinding={<Breadcrumb items={[{ label: 'Admin', href: '/' }, { label: 'Component preview' }]} />}
        eyebrow="Internal preview"
        title="Component preview"
        description="Approved Admin Web components and their states. Switch your device to dark mode to check dark states."
        actions={
          <>
            <Button variant="secondary">Export</Button>
            <Button variant="primary">Create task</Button>
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
          <IconButton icon="⌕" label="Search" />
          <IconButton icon="✎" label="Edit" />
          <IconButton icon="✎" label="Edit (disabled)" disabled />
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
        rows={[
          { id: 't1', cells: { name: 'Team member A', role: 'Admin', access: 'All content' } },
          { id: 't2', cells: { name: 'Team member B', role: 'Reviewer', access: 'Quiz and guidance' } },
        ]}
      />

      <Card title="Toasts">
        <Toast tone="success" message="Saved to the review queue" action={{ label: 'View', href: '#' }} />
        <Toast tone="error" message="Couldn't save. Check your connection." action={{ label: 'Retry', href: '#' }} />
      </Card>
    </main>
  );
}
