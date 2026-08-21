// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {Guide} from 'content/types';

const zeroTrust: Guide = {
    id: 'zero-trust',
    title: 'Zero Trust',
    heroTitle: 'Zero Trust with Mattermost',
    subtitle: 'A conceptual tour of Mattermost security across the five pillars of the CISA Zero Trust Maturity Model — identity, devices, networks, applications, and data — and what it takes to climb from Foundation to Optimal in each one.',
    description: 'Map Mattermost security capabilities to the five CISA Zero Trust pillars, tier by tier.',
    icon: 'shield-outline',
    audiences: ['admin'],
    doneTitle: 'You can place Mattermost on your Zero Trust map',
    doneSummary: 'You\'ve walked the five CISA pillars and the Foundation, Advanced, and Optimal tiers inside each one. Use these references to go deeper on any capability you flagged as a gap:',
    doneLinks: [
        {label: 'Zero Trust with Mattermost', href: 'https://docs.mattermost.com/security-guide/zero-trust.html'},
        {label: 'Set up attribute-based access controls', href: 'https://docs.mattermost.com/administration-guide/manage/admin/attribute-based-access-control.html'},
        {label: 'Mobile security features', href: 'https://docs.mattermost.com/deployment-guide/mobile/mobile-security-features.html'},
        {label: 'Air-gapped deployment', href: 'https://docs.mattermost.com/deployment-guide/reference-architecture/deployment-scenarios/air-gapped-deployment.html'},
        {label: 'High availability cluster deployment', href: 'https://docs.mattermost.com/administration-guide/scale/high-availability-cluster-based-deployment.html'},
        {label: 'FIPS 140-3 and encryption options', href: 'https://docs.mattermost.com/deployment-guide/server/containers/fips-stig.html'},
        {label: 'STIG-hardened image and DoD IA standards', href: 'https://docs.mattermost.com/deployment-guide/server/deploy-containers.html'},
        {label: 'Compliance export', href: 'https://docs.mattermost.com/administration-guide/comply/compliance-export.html'},
        {label: 'Content flagging and data spillage', href: 'https://docs.mattermost.com/administration-guide/manage/admin/content-flagging.html'},
        {label: 'Sovereign AI implementation', href: 'https://docs.mattermost.com/agents/docs/sovereign_ai.html'},
        {label: 'CMMC compliance', href: 'https://docs.mattermost.com/security-guide/cmmc-compliance.html'},
        {label: 'Talk to a Mattermost Zero Trust expert', href: 'https://mattermost.com/contact-sales/'},
    ],
    modules: [
        {
            id: 'zero-trust-basics',
            navTitle: 'Zero Trust Basics',
            icon: 'shield-outline',
            minutes: 4,
            title: 'Zero Trust in five minutes',
            summary: 'Zero Trust is not a product you install or a checklist you finish. It is a model in which every request is verified continuously, at every layer. This module sets up the vocabulary — five pillars, three tiers — that the rest of the guide uses.',
            steps: [
                {
                    title: 'Continuous enforcement, not bolted-on controls',
                    description: 'The perimeter model trusts anyone who made it inside the network. Zero Trust assumes the attacker is already inside, so it verifies every request against current conditions instead of a decision made at login. Mattermost implements this as a <strong>continuous enforcement model</strong> rather than a set of security features layered on after the fact.',
                },
                {
                    title: 'Collaboration is in scope',
                    description: 'Security programs tend to focus on systems of record and forget the place where people actually discuss them. Messages, files, calls, and incident runbooks carry the same sensitive content as the databases they describe — which is why Mattermost applies identity, device, network, application, and data controls to collaboration itself.',
                },
                {
                    title: 'Five pillars organize the work',
                    description: 'This guide follows the five pillars of the <a href="https://www.cisa.gov/zero-trust-maturity-model">CISA Zero Trust Maturity Model</a>: <strong>identity</strong>, <strong>devices</strong>, <strong>networks</strong>, <strong>applications and workloads</strong>, and <strong>data</strong>. Each of the next five modules covers one pillar. Nothing is Zero Trust on its own — the model only holds when all five reinforce each other.',
                },
                {
                    title: 'Maturity is a ladder, not a switch',
                    description: 'CISA grades each pillar from <strong>Traditional</strong> through <strong>Initial</strong>, <strong>Advanced</strong>, and <strong>Optimal</strong>. Inside every pillar module you will see three tiers — <strong>Foundation</strong>, <strong>Advanced</strong>, and <strong>Optimal</strong> — describing what Mattermost enables as you climb. Read them in order; the higher tiers assume the lower ones are already in place.',
                    tip: 'You can sit at different maturity levels in different pillars, and most organizations do. The final module turns the ladder into a self-assessment.',
                },
                {
                    title: 'Read the edition badges',
                    description: 'Nearly every capability in this guide is <strong>Enterprise</strong> or <strong>Enterprise Advanced</strong>, and each one carries a badge saying which. Capabilities outside your current edition are still worth knowing — they tell you what the next tier of your Zero Trust roadmap could look like. See <a href="https://docs.mattermost.com/product-overview/editions-and-offerings.html">editions and offerings</a> for what your license includes.',
                },
            ],
        },
        {
            id: 'identity',
            navTitle: 'Identity',
            icon: 'key-variant',
            minutes: 6,
            title: 'Identity: verify the user, not just the login',
            summary: 'Zero Trust requires that every user be verified continuously, not once at sign-in. Mattermost integrates with enterprise Identity, Credential, and Access Management platforms so access decisions follow the user\'s current attributes rather than the role they held on their first day.',
            tiers: [
                {
                    label: 'Foundation: federated authentication and directory sync',
                    summary: 'Retire locally managed passwords in favour of your identity provider, and let the directory keep access rights current on its own.',
                    items: [
                        {
                            name: 'Single Sign-On',
                            edition: 'Enterprise',
                            description: 'SAML 2.0 and OpenID Connect with Okta, Microsoft ADFS, Entra ID, OneLogin, and GitLab. Accounts and attributes are created and synchronized on first login, so there are no standalone Mattermost credentials to steal.',
                        },
                        {
                            name: 'AD/LDAP user sync',
                            edition: 'Enterprise',
                            description: 'Continuously synchronizes user attributes and group memberships from Active Directory or LDAP. Disable someone in the directory and <strong>their Mattermost access is revoked automatically on the next sync cycle</strong> — no separate offboarding step to forget.',
                        },
                        {
                            name: 'Role-based granular access controls',
                            edition: 'Enterprise',
                            description: 'System, Team, and Channel Admin roles with fine-grained permission scopes. Roles can be driven from AD/LDAP so permissions track organizational policy instead of drifting from it.',
                        },
                        {
                            name: 'Multi-factor authentication and session management',
                            edition: 'Enterprise',
                            description: 'TOTP second factor compatible with Google Authenticator, Microsoft Authenticator, and FreeOTP, enforced platform-wide or delegated to the identity provider. Session lifetimes and inactivity revocation shrink the window in which a stolen token is useful.',
                        },
                        {
                            name: 'Custom profile attributes',
                            edition: 'Enterprise',
                            description: 'Admin-managed metadata such as clearance level, program affiliation, location, and role. These attributes are the raw material for every policy in the Advanced and Optimal tiers, so getting them right early pays off later.',
                        },
                        {
                            name: 'Guest accounts',
                            edition: 'Enterprise',
                            description: 'External collaborators get scoped access to named channels only, and cannot discover other channels or teams. Magic links give guests passwordless, expiring access instead of shared credentials.',
                        },
                    ],
                },
                {
                    label: 'Advanced: attribute-based and continuously evaluated access',
                    summary: 'Role-based controls give way to attribute-based policies that adapt to a user\'s current context rather than the role they were provisioned with.',
                    items: [
                        {
                            name: 'Advanced access controls',
                            edition: 'Enterprise Advanced',
                            description: 'Combines RBAC system and team override schemes with <strong>Attribute-Based Access Control (ABAC)</strong> expressed in Common Expression Language (CEL), so authorization can depend on context rather than a static role assignment.',
                        },
                        {
                            name: 'Channel membership policies',
                            edition: 'Enterprise Advanced',
                            description: 'Policies are evaluated continuously against user attributes. As a profile changes, users are added to matching channels automatically. On private channels, members who no longer match are removed; on public channels the policy is advisory and surfaces matching channels as recommendations.',
                        },
                        {
                            name: 'Team membership policies',
                            edition: 'Enterprise Advanced',
                            description: 'The same continuous evaluation applies at the team boundary. On private teams, users who stop matching are removed from the team and its channels; on public teams the policy highlights the team to qualifying users without removing anyone.',
                        },
                    ],
                },
                {
                    label: 'Optimal: dynamic enforcement synchronized from ICAM',
                    summary: 'Access is evaluated in real time against authoritative sources, and no trust is assumed to persist between sessions.',
                    items: [
                        {
                            name: 'Dynamic attribute-based access controls',
                            edition: 'Enterprise Advanced',
                            description: 'Manual role management disappears. Policies evaluate clearance level, program affiliation, device type, and network location, sourced from multiple authoritative systems and applied dynamically.',
                        },
                        {
                            name: 'User Authoritative Source Interface',
                            edition: 'Enterprise Advanced',
                            description: 'For government organizations running a secure User Authoritative Source, Mattermost queries individual clearances <strong>on demand at access time</strong> instead of storing a local copy that can go stale.',
                        },
                    ],
                },
            ],
            steps: [
                {
                    title: 'Attributes come before policies',
                    description: 'ABAC is only as good as the vocabulary it evaluates. Decide which custom profile attributes describe your organization — clearance, program, nationality, duty location — and agree on who owns each one before writing a single policy expression.',
                    tip: 'Attributes that arrive by directory sync are safer to build policy on than attributes a human maintains by hand.',
                },
                {
                    title: 'Know the difference between enforcing and advisory',
                    description: 'On <strong>private</strong> channels and teams, a membership policy removes people who no longer match. On <strong>public</strong> ones it only recommends. That distinction decides whether a policy is a real control or a discovery aid, so choose the channel type deliberately.',
                },
            ],
        },
        {
            id: 'devices',
            navTitle: 'Devices',
            icon: 'cellphone',
            minutes: 4,
            title: 'Devices: make endpoint health part of the decision',
            summary: 'Zero Trust treats the device as a factor in every access decision, not just the user holding it. Mattermost mobile and endpoint controls exist so that only compliant, uncompromised devices can reach sensitive conversations.',
            tiers: [
                {
                    label: 'Foundation: managed device deployment',
                    summary: 'Get the app onto devices under your management, and stop content from leaking through infrastructure you do not control.',
                    items: [
                        {
                            name: 'Enterprise Mobility Management (AppConfig)',
                            edition: 'Enterprise',
                            description: 'Deploy the mobile app through any EMM provider using the AppConfig standard. Server URLs, authentication settings, AppTunnel, app-level encryption, and backup prevention are all pre-configured — without requiring full device enrollment.',
                        },
                        {
                            name: 'ID-only push notifications',
                            edition: 'Enterprise',
                            description: 'Notification payloads carry an opaque message ID instead of message text. The app fetches the real content from your server over an encrypted connection, so <strong>Apple and Google notification infrastructure never sees message content</strong>.',
                        },
                    ],
                },
                {
                    label: 'Advanced: device posture enforcement',
                    summary: 'Add a hardware-anchored check at the app boundary and keep work data from crossing into personal apps.',
                    items: [
                        {
                            name: 'Mobile biometrics',
                            edition: 'Enterprise Advanced',
                            description: 'Requires Face ID or fingerprint authentication through the device OS at each app launch. Administrators can enforce it, adding a second factor that cannot be bypassed in software.',
                        },
                        {
                            name: 'Intune MAM for iOS',
                            edition: 'Enterprise Advanced',
                            description: 'Applies Microsoft Intune App Protection Policies with identity-based controls to the iOS app, preventing data leakage between work and personal apps without full device enrollment.',
                        },
                    ],
                },
                {
                    label: 'Optimal: real-time device integrity verification',
                    summary: 'The device proves it is trustworthy at runtime, and sensitive content never comes to rest outside the app sandbox.',
                    items: [
                        {
                            name: 'Jailbreak and root detection',
                            edition: 'Enterprise Advanced',
                            description: 'Detects jailbroken iOS and rooted Android devices at runtime and blocks access automatically. A tampered device is denied <strong>regardless of valid credentials</strong> — the clearest expression of Zero Trust on the device pillar.',
                        },
                        {
                            name: 'Data-at-rest encryption',
                            edition: 'Enterprise Advanced',
                            description: 'Mandatory OS-level encryption using native iOS and Android security architecture. Data stays inside the app\'s private sandboxed container and users cannot switch the protection off.',
                        },
                        {
                            name: 'Screenshot prevention',
                            edition: 'Enterprise Advanced',
                            description: 'Blocks screenshots and screen recordings in the mobile app, enforced centrally through mobile security policies rather than left to user discretion.',
                        },
                        {
                            name: 'Secure file viewer',
                            edition: 'Enterprise Advanced',
                            description: 'Users read PDFs, images, and videos without downloading them to the device, so sensitive and classified documents stay under organizational control at all times.',
                        },
                    ],
                },
            ],
            steps: [
                {
                    title: 'A valid credential is not a trusted device',
                    description: 'The Optimal tier exists because credentials get phished and phones get rooted. Blocking a compromised device even when the password and second factor are correct is what separates device posture enforcement from device management.',
                },
                {
                    title: 'Push notifications are the quiet leak',
                    description: 'Message previews on a lock screen travel through third-party notification services and sit on a screen anyone can read. ID-only push notifications are usually the highest-value, lowest-friction change available in this pillar.',
                },
            ],
        },
        {
            id: 'networks',
            navTitle: 'Networks',
            icon: 'server-variant',
            minutes: 5,
            title: 'Networks: treat every network as hostile',
            summary: 'Zero Trust removes implicit trust in network location. Mattermost supports deployment models that assume the network is compromised — from fully air-gapped installations to federated cross-organizational channels over hardened connections.',
            tiers: [
                {
                    label: 'Foundation: self-hosted and encrypted transport',
                    summary: 'Own the placement of the platform and encrypt everything that leaves it.',
                    items: [
                        {
                            name: 'Self-hosting',
                            edition: 'Enterprise',
                            description: 'Complete data sovereignty with no dependence on public cloud infrastructure. You control network placement, access controls, and configuration end to end.',
                        },
                        {
                            name: 'Transport Layer Security',
                            edition: 'Enterprise',
                            description: 'All data in transit is encrypted, with documented TLS configuration for both direct server deployments and NGINX proxy deployments.',
                        },
                        {
                            name: 'Cloud IP filtering',
                            edition: 'Enterprise',
                            description: 'Restricts platform access to trusted network ranges for cloud deployments, so every inbound connection is checked against an allowlist before it reaches the application.',
                        },
                    ],
                },
                {
                    label: 'Advanced: resilient, distributed, and isolated deployment',
                    summary: 'Remove single points of failure, and keep collaborating when the network is degraded, disconnected, or entirely absent.',
                    items: [
                        {
                            name: 'High availability clusters',
                            edition: 'Enterprise',
                            description: 'Redundant application servers, database servers, and load balancers with inter-node state synchronization and HA for WebSocket connections, so no single component takes the platform down.',
                        },
                        {
                            name: 'Horizontal scaling and Kubernetes',
                            edition: 'Enterprise',
                            description: 'Stateless application nodes scale out behind a load balancer, with reference architectures for 5K through 50K+ concurrent users. Production Kubernetes deployments on EKS, AKS, GKE, and DigitalOcean use the Mattermost Operator and Helm for declarative, auditable infrastructure.',
                        },
                        {
                            name: 'Air-gapped and DDIL environments',
                            edition: 'Enterprise',
                            description: 'Offline installation packages, private container registries, and on-premises LDAP, PostgreSQL, and Elasticsearch with no internet dependency. Engineered for Amazon GovCloud, Azure Government Cloud including IL5, and Oracle AGC.',
                        },
                        {
                            name: 'Offline operation and smart resync',
                            edition: 'Enterprise',
                            description: 'Local collaboration continues when connectivity drops, and every message and update synchronizes automatically with zero data loss once the link returns.',
                        },
                        {
                            name: 'Federated shared channels',
                            edition: 'Enterprise',
                            description: 'Real-time message and file synchronization between separate Mattermost servers over HTTPS or VPN, enabling controlled inter-organizational information flow <strong>without merging identity namespaces</strong>.',
                        },
                    ],
                },
                {
                    label: 'Optimal: micro-segmented access with dynamic policy enforcement',
                    summary: 'The channel, not the network, becomes the security boundary — and each one enforces its own policy at entry.',
                    items: [
                        {
                            name: 'Zero Trust channel access',
                            edition: 'Enterprise Advanced',
                            description: 'Channel-level access policies authored in CEL or through a graphical interface. Entry decisions evaluate credentials, clearances, device posture, network attributes, and environmental data together.',
                        },
                        {
                            name: 'Mission partner environments',
                            edition: 'Enterprise Advanced',
                            description: 'Built for multi-national, multi-domain operations. Partner users get least-privilege guest accounts, and a DMZ topology supports external federation with defense-in-depth architecture.',
                        },
                        {
                            name: 'Ultra-high resiliency',
                            edition: 'Enterprise Advanced',
                            description: 'Up to 200,000 concurrent users on an HA cluster with dedicated Redis write-through caching and zero-downtime upgrades, for operational continuity in DDIL and mission partner environments.',
                        },
                    ],
                },
            ],
            steps: [
                {
                    title: 'Being on the network authorizes nothing',
                    description: 'The Foundation tier still leans on network position: inside the allowlist, inside the VPN. The Optimal tier stops caring where a request came from and evaluates the request itself. Treat network controls as one signal among several rather than the deciding one.',
                },
                {
                    title: 'Availability is a security property',
                    description: 'When the sanctioned tool is unreachable, people move the conversation to an unsanctioned one. Offline operation, air-gapped deployment, and resilient clustering are Zero Trust controls precisely because they keep sensitive discussion inside the boundary you govern.',
                },
            ],
        },
        {
            id: 'applications',
            navTitle: 'Applications',
            icon: 'cog-outline',
            minutes: 6,
            title: 'Applications and workloads: verify every request at the app layer',
            summary: 'Zero Trust asks applications to verify each request themselves, build security testing into their lifecycle, and enforce controls where the data lives rather than relying on the network perimeter. That now includes AI agents, which are workloads with credentials of their own.',
            tiers: [
                {
                    label: 'Foundation: access-controlled applications and integrations',
                    summary: 'Set explicit boundaries on what users, links, and AI agents are allowed to do inside the application.',
                    items: [
                        {
                            name: 'Advanced permissions infrastructure',
                            edition: 'Enterprise',
                            description: 'System-wide and team-override permission schemes govern create, read, update, and delete per resource type, with independent channel-level controls over posting, reactions, and member management.',
                        },
                        {
                            name: 'ABAC for file upload and download',
                            edition: 'Enterprise Advanced',
                            description: 'Granular rules decide whether a user can upload or download files based on user and channel attributes, enforcing data handling policy in the application rather than in file system permissions.',
                        },
                        {
                            name: 'Anonymous ID-based URLs',
                            edition: 'Enterprise',
                            description: 'Team and channel URLs use random identifiers, so a shared link cannot be used to enumerate team and channel names — including the ones that reveal a program by name alone.',
                        },
                        {
                            name: 'Agent Control Plane',
                            edition: 'Enterprise',
                            description: 'Defines AI security boundaries by user and channel. Tool integrations are restricted to direct messages by default, and <strong>explicit user approval is required before an agent executes any action</strong>.',
                        },
                        {
                            name: 'Tool Policy Editor',
                            edition: 'Enterprise',
                            description: 'Admins choose which AI tools require approval based on context, and can disable specific tools outright, giving centralized and auditable control over AI-assisted workflows.',
                        },
                    ],
                },
                {
                    label: 'Advanced: automated, monitored, and security-tested workflows',
                    summary: 'Codify response procedures so they produce evidence automatically, and harden the workload the platform runs on.',
                    items: [
                        {
                            name: 'Collaborative playbooks',
                            edition: 'Enterprise',
                            description: 'Structured workflows with task checklists, trigger conditions, and approval gates, producing a <strong>complete audit log of every user action in each run</strong>.',
                        },
                        {
                            name: 'Conditional workflows',
                            edition: 'Enterprise',
                            description: 'Tasks are included based on attribute values and runtime conditions such as severity, category, or ticket ID, consolidating compliance documentation into a single run with a full audit trail.',
                        },
                        {
                            name: 'STIG-hardened images and FIPS 140-3',
                            edition: 'Enterprise',
                            description: 'DISA-approved STIG-hardened configuration with rigorous base image scanning, plus FIPS 140-3 validated cryptographic algorithms enforced at build time and runtime, in a FIPS-validated container image for FedRAMP and NIST 800-53 programs.',
                        },
                        {
                            name: 'Security toolchain integrations',
                            edition: 'Enterprise',
                            description: 'Native integrations with Microsoft Sentinel, Defender, Entra ID, and Intune for real-time, out-of-band security collaboration, deployable to segregated networks for SOC and red team operations.',
                        },
                        {
                            name: 'Monitoring and advanced logging',
                            edition: 'Enterprise',
                            description: 'Prometheus metrics with pre-built Grafana dashboards make anomalous behaviour visible, while error, panic, debug, trace, and conditional logging to Syslog, TCP, and Grafana Loki supports compliance-grade audit requirements.',
                        },
                    ],
                },
                {
                    label: 'Optimal: classified information controls and immutable workloads',
                    summary: 'The application itself carries and displays the classification of the content inside it.',
                    items: [
                        {
                            name: 'Classified and sensitive information control',
                            edition: 'Enterprise Advanced',
                            description: 'Program-specific information labelling for channels, visibility time limits on messages, and content flagging and moderation for spillage mitigation, aligned with FIPS 140-3 and STIG-hardened deployment requirements.',
                        },
                        {
                            name: 'Channel banners',
                            edition: 'Enterprise Advanced',
                            description: 'Per-channel classification notices with Markdown styling keep users continuously reminded of handling requirements in sensitive, classified, or CUI channels, consistent with US government notification mandates.',
                        },
                        {
                            name: 'Critical infrastructure hardening',
                            edition: 'Enterprise Advanced',
                            description: 'FIPS 140-3 validated cryptography combined with STIG-hardened Chainguard base images for Docker and Kubernetes, scanned rigorously against DoD security standards.',
                        },
                    ],
                },
            ],
            steps: [
                {
                    title: 'Treat AI as a workload that needs a policy',
                    description: 'An agent with tool access can read, summarize, and act across channels far faster than any person. The Agent Control Plane and Tool Policy Editor exist so that AI capability is scoped, approved, and logged like any other privileged integration — decide those boundaries before you widen access.',
                },
                {
                    title: 'Audit trails are what make automation trustworthy',
                    description: 'Playbooks and conditional workflows are attractive because they remove human variance from response procedures. Their Zero Trust value is the by-product: every action becomes evidence, so you can prove after the fact what was decided, by whom, and when.',
                },
            ],
        },
        {
            id: 'data',
            navTitle: 'Data',
            icon: 'lock-outline',
            minutes: 5,
            title: 'Data: protect content across its whole lifecycle',
            summary: 'Zero Trust treats data protection as a continuous obligation rather than a perimeter defence. Mattermost provides controls across the full lifecycle — classification, retention, export, recovery, and cryptographic protection — including for the AI that processes it.',
            tiers: [
                {
                    label: 'Foundation: encryption and basic inventory',
                    summary: 'Encrypt data at rest, and be able to answer what content exists and who agreed to what.',
                    items: [
                        {
                            name: 'Database encryption',
                            edition: 'Enterprise',
                            description: 'Protects user and organizational data at rest, with documented encryption configuration options for PostgreSQL deployments.',
                        },
                        {
                            name: 'Channel export',
                            edition: 'Enterprise',
                            description: 'Exports channel message data to CSV, restricted to system, team, and channel admins. A first, deliberately narrow mechanism for data inventory and auditability.',
                        },
                        {
                            name: 'Custom terms of service',
                            edition: 'Enterprise',
                            description: 'Enforces acceptance of organization-specific terms before platform access, with configurable re-acceptance periods that keep data handling obligations current in users\' minds.',
                        },
                    ],
                },
                {
                    label: 'Advanced: governed retention, eDiscovery, and sovereign AI',
                    summary: 'Shrink the data footprint you have to defend, prove what happened when asked, and keep AI processing inside your own boundary.',
                    items: [
                        {
                            name: 'Data retention policies',
                            edition: 'Enterprise',
                            description: 'Granular retention at team and channel level reduces the volume of historical content available for exploitation, supporting data minimization requirements under GDPR, HIPAA, and similar frameworks.',
                        },
                        {
                            name: 'Legal hold',
                            edition: 'Enterprise',
                            description: 'Preserves all electronically stored information for named users and durations in anticipation of legal action, and combines with retention policies and eDiscovery for a tailored compliance posture.',
                        },
                        {
                            name: 'Compliance export and eDiscovery',
                            edition: 'Enterprise',
                            description: 'Export to Actiance XML, Global Relay EML, or generic CSV, reconstructing channel state and message visibility history, with support for Smarsh, Actiance Vantage, and Proofpoint.',
                        },
                        {
                            name: 'Sovereign AI',
                            edition: 'Enterprise',
                            description: 'Fully self-hosted LLM integration with pgvector for semantic search, compatible with air-gapped and disconnected environments. <strong>No data leaves your control</strong>, which is what makes AI usable on sensitive content at all.',
                        },
                    ],
                },
                {
                    label: 'Optimal: spillage handling and cryptographic enforcement',
                    summary: 'Assume sensitive content will end up somewhere it should not, and build the response into the platform.',
                    items: [
                        {
                            name: 'Data spillage handling',
                            edition: 'Enterprise Advanced',
                            description: 'Any user can flag potentially sensitive content. The content is suppressed immediately and a designated security team is notified with context, <strong>including who may already have seen it</strong>. After review it can be cleared or permanently deleted.',
                        },
                        {
                            name: 'Burn-on-read messages',
                            edition: 'Enterprise Advanced',
                            description: 'Messages stay concealed until a recipient reveals them, then delete permanently once a configurable timer expires. Senders can track read status and delete for all recipients before expiry.',
                        },
                        {
                            name: 'FIPS 140-3 cryptographic modules',
                            edition: 'Enterprise',
                            description: 'FIPS 140-3 validated modules used for all cryptographic operations throughout the product, satisfying NIST 800-53 for agencies handling sensitive, classified, or regulated data.',
                        },
                    ],
                },
            ],
            steps: [
                {
                    title: 'Less retained data is less risk',
                    description: 'Retention is often filed under compliance, but it is a security control. Every message you no longer keep is a message an attacker cannot exfiltrate, so decide retention windows from your risk appetite rather than from storage cost.',
                },
                {
                    title: 'Decide how spillage is handled before it happens',
                    description: 'The hard part of a spillage event is not deleting the message, it is knowing who to notify and who decides. Content flagging encodes that path in advance: name the security team that receives flags and the person who authorizes permanent deletion while nothing is on fire.',
                    tip: 'Rehearse it once with a harmless test message. A flagging workflow nobody has used is a workflow nobody will use under pressure.',
                },
            ],
        },
        {
            id: 'where-to-start',
            navTitle: 'Where to Start',
            icon: 'chart-line',
            minutes: 5,
            title: 'Where to start: find your rung, then take one step',
            summary: 'No organization starts at Optimal, and no single product delivers Zero Trust on its own. Read the four maturity levels below, decide honestly which one describes you today, then use the checklist to choose your next move.',
            steps: [
                {
                    title: 'Traditional',
                    description: 'You have <strong>MFA, SSO, guest accounts, role-based access, basic audit logging, and TLS</strong>. That is a secure collaboration baseline with no implicit perimeter trust — a real accomplishment, and the floor everything else builds on.',
                },
                {
                    title: 'Initial',
                    description: 'Add <strong>AD/LDAP sync, RBAC with team override schemes, EMM mobile deployment, air-gapped or Kubernetes deployment, advanced logging, and compliance export</strong>. The access lifecycle is now automated and the platform is formally wired into security operations.',
                },
                {
                    title: 'Advanced',
                    description: 'Add <strong>ABAC with CEL syntax, HA clustering, FIPS 140-3, STIG-hardened images, sovereign AI, legal hold, playbook-driven incident response, mobile biometrics, and federated cross-organization channels</strong>. Access is context-aware and security testing runs throughout the deployment lifecycle.',
                },
                {
                    title: 'Optimal',
                    description: 'Add <strong>dynamic ABAC synchronized from ICAM, Zero Trust channel access policies, User Authoritative Source integration, data spillage handling, burn-on-read messages, classified channel controls, and full mobile hardening</strong>. Enforcement is continuous and attribute-driven, with no implicit trust at any layer.',
                },
                {
                    title: 'Score each pillar separately',
                    description: 'Most organizations are Advanced in identity and Traditional in devices, or the reverse. Grade all five pillars independently — the weakest one is where an attacker will work, and it is usually the most valuable place to spend your next quarter.',
                    tip: 'The checklist below is a starting set, not a sequence. Pick the two items that map to your weakest pillar.',
                },
            ],
            checklist: [
                {
                    title: 'Confirm deprovisioning actually works',
                    description: 'Disable a test account in your directory and verify that Mattermost access is gone after the next sync. An identity pillar that does not revoke is not an identity pillar.',
                },
                {
                    title: 'Turn on ID-only push notifications',
                    description: 'A configuration change that stops message content from reaching Apple and Google notification infrastructure. Highest security return for the least effort in the whole guide.',
                },
                {
                    title: 'Agree on your attribute vocabulary',
                    description: 'Write down the custom profile attributes that matter — clearance, program, location, nationality — and name an owner and authoritative source for each. Every ABAC policy you write later depends on this list.',
                },
                {
                    title: 'Pilot one attribute-based channel policy',
                    description: 'Pick a single <strong>private</strong> channel whose membership genuinely follows an attribute, and let the policy add and remove members. One working example teaches more than a design document.',
                },
                {
                    title: 'Set a retention policy somewhere',
                    description: 'Choose one team or channel where indefinite history has no business value and give it a retention window. Then use what you learn to argue for a platform-wide default.',
                },
                {
                    title: 'Review your AI boundaries',
                    description: 'Open the Tool Policy Editor and check which AI tools run without approval and in which contexts. Agent access grows quietly, so make reviewing it a recurring item rather than a one-off.',
                },
                {
                    title: 'Name your spillage responders',
                    description: 'Decide who receives content flags and who authorizes permanent deletion, then test the path once with a harmless message. Do this before you need it.',
                },
            ],
        },
    ],
};

export default zeroTrust;
