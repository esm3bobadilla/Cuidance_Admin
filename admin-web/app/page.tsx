type ContentArea = {
  name: string;
  description: string;
};

const contentAreas: ContentArea[] = [
  { name: 'Quiz content', description: 'Questions, answer cards and mixing rules.' },
  { name: 'Guidance content', description: 'Result sections and guidance copy.' },
  { name: 'Product information', description: 'Product types for Barcode / Label Lookup.' },
  { name: 'Sources', description: 'Source links behind each guidance claim.' },
  { name: 'Partner highlights', description: 'Commercial content, always labeled "Partner."' },
  { name: 'Claims', description: 'Evidence labels: Strong, Moderate, Limited or Assumption.' },
  { name: 'Safety notes', description: 'Safety lines and the emergency line on every result.' },
];

export default function DashboardPage() {
  return (
    <main className="shell">
      <header className="intro">
        <p className="eyebrow">Internal tool</p>
        <h1 className="page-title">Cuidance Admin Web</h1>
        <p className="lead">
          A place for the Cuidance team to review and maintain the content behind the public
          Cuidance mobile app.
        </p>
        <p className="note">
          Practice build placeholder. Nothing here is connected to data yet, and these screens are
          not part of participant testing.
        </p>
      </header>

      <section className="section" aria-labelledby="areas-heading">
        <h2 id="areas-heading" className="section-title">Content areas</h2>
        <ul className="areas">
          {contentAreas.map((area) => (
            <li key={area.name} className="area">
              <h3 className="area-title">{area.name}</h3>
              <p className="area-description">{area.description}</p>
              <p className="area-status">Not built yet</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
