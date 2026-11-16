'use client';

import { useState } from 'react';
import { cuIcons, type CuIconName } from '../../../shared/brand/icons/cu-icons';
import heroContent from '../../../shared/brand/heroes/hero-content.jpg';
import { UploadField, type UploadValue } from '../../components/forms/UploadField';
import { Dialog } from '../../components/overlay/Dialog';
import { Drawer } from '../../components/overlay/Drawer';
import { Popover } from '../../components/overlay/Popover';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { CuIcon } from '../../components/ui/CuIcon';
import { HeroBanner } from '../../components/ui/HeroBanner';
import { Tabs } from '../../components/ui/Tabs';
import { Toggle } from '../../components/ui/Toggle';
import styles from './dev.module.css';

// Phase B1 foundation components, previewed with example wording only
export function FoundationPreview() {
  const [drawer, setDrawer] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [chips, setChips] = useState<Record<string, boolean>>({ draft: true, review: false, approved: false });
  const [toggle, setToggle] = useState(false);
  const [upload, setUpload] = useState<UploadValue>(null);
  const [tried, setTried] = useState(false);

  return (
    <>
      <HeroBanner
        headingLevel={2}
        eyebrow="Example hero"
        title="Create and manage guidance"
        description="Draft, organize, review and publish trusted care content across Cuidance."
        image={heroContent}
      />

      <Card title="Icons (cu-icons)">
        <ul className={styles.iconGrid}>
          {(Object.keys(cuIcons) as CuIconName[]).map((name) => (
            <li key={name} className={styles.iconCell}>
              <CuIcon name={name} variant="badge" size={34} />
              <CuIcon name={name} size={20} />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Tabs">
        <Tabs
          label="Example metrics"
          tabs={[
            { id: 'app', label: 'App', content: <p>App panel (example).</p> },
            { id: 'web', label: 'Website', content: <p>Website panel (example).</p> },
            { id: 'comms', label: 'Communication', content: <p>Communication panel (example).</p> },
          ]}
        />
      </Card>

      <Card title="Chips and toggle">
        <div className={styles.previewRow}>
          {Object.entries({ draft: 'Draft', review: 'In review', approved: 'Approved' }).map(([key, label]) => (
            <Chip key={key} label={label} selected={chips[key]} onClick={() => setChips({ ...chips, [key]: !chips[key] })} />
          ))}
          <Chip label="Unavailable" selected={false} disabled />
        </div>
        <Toggle label="Example setting" hint="Shows On or Off in the switch as well as color." checked={toggle} onChange={setToggle} />
      </Card>

      <Card title="Popover, drawer and dialog">
        <div className={styles.previewRow}>
          <Popover trigger="What is this?" label="Example help">
            Popovers hold short help or quick options. Escape or a click outside closes them.
          </Popover>
          <Button onClick={() => setDrawer(true)}>Open drawer</Button>
          <Button onClick={() => setDialog(true)}>Open dialog</Button>
        </div>
      </Card>

      <Card title="Upload field">
        <UploadField label="Header image (example)" value={upload} onChange={setUpload} showErrors={tried} />
        <div className={styles.previewRow}>
          <Button onClick={() => setTried(true)}>Check required fields</Button>
        </div>
      </Card>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        eyebrow="Example workspace"
        title="Example drawer"
        description="Side drawers hold filters and editors."
        footer={
          <>
            <Button onClick={() => setDrawer(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setDrawer(false)}>
              Apply
            </Button>
          </>
        }
      >
        <p>Drawer content (example).</p>
      </Drawer>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        tone="alert"
        title="Discard this draft?"
        actions={
          <>
            <Button onClick={() => setDialog(false)}>Keep editing</Button>
            <Button variant="primary" onClick={() => setDialog(false)}>
              Discard
            </Button>
          </>
        }
      >
        Example confirmation. Nothing is deleted on this preview page.
      </Dialog>
    </>
  );
}
