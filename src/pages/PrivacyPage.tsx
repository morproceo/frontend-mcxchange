import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import Card from '../components/ui/Card'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy and Data Protection Standard</h1>
          <p className="text-gray-500">Jurisdiction: United States (Federal); State of Arizona</p>
        </div>

        <Card>
          <div className="prose prose-gray max-w-none">

            {/* ARTICLE 1 */}
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 1: PREAMBLE; SCOPE; DATA CONTROLLER STATUS</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.1. Introduction, Identity of Data Controller, and Passive Data Room Role.</h3>
            <p className="text-gray-700 mb-4">
              Domilia (the &quot;Marketplace,&quot; &quot;we,&quot; or &quot;us&quot;) operates a specialized digital intermediary platform dedicated exclusively to the commercial purchase and sale of transportation entities. We recognize that the nature of Mergers and Acquisitions (M&amp;A) requires the exchange of highly sensitive, proprietary, and financial information between users. This Privacy Policy serves as a binding legal document outlining how we collect, use, store, and share &quot;Personal Information&quot; and &quot;Confidential Business Information.&quot; For the purposes of applicable data protection laws, the Marketplace operates under a Dual Role Framework: (a) we act as the &quot;Data Controller&quot; regarding your account registration details, browsing behavior, and subscription data, meaning we determine how this administrative data is used for security and access control; and (b) we act strictly as a &quot;Data Processor&quot; (or Technical Service Provider) regarding the documents you upload to our proprietary Data Rooms. In this second capacity, our role is limited exclusively to providing the passive digital infrastructure for the secure hosting and transmission of files. The Marketplace explicitly disclaims any role in conducting, verifying, auditing, or analyzing due diligence. We do not review the content of any Data Room file for accuracy, legality, or completeness. By accessing the Platform, you expressly consent to this Dual Role structure and acknowledge that your use of the Platform constitutes a Business-to-Business (B2B) commercial relationship, distinct from a standard consumer engagement, and that the responsibility for conducting all due diligence rests solely and exclusively with the Buyer and Seller.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.2. Collection of Identity, Regulatory Identifiers, and Beneficial Ownership Data.</h3>
            <p className="text-gray-700 mb-4">
              To preserve the integrity of our &quot;Verified Owner&quot; ecosystem and prevent fraudulent listings, we collect rigorous identity verification data that exceeds standard commercial practices. Upon registration, we require the submission of direct identifiers, including your full legal name, physical domicile address, email address, telephone number, and government-issued identification numbers, such as a Driver&apos;s License or Passport. For Sellers claiming ownership of a transportation entity, we mandatorily collect federal regulatory identifiers—specifically the USDOT Number and MC Number—and utilize automated third-party API integrations to cross-reference these inputs against the Federal Motor Carrier Safety Administration (FMCSA) SAFER database solely to confirm the existence of the operating authority and the identity of the registrant. Regarding highly sensitive identifiers, including Social Security Numbers (SSN) or full Employer Identification Numbers (EIN), the Marketplace employs a &quot;Secure Passthrough&quot; protocol whereby such data is transmitted directly to a PCI-DSS compliant third-party identity verification provider for background checks and sanctions screening. The Marketplace does not store, retain, or maintain unredacted Social Security Numbers on its active servers. Furthermore, consistent with the standards of the Corporate Transparency Act, we collect &quot;Beneficial Ownership&quot; information to verify that the individual registering the account possesses the requisite legal authority to control the entity, thereby mitigating the risk of unauthorized or fraudulent asset transfers.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.3. Seller&apos;s Exclusive Redaction Duty and Prohibition on Sensitive PII.</h3>
            <p className="text-gray-700 mb-4">
              While the Marketplace utilizes encryption to secure the transport of data, Seller acknowledges and agrees that it bears the primary, exclusive, and non-delegable burden of &quot;Redaction&quot; prior to uploading any documents to the Data Room. Seller is strictly prohibited from uploading &quot;Prohibited Sensitive Personal Information&quot; (SPI), which is defined to include, without limitation: (a) unredacted Social Security Numbers (SSNs) or Taxpayer Identification Numbers of individual drivers or employees; (b) &quot;Protected Health Information&quot; (PHI) under HIPAA or the Americans with Disabilities Act, specifically including the long-form Medical Examination Report (Form MCSA-5875) found within Driver Qualification Files; (c) unredacted financial account numbers, credit card numbers, or access codes; and (d) raw consumer reports or background check results protected by the Fair Credit Reporting Act (FCRA). Seller expressly covenants that it shall sanitize, redact, or black out all such Prohibited SPI from its due diligence materials (e.g., Payroll Logs, Driver Lists, Insurance Loss Runs) before such files are transmitted to the Platform. The Marketplace acts solely as a passive conduit for these files and expressly disclaims any duty to audit, monitor, or scrub Seller&apos;s uploaded content for Prohibited SPI. Consequently, the Marketplace shall have no liability for any data breach, identity theft, or regulatory fine arising from the inadvertent disclosure of Prohibited SPI that Seller voluntarily or negligently uploaded to the Platform. Furthermore, Seller grants the Marketplace the unilateral right, but not the obligation, to immediately and permanently purge, delete, or destroy any file detected to contain Prohibited SPI without prior notice or liability to Seller.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.4. Collection of Financial and Operational Data.</h3>
            <p className="text-gray-700 mb-4">
              We collect sensitive financial documentation including, but not limited to, corporate tax returns (Form 1120-S), Profit and Loss statements, Balance Sheets, and equipment asset lists. While this data is primarily commercial, we treat it with the highest standard of privacy protection applicable to Nonpublic Personal Information (NPI). Additionally, we automatically collect technical usage data, including IP addresses, device fingerprints, and clickstream data, to prevent fraud.
            </p>

            {/* ARTICLE 2 */}
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 2: DATA PROCESSING PROTOCOLS AND SOFTWARE FUNCTIONALITY</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1. Primary Data Usage for Advertising and Connectivity.</h3>
            <p className="text-gray-700 mb-4">
              The primary purpose for collecting and processing your information is to enable the functionality of the Marketplace&apos;s software and to provide a digital advertising medium for transportation assets. We utilize your data to generate anonymized &quot;Teaser&quot; advertisements that display general operational metrics (e.g., EBITDA, geographic region, fleet composition) to the public, while programmatically suppressing your specific legal identity, MC Number, and DOT Number until the software&apos;s &quot;Gatekeeper&quot; access protocols are satisfied. We utilize your contact information solely to transmit automated system notifications regarding message alerts, document access requests, and account security updates. Furthermore, the software automatically processes your identity data to query third-party sanction databases (such as OFAC and AML watchlists) to ensure the platform&apos;s compliance with federal anti-terrorism and banking regulations prior to authorizing access to third-party escrow tools.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2. Irreversible Transformation and Creation of Market Intelligence.</h3>
            <p className="text-gray-700 mb-4">
              You expressly authorize the Marketplace to process your specific financial and operational data to generate &quot;Aggregated Statistics&quot; and proprietary valuation models. This process constitutes an &quot;Irreversible Transformation&quot; of your data, wherein the software permanently strips away all direct identifiers (names, addresses, raw DOT numbers) and combines the remaining numerical data points with thousands of other inputs to calculate broad market averages (e.g., &quot;Average Profit Margin for Dry Van Carriers in the Midwest&quot;). The Marketplace exclusively creates, owns, and retains these Aggregated Statistics in perpetuity to power its algorithmic pricing tools and industry reports. You acknowledge and agree that once your data has been converted into Aggregated Statistics, it no longer constitutes &quot;Personal Information&quot; under applicable privacy laws and is not subject to consumer deletion requests or the &quot;Right to be Forgotten.&quot;
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3. Contractual Prohibition on Re-Identification and Data Mining.</h3>
            <p className="text-gray-700 mb-4">
              To preserve the integrity of the anonymous advertising environment, you expressly covenant that you shall not use any data, &quot;Teaser&quot; advertisements, or Aggregated Statistics provided by the Marketplace to attempt to &quot;reverse engineer,&quot; de-anonymize, or identity any Seller or Buyer on the platform outside of the authorized Data Room access protocols. You further agree not to use any automated software, scrapers, or manual techniques to cross-reference platform data with external databases for the purpose of unmasking the identity of a competitor. Any attempt to use the Marketplace&apos;s software or data to identify a user without their consent constitutes a material breach of this Policy and the Terms of Service, resulting in immediate account termination.
            </p>

            {/* ARTICLE 3 */}
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 3: DATA DISCLOSURE PROTOCOLS AND THIRD-PARTY INTEGRATIONS</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1. User-Directed Disclosure via Proprietary Data Rooms.</h3>
            <p className="text-gray-700 mb-4">
              The Marketplace utilizes a secure, permission-based &quot;Data Room&quot; architecture to enable the controlled exchange of &quot;Confidential Business Information&quot; (such as Tax Returns and P&amp;L Statements). The Platform&apos;s software is programmed to disclose this sensitive information to a prospective Buyer only upon the simultaneous satisfaction of three specific conditions: the Buyer&apos;s successful completion of identity verification, the electronic execution of a binding Non-Disclosure Agreement (NDA) specific to the listing, and the Seller&apos;s affirmative manual approval or pre-set authorization. You expressly acknowledge and agree that the Marketplace acts solely as the technological custodian of these files and cannot control, monitor, or restrict a Buyer&apos;s retention, printing, or dissemination of your data once you have authorized their access. Consequently, you release the Marketplace from any liability regarding a Buyer&apos;s unauthorized use or leakage of your data and agree that your sole remedy for such a breach lies in enforcing the NDA directly against the Buyer.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2. Integration with Critical Infrastructure and Compliance Vendors.</h3>
            <p className="text-gray-700 mb-4">
              To maintain the operational integrity, security, and legal compliance of the Platform, we disclose your information to a limited category of third-party infrastructure providers solely for the purpose of enabling software functionality. This necessitates the transmission of data to Identity Verification Partners for the validation of government credentials, Third-Party Escrow Agents for the satisfaction of federal &quot;Know Your Customer&quot; (KYC) and anti-money laundering regulations, and hyperscale Cloud Infrastructure Providers who host our encrypted servers and database architecture. These transfers are strictly limited to the data necessary for the provider to perform their specific technical function. We contractually require these providers to maintain the confidentiality of your data, yet we explicitly disclaim liability for the independent privacy practices or security failures of these third-party entities. We do not sell, rent, or lease your Personal Information to third-party advertisers or data brokers for marketing purposes.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.3. Corporate Succession and Asset Transfer.</h3>
            <p className="text-gray-700 mb-4">
              In the event that the Marketplace undergoes a fundamental corporate change, such as a merger, acquisition, bankruptcy, reorganization, or sale of substantially all of its assets, your Personal Information, Data Room contents, and the associated &quot;Aggregated Statistics&quot; may be transferred or sold as part of the Marketplace&apos;s going-concern value. You acknowledge that such a transfer is necessary to ensure the continuity of the Platform&apos;s services. In such an event, the acquiring entity will assume the rights and obligations regarding your Personal Information as described in this Policy, and any material changes to data handling practices will be communicated to you in accordance with applicable law.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.4. Compelled Disclosure and Public Safety Exceptions.</h3>
            <p className="text-gray-700 mb-4">
              The Marketplace reserves the right to disclose your Personal Information and Business Data without your prior consent if we have a good faith belief that such disclosure is reasonably necessary to comply with a valid judicial proceeding, court order, warrant, or legal process served on us, specifically including administrative subpoenas from the IRS, FMCSA, or law enforcement agencies regarding safety violations or tax compliance. Furthermore, pursuant to the &quot;Safe Harbor&quot; provisions of applicable law, we may disclose your information to law enforcement or relevant authorities if we reasonably believe that immediate disclosure is necessary to prevent physical harm, financial fraud, or the evasion of federal safety regulations (such as &quot;Chameleon Carrier&quot; activity), or to protect the rights and property of the Marketplace.
            </p>

            {/* ARTICLE 4 */}
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 4: DATA SECURITY STANDARDS; RETENTION; USER RESPONSIBILITIES</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1. Cybersecurity Standards and Allocation of Risk.</h3>
            <p className="text-gray-700 mb-4">
              The Marketplace employs a &quot;Defense-in-Depth&quot; cybersecurity framework designed to align with commercially reasonable industry standards for the protection of Nonpublic Personal Information (NPI). We utilize Transport Layer Security (TLS) 1.2 or higher for data in transit and verify that sensitive &quot;Data at Rest&quot;—specifically the proprietary documents stored in Data Rooms—is protected via AES-256 encryption or comparable cryptographic protocols. Access to our internal administrative databases is restricted via strict Role-Based Access Controls (RBAC) to personnel with a verified business necessity. Notwithstanding these protocols, Security is a Shared Responsibility. You acknowledge that the Marketplace cannot guarantee the security of data transmitted over the open internet or the integrity of your own local devices. Accordingly, you assume sole responsibility for maintaining the confidentiality of your account credentials, utilizing multi-factor authentication (MFA) where available, and ensuring your endpoint devices are free from malware. The Marketplace expressly disclaims liability for any data breach, unauthorized access, or loss of assets resulting from compromised user credentials, phishing attacks directed at the user, or the user&apos;s failure to secure their own email systems.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.2. Regulatory Retention, Immutable Audit Trails, and Deletion Exemptions.</h3>
            <p className="text-gray-700 mb-4">
              We retain your Personal Information and Transaction Data for the duration of your account activity and for a statutorily defined period thereafter. You expressly acknowledge that the Marketplace operates in a highly regulated environment subject to the oversight of the IRS, the FMCSA, and the Securities and Exchange Commission (SEC). Consequently, even if you formally request account deletion or exercise a &quot;Right to be Forgotten,&quot; the Marketplace is legally compelled to maintain an &quot;Immutable Audit Trail&quot; of your activities, executed NDAs, Letters of Intent, and transaction logs for a period of no less than seven (7) years. This retention is strictly necessary to: (a) substantiate the Marketplace&apos;s compliance with the M&amp;A Broker Exemption (proving we did not hold custody of funds); (b) defend against potential post-closing litigation or warranty claims; and (c) satisfy federal tax reporting obligations. You agree that your right to deletion is subordinate to these overriding legal and regulatory retention mandates. Upon the expiration of this statutory retention period, your Personal Information will be securely purged or effectively anonymized; however, the &quot;Aggregated Statistics&quot; derived from your historical data shall be retained by the Marketplace indefinitely as its exclusive intellectual property.
            </p>

            {/* ARTICLE 5 */}
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 5: CONSUMER PRIVACY RIGHTS; STATE COMPLIANCE; JURISDICTION</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1. Consumer Rights to Access, Portability, and Correction.</h3>
            <p className="text-gray-700 mb-4">
              Subject to the statutory exemptions applicable to Business-to-Business (B2B) data and the M&amp;A Broker retention mandates, you may have the right to request access to the specific categories and pieces of Personal Information we have collected about you, the right to correct legally inaccurate data, the right to receive your data in a portable, machine-readable format, and the right to request deletion of your data. To exercise these rights, you must submit a &quot;Verifiable Consumer Request&quot; to our compliance department. You acknowledge that because the security of your financial and regulatory data is paramount, the Marketplace employs a rigorous verification standard; we will not process any request to access or delete data unless we can definitively verify your identity to a reasonable degree of certainty, which may require you to provide a signed declaration or undergo secondary authentication. We reserve the right to deny requests that are manifestly unfounded, excessive, or fraudulent, or where retaining the data is necessary to detect security incidents, comply with a legal obligation (such as tax audits), or enable solely internal uses that are reasonably aligned with your expectations.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2. Comprehensive US State Privacy Notice and &quot;Functional Necessity.&quot;</h3>
            <p className="text-gray-700 mb-4">
              This section serves as a comprehensive notice of privacy rights for residents of states with specific data privacy statutes, including but not limited to California (CCPA/CPRA), Virginia (VCDPA), Colorado (CPA), Utah (UCPA), and Connecticut (CTDPA). The Marketplace expressly certifies that it does not sell your Personal Information to third parties for monetary consideration or for cross-context behavioral advertising. While certain state laws grant consumers the right to &quot;Opt-Out&quot; of the sharing of personal data, you explicitly acknowledge that the &quot;sharing&quot; of your data with prospective Buyers and identity verification partners is a &quot;Functional Necessity&quot; of the Platform&apos;s core service. Consequently, you agree that exercising a right to Opt-Out of data sharing constitutes a voluntary termination of your account and a withdrawal of your listing, as the Marketplace cannot market or sell your entity without disclosing its attributes. We will not discriminate against you for exercising your privacy rights; however, we may offer financial incentives or different service levels permitted by law where the value of your data is directly related to the benefit provided.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.3. California Specific Notices; Shine the Light; Do Not Track.</h3>
            <p className="text-gray-700 mb-4">
              Pursuant to the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), we disclose that we collect the categories of Personal Information outlined in Article 1 for the business purposes outlined in Article 2. We do not knowingly collect or sell the Personal Information of consumers under the age of 16. Regarding technical signals, our systems are configured to respect recognized &quot;Global Privacy Control&quot; (GPC) signals regarding the sale of data; however, because we do not sell data for advertising purposes, such signals will not alter the functionality of the Data Room. Furthermore, pursuant to California Civil Code &sect; 1798.83 (&quot;Shine the Light&quot;), California residents may request a list of certain categories of personal information disclosed to third parties for their direct marketing purposes during the immediately preceding calendar year; however, the Marketplace does not disclose personal information to third parties for their own direct marketing purposes.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.4. International Users and Consent to US Jurisdiction.</h3>
            <p className="text-gray-700 mb-4">
              The Marketplace is owned, operated, and controlled within the United States and is intended solely for the use of US-domiciled entities and persons. If you access the Platform from the European Union, the United Kingdom, Canada, or any other jurisdiction with laws governing data collection and use that differ from US law, you expressly acknowledge that you are voluntarily transferring your Personal Information to the United States. By utilizing the Platform, you unconditionally consent to the transfer, processing, and storage of your data in the United States under US federal and state laws, which may provide a lower standard of privacy protection than your home jurisdiction. The Marketplace explicitly disclaims compliance with the General Data Protection Regulation (GDPR) for users who voluntarily access the Platform from outside the intended market, and you hereby waive any claims arising under foreign privacy laws.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.5. Material Changes and Policy Updates.</h3>
            <p className="text-gray-700 mb-4">
              The Marketplace reserves the right to modify, amend, or update this Privacy Policy at any time to reflect changes in our data practices, technological infrastructure, or applicable law. If we make &quot;Material Changes&quot;—defined as changes that significantly expand our rights to use or share your previously collected Personal Information—we will provide notice via a prominent banner on the Platform or via direct email to your registered address prior to the change becoming effective. Your continued use of the Marketplace or the retention of your account after the effective date of any such changes constitutes your valid electronic signature and acceptance of the revised Policy.
            </p>

          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default PrivacyPage
