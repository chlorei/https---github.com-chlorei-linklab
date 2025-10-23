// app/privacy/page.tsx
const COMPANY = "Relinxr GmbH";
const CONTACT_EMAIL = "netsjapo@gmail.com";
const REGISTERED_ADDRESS = "Hamburg, Germany";

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh mt-30">
      <div className="mx-auto max-w-6xl px-4 mt-8 md:mt-12">
        {/* Заголовок страницы */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary-text">Privacy Policy</h1>
          <p className="mt-1 text-sm opacity-70">for Relinxr — URL shortening & analytics service</p>
          <p className="mt-1 text-xs opacity-50">
            Last updated: <time dateTime="2025-10-24">October 24, 2025</time>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
          {/* TOC — мобилки (чипы) */}
          <nav aria-label="Contents" className="md:hidden rounded-2xl border p-3">
            <div className="text-xs font-medium opacity-80">Contents</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tocItems.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-full border px-3 py-1 text-xs opacity-80 hover:opacity-100 transition"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>

          {/* TOC — десктоп (липкий) */}
          <aside className="sticky top-6 hidden h-fit md:block">
            <nav aria-label="Contents" className="rounded-2xl border p-4">
              <div className="mb-2 text-sm font-semibold opacity-80">Contents</div>
              <ul className="space-y-1 text-sm">
                {tocDesktop.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="block rounded-lg px-2 py-1 opacity-70 hover:opacity-100 hover:border transition border border-transparent hover:border"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* BODY */}
          <section className="space-y-8">
            <Card id="intro" title="1. Introduction">
              <p>
                Relinxr (“<strong>we</strong>”, “<strong>us</strong>”, “<strong>our</strong>”) is a URL
                shortening and analytics service designed to collect minimal telemetry for link performance.
                By using Relinxr (the “<strong>Service</strong>”), you agree to this Privacy Policy.
              </p>
              <Note>
                Relinxr is intended to operate with <em>minimal personal data</em>. We do not sell personal
                information.
              </Note>
            </Card>

            <Card id="scope" title="2. Scope & Controller">
              <p>This Policy applies to our website, web app, APIs and services.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-1 opacity-80">Data Controller</h3>
                  <p>
                    {COMPANY} <br />
                    {REGISTERED_ADDRESS} <br />
                    Email:{" "}
                    <a className="underline hover:opacity-100 opacity-90" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 opacity-80">EU/EEA Compliance</h3>
                  <p className="opacity-90">
                    We process personal data in accordance with the GDPR (EU) 2016/679 and applicable member-state
                    laws.
                  </p>
                </div>
              </div>
            </Card>

            <Card id="data-we-collect" title="3. Information We Collect">
              <h3 className="mb-1 opacity-80">(a) Information you provide</h3>
              <UL>
                <li>
                  <strong>Account data</strong> (if you register): email, hashed password, display name.
                </li>
                <li>
                  <strong>Content data</strong>: links you create, titles/labels, tags, workspaces.
                </li>
                <li>
                  <strong>Support</strong>: messages you send to us, bug reports, feature requests.
                </li>
              </UL>

              <h3 className="mt-4 mb-1 opacity-80">(b) Data collected automatically</h3>
              <UL>
                <li>
                  <strong>Visit events</strong> on Relinxr links: truncated/anonymized IP (e.g.,{" "}
                  <code>192.168.xxx.xxx</code>), user-agent, timestamp, referrer (if provided).
                </li>
                <li>
                  <strong>Service logs</strong>: limited diagnostics (error codes, request paths). Logs are rotated and
                  retained briefly.
                </li>
              </UL>

              <h3 className="mt-4 mb-1 opacity-80">(c) Cookies and local storage</h3>
              <p className="opacity-90">
                We use essential cookies/session tokens strictly to keep you signed in and secure the Service. We do
                not use third-party advertising cookies.
              </p>

              <h3 className="mt-4 mb-1 opacity-80">(d) No special categories</h3>
              <p className="opacity-90">
                We do not intentionally collect sensitive categories (e.g., health, political opinions). Please do not
                submit such data.
              </p>
            </Card>

            <Card id="cookies" title="4. Cookies & Similar Technologies">
              <p>
                Relinxr uses <strong>strictly necessary</strong> cookies or local storage for authentication and
                security. Where required by law, we display a concise consent banner and store your choice.
              </p>
              <Table
                head={["Name", "Purpose", "Type", "Retention"]}
                rows={[
                  ["session", "Authenticate user, prevent CSRF", "Strictly necessary", "Session only"],
                  ["cookieConsent", "Remember consent choice", "Preference", "12 months"],
                ]}
              />
              <p className="mt-2 opacity-90">
                You can clear cookies any time in your browser. Disabling essential cookies may break sign-in.
              </p>
            </Card>

            <Card id="purposes" title="5. How We Use Data">
              <UL>
                <li>Provide and operate the Service (create/resolve short links, show analytics).</li>
                <li>Secure the Service, detect fraud/abuse, and prevent misuse.</li>
                <li>Improve performance, reliability, and features based on aggregate usage.</li>
                <li>Communicate about updates, security notices, support responses.</li>
                <li>Comply with legal obligations and enforce our Terms.</li>
              </UL>
            </Card>

            <Card id="legal-bases" title="6. Legal Bases (GDPR)">
              <UL>
                <li>Contract — to provide the Service you requested.</li>
                <li>Legitimate interests — to secure, maintain and improve the Service (balanced against your rights).</li>
                <li>Consent — for optional cookies or communications, where required.</li>
                <li>Legal obligation — to comply with applicable laws.</li>
              </UL>
            </Card>

            <Card id="retention" title="7. Data Retention">
              <UL>
                <li>Link analytics: kept while the link exists, or until you delete it.</li>
                <li>Service logs: typically 7–30 days unless investigating incidents.</li>
                <li>Account data: while your account is active; deleted/anonymized after closure (subject to legal holds).</li>
              </UL>
              <Note tone="warn">
                <strong>IP anonymization:</strong> we store truncated/anonymized IPs by default. Full IPs may appear
                transiently in security logs but are not persisted beyond short-term rotation unless required for abuse
                mitigation.
              </Note>
            </Card>

            <Card id="sharing" title="8. Sharing & Sub-processors">
              <p>
                We do not sell personal data. We may share limited information with trusted providers (“sub-processors”)
                who host, store and secure the Service, under our instructions and confidentiality commitments:
              </p>
              <UL>
                <li>Hosting & Build (e.g., Vercel)</li>
                <li>Database (e.g., MongoDB Atlas)</li>
                <li>Optional CDN/edge (e.g., Cloudflare), if enabled</li>
              </UL>
              <p>We may disclose information if required by law, to protect rights and safety, or to investigate abuse.</p>
            </Card>

            <Card id="transfers" title="9. International Data Transfers">
              <p>
                Where personal data is transferred outside the EU/EEA, we use appropriate safeguards such as the
                European Commission’s Standard Contractual Clauses (SCCs) and, where relevant, supplementary measures.
              </p>
            </Card>

            <Card id="security" title="10. Security">
              <UL>
                <li>Encryption in transit (HTTPS/TLS); encryption at rest where supported.</li>
                <li>Least-privilege access; production access controls and auditability.</li>
                <li>Secure development; dependency patching; rate limiting and abuse detection.</li>
              </UL>
              <p>No method of transmission or storage is 100% secure, but we use industry-standard safeguards.</p>
            </Card>

            <Card id="rights" title="11. Your Rights (GDPR)">
              <p>Subject to conditions and exceptions, you have the right to:</p>
              <UL>
                <li>Access — know whether we process your personal data and obtain a copy.</li>
                <li>Rectification — correct inaccurate or incomplete data.</li>
                <li>Erasure — request deletion (“right to be forgotten”).</li>
                <li>Restriction — limit processing in certain cases.</li>
                <li>Portability — receive data in a machine-readable format.</li>
                <li>Objection — object to processing based on legitimate interests.</li>
                <li>Withdraw consent — where processing relies on consent.</li>
                <li>Lodge a complaint — with your local supervisory authority.</li>
              </UL>
              <p>
                To exercise rights, contact us at{" "}
                <a className="underline hover:opacity-100 opacity-90" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
                . We may need to verify your identity.
              </p>
            </Card>

            <Card id="children" title="12. Children">
              <p>
                The Service is not directed to children under 13 (or the age of digital consent in your country). We do
                not knowingly collect personal data from children. If you believe a child has provided data, contact us
                for deletion.
              </p>
            </Card>

            <Card id="dnt" title="13. Do Not Track">
              <p>
                We do not respond to browser “Do Not Track” signals. We minimize tracking by design and do not use
                third-party advertising trackers.
              </p>
            </Card>

            <Card id="automated" title="14. Automated Decision-Making">
              <p>We do not engage in automated decision-making that produces legal or similarly significant effects.</p>
            </Card>

            <Card id="changes" title="15. Changes to this Policy">
              <p>
                We may update this Policy from time to time. Material changes will be indicated by updating the “Last
                updated” date and, where appropriate, additional notice.
              </p>
            </Card>

            <Card id="contact" title="16. Contact">
              <p>
                Questions, requests, or complaints can be sent to:{" "}
                <a className="underline hover:opacity-100 opacity-90" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
              <p>Postal address: {REGISTERED_ADDRESS}</p>
            </Card>

            <Card id="annex" title="Annex A — Sub-processors">
              <Table
                head={["Vendor", "Service", "Region", "Safeguards"]}
                rows={[
                  ["Vercel Inc.", "Hosting/build/deploy", "EU/EEA & US (as configured)", "SCCs, DPA, security certs"],
                  ["MongoDB Atlas", "Managed database", "EU region (as configured)", "SCCs, DPA, encryption at rest"],
                  ["Cloudflare, Inc. (optional)", "CDN/DDoS/edge security", "Global network", "SCCs, DPA"],
                ]}
              />
              <p className="mt-2 text-sm opacity-70">
                We will update this Annex when materially changing or adding sub-processors.
              </p>
            </Card>

            <div className="rounded-2xl border p-4 text-sm opacity-70">
              © 2025 {COMPANY} — All rights reserved.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ---------- helpers ---------- */
const tocItems: [string, string][] = [
  ["#intro", "Intro"],
  ["#scope", "Scope"],
  ["#data-we-collect", "Data"],
  ["#cookies", "Cookies"],
  ["#purposes", "Use"],
  ["#legal-bases", "Legal bases"],
  ["#retention", "Retention"],
  ["#sharing", "Sharing"],
  ["#transfers", "Transfers"],
  ["#security", "Security"],
  ["#rights", "Rights"],
  ["#children", "Children"],
  ["#dnt", "DNT"],
  ["#automated", "Automated"],
  ["#changes", "Changes"],
  ["#contact", "Contact"],
  ["#annex", "Sub-processors"],
];
const tocDesktop: [string, string][] = [
  ["#intro", "1. Introduction"],
  ["#scope", "2. Scope & Controller"],
  ["#data-we-collect", "3. Information We Collect"],
  ["#cookies", "4. Cookies & Similar Tech"],
  ["#purposes", "5. How We Use Data"],
  ["#legal-bases", "6. Legal Bases (GDPR)"],
  ["#retention", "7. Retention"],
  ["#sharing", "8. Sharing & Sub-processors"],
  ["#transfers", "9. International Transfers"],
  ["#security", "10. Security"],
  ["#rights", "11. Your Rights"],
  ["#children", "12. Children"],
  ["#dnt", "13. Do Not Track"],
  ["#automated", "14. Automated Decisions"],
  ["#changes", "15. Changes"],
  ["#contact", "16. Contact"],
  ["#annex", "Annex A — Sub-processors"],
];

function Card({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border p-5">
      <h2 className="text-xl font-semibold text-primary-text">{title}</h2>
      <div className="prose prose-invert mt-3 max-w-none">{children}</div>
    </section>
  );
}

function Note({
  children,
  tone = "ok",
}: {
  children: React.ReactNode;
  tone?: "ok" | "warn" | "danger";
}) {
  const border =
    tone === "warn" ? "border-amber-500" : tone === "danger" ? "border-red-500" : "border-emerald-500";
  return <div className={`mt-3 rounded-xl border-l-4 ${border} p-3`}>{children}</div>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6">{children}</ul>;
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full border-collapse text-sm">
        <thead className="">
          <tr>
            {head.map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <Td key={j}>{c}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-left text-xs opacity-80">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-top">{children}</td>;
}