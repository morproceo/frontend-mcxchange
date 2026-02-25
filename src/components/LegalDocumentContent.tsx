export const SellerTermsContent = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Seller User Agreement</h1>
      <p className="text-sm text-gray-500 mb-2">Last Updated: {currentDate}</p>
      <p className="text-sm text-gray-500 mb-6">Jurisdiction: State of Arizona</p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm font-semibold text-amber-800">
          IMPORTANT NOTICE: THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS ACTION RIGHTS AS DETAILED IN ARTICLE 10. BY CLICKING &quot;I AGREE&quot; OR ACCESSING THE PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS.
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 1: NATURE OF SERVICES; REGULATORY STATUS; RELATIONSHIP OF PARTIES</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.1. Platform as Passive Advertising Medium and Software Provider.</h3>
      <p className="text-gray-700 mb-4">
        The Marketplace owns and operates a proprietary digital interface designed exclusively to function as a provider of software and a neutral advertising medium through which independent Sellers and Buyers of transportation entities may identify potential counterparties. The Marketplace is not, and shall not be deemed to be, a licensed securities broker-dealer, an investment adviser, a real estate broker, a legal advisor, or a fiduciary of any kind to the Seller. The Marketplace operates in strict compliance with the &quot;M&amp;A Broker Exemption&quot; codified in Section 15(b)(13) of the Securities Exchange Act of 1934. Consistent with this federal exemption, the Marketplace limits its activities strictly to bringing together buyers and sellers of &quot;Eligible Privately Held Companies&quot; and providing the technological infrastructure for the secure exchange of documents. The Marketplace expressly disclaims any authority to, and covenants that it shall not: (a) bind any party to a transaction; (b) directly participate in the negotiation of the purchase price or deal structure; (c) advise any party on the fairness, tax consequences, or valuation of a transaction; or (d) handle, hold, or take custody of user funds or securities at any time. Seller acknowledges and agrees that the Marketplace acts solely as a passive marketing platform and does not act as Seller’s agent, advocate, or representative in any capacity. All terms of the transaction, including price and structure, are determined solely by the independent business judgment of the Seller and Buyer. Furthermore, the Marketplace provides no warranty that the listing of an entity will result in a successful sale, nor does it guarantee the solvency, regulatory standing, or financial qualifications of any Buyer introduced through the Platform.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.2. Negation of Agency and Fiduciary Duty.</h3>
      <p className="text-gray-700 mb-4">
        The relationship between the Marketplace and its Users is strictly that of independent contractors. Nothing contained in these Terms, nor any conduct, algorithm, or communication by the Marketplace or its agents, shall be construed to create a partnership, joint venture, franchise, agency, or employer-employee relationship between the Marketplace and any User. The Marketplace does not represent the commercial, legal, or financial interests of any specific party to a transaction. Users acknowledge that any &quot;verification,&quot; &quot;valuation,&quot; or &quot;screening&quot; badges displayed on the Platform are provided for informational purposes only based on available public data and do not constitute a guarantee, endorsement, or recommendation by the Marketplace. Users act exclusively on their own behalf and at their own risk in all transactions.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.3. Regulatory Compliance and Securities Exemption.</h3>
      <p className="text-gray-700 mb-4">
        The Marketplace operates in strict compliance with the statutory &quot;M&amp;A Broker Exemption&quot; codified in Section 15(b)(13) of the Securities Exchange Act of 1934, as amended. The services provided hereunder are limited to facilitating the transfer of ownership of &quot;Eligible Privately Held Companies,&quot; defined as operating entities with earnings before interest, taxes, depreciation, and amortization (EBITDA) of less than $25 million and gross revenues of less than $250 million in the fiscal year preceding the transaction. Consistent with the mandatory requirements of this federal exemption, the Marketplace does not have the ability to bind any party to a transaction, nor does it provide financing for the purchase of any business. Crucially, the Marketplace adheres to a rigid policy of non-custody regarding User funds or securities; the Marketplace does not, under any circumstances, maintain custody, possession, or control of transaction proceeds. All financial settlements for transactions initiated on the Marketplace must be processed strictly through an independent, licensed third-party escrow agent, and the Marketplace shall have no liability for the acts or omissions of such escrow agent.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.4. OFAC and Sanctions Compliance.</h3>
      <p className="text-gray-700 mb-4">
        The Marketplace is a US-based entity subject to US economic sanctions. By accessing the Platform, you represent and warrant that: (a) you are not located in, organized under the laws of, or ordinarily resident in any country or territory subject to comprehensive US sanctions (currently Cuba, Iran, North Korea, Syria, and the Crimea, Donetsk, and Luhansk regions of Ukraine); and (b) you are not on any US Government restricted party list, including the US Treasury Department&apos;s List of Specially Designated Nationals and Blocked Persons (the &quot;SDN List&quot;). You agree that the Marketplace may immediately terminate your account and freeze any pending transaction if we reasonably suspect a violation of this Section 1.4.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 2: GRANT OF LICENSE; ACCEPTABLE USE; SYSTEM INTEGRITY</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1. Limited License and Scope of Access.</h3>
      <p className="text-gray-700 mb-4">
        Subject to your strict and continuing compliance with these Terms, the Marketplace grants you a limited, revocable, non-exclusive, non-transferable, and non-sublicensable license to access and use the Services solely for the permitted internal business purpose of (a) listing a proprietary transportation entity for potential sale, or (b) evaluating active listings for a potential acquisition. This license is personal to you and may not be assigned or shared. You explicitly acknowledge that any violation of the provisions of this Article 2 results in the immediate and automatic revocation of this license, rendering any subsequent access to the Platform by you (or your automated agents) a trespass and unauthorized access under applicable state and federal law, including the Computer Fraud and Abuse Act.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2. Prohibition on Data Extraction, Automation, and AI Training.</h3>
      <p className="text-gray-700 mb-4">
        You agree not to access, reproduce, download, distribute, transmit, broadcast, display, sell, license, alter, modify, or otherwise use any part of the Services or any Content except: (a) as expressly authorized by the Service; or (b) with prior written permission from the Marketplace and, if applicable, the respective rights holders. Specifically, you are strictly prohibited from employing, utilizing, or deploying any manual or automated device, methodology, algorithm, or software—including but not limited to &quot;robots,&quot; &quot;spiders,&quot; &quot;scrapers,&quot; &quot;crawlers,&quot; &quot;AI agents,&quot; or &quot;Large Language Model (LLM) trainers&quot;—to access, acquire, copy, monitor, or index any portion of the Services or its underlying data structures. You covenant that you will not harvest or collect User data, MC Numbers, DOT safety metrics, or contact information from the Services for the purpose of sending unsolicited communications, building a competitive database, or training machine learning algorithms.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3. Non-Circumvention and Revenue Protection.</h3>
      <p className="text-gray-700 mb-4">
        You acknowledge that the Marketplace’s business model relies fundamentally on the collection of Success Fees from transactions facilitated through the Platform. Accordingly, you agree that you shall not, directly or indirectly, solicit, request, encourage, or attempt to induce any other User to transact &quot;off-platform&quot; or otherwise circumvent the Marketplace’s fee structure. This prohibition applies to any communication attempting to share outside contact information (such as phone numbers, email addresses, or website URLs) prior to the formal introduction via the Data Room or Escrow process. You agree to immediately notify the Marketplace’s compliance team if another User suggests taking a transaction off-platform, and you acknowledge that failure to report such conduct may result in the suspension of your own account.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.4. System Integrity, Security, and Reverse Engineering.</h3>
      <p className="text-gray-700 mb-4">
        You agree strictly not to interfere with, damage, disable, overburden, or impair the proper working of the Marketplace or its infrastructure, including via the transmission of viruses, trojan horses, worm logic bombs, or other malicious code. Furthermore, you shall not attempt to gain unauthorized access to any portion or feature of the Services, or any other systems or networks connected to the Services, by hacking, password &quot;mining,&quot; or any other illegitimate means. You are expressly prohibited from attempting to decompile, reverse engineer, disassemble, or otherwise attempt to derive the source code, underlying algorithms, or trade secrets of the Marketplace, or to modify, adapt, translate, or create derivative works based on the software or layout of the Platform.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 3: ACCOUNT REGISTRATION; SECURITY PROTOCOLS; TERMINATION RIGHTS</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1. Registration and Identity Verification.</h3>
      <p className="text-gray-700 mb-4">
        Access to the Marketplace Data Room and transaction capabilities is a revocable privilege, not a right. As a condition of your use of the Services, you agree to provide true, accurate, current, and complete information during the registration process, including valid government-issued identification and corporate formation documents if requested. You expressly authorize the Marketplace and its third-party compliance partners to perform &quot;Know Your Customer&quot; (KYC), &quot;Know Your Business&quot; (KYB), and &quot;Anti-Chameleon&quot; screening inquiries to verify your identity and regulatory standing. You acknowledge that the Marketplace’s verification process is a risk management tool employed solely for the benefit of the Marketplace and does not constitute a warranty, guarantee, or representation regarding the identity, trustworthiness, or regulatory compliance of any other User.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2. Account Security and Imputed Liability.</h3>
      <p className="text-gray-700 mb-4">
        You are solely responsible for maintaining the confidentiality and security of your account credentials, including your username, password, and two-factor authentication (2FA) tokens. You agree that you are fully responsible for all activities, transactions, and communications that occur under your account, whether or not you authorized such activities. The Marketplace shall be entitled to treat all instructions, listings, and acceptances received through your account as your valid, binding, and authorized acts. You agree to notify the Marketplace immediately of any unauthorized use of your account or any other breach of security. The Marketplace shall not be liable for any loss, damage, or liability arising from your failure to comply with this Section or from the unauthorized use of your credentials by a third party (including employees, agents, or hackers).
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.3. Suspension and Termination.</h3>
      <p className="text-gray-700 mb-4">
        The Marketplace reserves the right, in its sole and absolute discretion, to suspend, restrict, or terminate your access to the Services at any time, with or without prior notice, for any reason or no reason, including but not limited to: (a) your violation of these Terms or the spirit of our community standards; (b) the occurrence of a &quot;Material Adverse Event&quot; regarding your FMCSA safety rating; (c) your engagement in off-platform circumvention; (d) requests by law enforcement or other government agencies; or (e) our determination that your continued use of the Services poses a safety, legal, or reputational risk to the Marketplace or its Users.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.4. Effect of Termination.</h3>
      <p className="text-gray-700 mb-4">
        Upon termination of your account, your right to use the Services will immediately cease, and all licenses granted to you hereunder shall automatically be revoked. However, termination shall not relieve you of any obligations incurred prior to the effective date of termination, including the obligation to pay accrued Success Fees, the duty to maintain Confidentiality (Article 4), and the obligation to Indemnify the Marketplace (Article 8). The Marketplace shall have no liability to you or any third party for any termination of your access or for the removal of your User Content.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 4: CONFIDENTIALITY; DATA ROOM PROTOCOLS; PROPRIETARY RIGHTS</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1. Definition of Confidential Information.</h3>
      <p className="text-gray-700 mb-4">
        For purposes of this Agreement, &quot;Confidential Information&quot; means all non-public, proprietary, or commercially sensitive information disclosed or made available to you through the Marketplace’s Data Room or other secure communication channels, whether orally or in writing. This includes, without limitation: (a) the identity, contact details, and ownership structure of any Seller or Buyer; (b) financial data, including Profit &amp; Loss statements, balance sheets, tax returns, and bank statements; (c) operational data, including Safety Management Plans, driver lists, customer lists, and proprietary route data; (d) the specific terms, pricing, and structure of any proposed transaction; and (e) any notes, analyses, or compilations prepared by you or your Representatives that rely upon or incorporate such information. Confidential Information does not include information that (i) is or becomes generally available to the public other than as a result of a disclosure by you; (ii) was known to you on a non-confidential basis prior to disclosure; or (iii) becomes available to you on a non-confidential basis from a source other than the Marketplace, provided that such source is not bound by a confidentiality agreement.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.2. Non-Disclosure and Restricted Use Covenants.</h3>
      <p className="text-gray-700 mb-4">
        As a condition of accessing the Data Room, you strictly covenant and agree: (a) to hold all Confidential Information in strict confidence and to exercise at least the same degree of care to protect it as you use to protect your own most sensitive trade secrets, but in no event less than a reasonable standard of care; (b) to use the Confidential Information solely for the purpose of evaluating, negotiating, and consummating a potential transaction on the Marketplace (the &quot;Permitted Purpose&quot;); and (c) not to disclose, copy, distribute, or disseminate any Confidential Information to any third party, except to your directors, officers, employees, attorneys, and accountants (collectively, &quot;Representatives&quot;) who have a bona fide need to know such information for the Permitted Purpose and who are bound by confidentiality obligations at least as restrictive as those contained herein. You acknowledge and agree that you shall be fully liable for any breach of this Article 4 by any of your Representatives.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.3. Data Room Monitoring and Audit Rights.</h3>
      <p className="text-gray-700 mb-4">
        You acknowledge that the Marketplace employs advanced digital rights management (DRM) and monitoring technologies within the Data Room to track user activity, including IP addresses, document downloads, page views, and timestamps. You explicitly consent to such monitoring and acknowledge that the Marketplace maintains an audit trail of your access to Confidential Information. The Marketplace reserves the right to revoke your access immediately if suspicious activity (such as bulk downloading or access from unauthorized geographic locations) is detected, and such activity may be reported to relevant authorities as potential unauthorized access under the Computer Fraud and Abuse Act.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.4. Compelled Disclosure and Whistleblower Immunity.</h3>
      <p className="text-gray-700 mb-4">
        If you are compelled by law, court order, or valid subpoena to disclose any Confidential Information, you shall (to the extent permitted by law) provide the Marketplace and the disclosing Seller with prompt written notice to allow them to seek a protective order or other appropriate remedy. Notwithstanding the foregoing, pursuant to the Defend Trade Secrets Act of 2016 (18 U.S.C. § 1833(b)), you shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that is made: (i) in confidence to a federal, state, or local government official, either directly or indirectly, or to an attorney, solely for the purpose of reporting or investigating a suspected violation of law; or (ii) in a complaint or other document filed in a lawsuit or other proceeding, if such filing is made under seal.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.5. Return or Destruction of Materials.</h3>
      <p className="text-gray-700 mb-4">
        Upon the termination of your account, the conclusion of a transaction (without closing), or at any time upon the Marketplace’s request, you shall immediately return or rigorously destroy all copies of Confidential Information in your possession or control (including deleting digital copies from hard drives and cloud storage) and shall certify such destruction in writing if requested.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 5: INTELLECTUAL PROPERTY RIGHTS; USER CONTENT; DMCA COMPLIANCE</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1. Marketplace Intellectual Property.</h3>
      <p className="text-gray-700 mb-4">
        The Marketplace Platform, including its underlying source code, user interface design, &quot;Data Room&quot; architecture, proprietary valuation algorithms, &quot;Safe-Screening&quot; protocols, and all related logos and trademarks (collectively, &quot;Marketplace IP&quot;), constitutes the exclusive intellectual property of the Marketplace and its licensors. The Marketplace IP is protected by United States and international copyright, trademark, patent, and trade secret laws. You acknowledge that you hold no right, title, or interest in the Marketplace IP other than the limited, revocable, non-transferable license to access the Services as authorized herein. Any unauthorized use, reproduction, or reverse engineering of the Marketplace IP is strictly prohibited.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2. License to User Content and Waiver of Moral Rights.</h3>
      <p className="text-gray-700 mb-4">
        By posting, uploading, or transmitting any data, listings, text, photographs, or documents (&quot;User Content&quot;) to the Services, you hereby grant the Marketplace a worldwide, perpetual, irrevocable, royalty-free, fully paid-up, non-exclusive, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such User Content in connection with operating, marketing, and improving the Services. You explicitly waive any &quot;moral rights&quot; or rights of attribution you may have in the User Content. You represent and warrant that: (a) you own or have the necessary licenses, rights, consents, and permissions to authorize the Marketplace to use the User Content; and (b) the User Content does not infringe the proprietary or privacy rights of any third party.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.3. Ownership of Aggregated Statistics and Feedback.</h3>
      <p className="text-gray-700 mb-4">
        You acknowledge that the Marketplace creates anonymized, aggregated data sets derived from User activity, including listing prices, time-to-close metrics, and safety score correlations (&quot;Aggregated Statistics&quot;). You agree that the Marketplace shall own all right, title, and interest in and to the Aggregated Statistics, and may use, sell, license, or publish such data for any business purpose (e.g., &quot;Industry Market Reports&quot;) without compensation to you, provided that such data does not personally identify you. Furthermore, if you provide any suggestions, enhancement requests, or feedback regarding the Services (&quot;Feedback&quot;), you hereby assign to the Marketplace all right, title, and interest in such Feedback, and the Marketplace is free to implement such Feedback without restriction or compensation.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.4. DMCA Safe Harbor and Takedown Procedure.</h3>
      <p className="text-gray-700 mb-4">
        The Marketplace complies with the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work has been infringed on the Platform, you must submit a written notification to our Designated Copyright Agent at [Insert Email] containing the following statutory elements (pursuant to 17 U.S.C. § 512(c)(3)): (a) A physical or electronic signature of the copyright owner or authorized agent; (b) Identification of the copyrighted work claimed to be infringed; (c) Identification of the material that is claimed to be infringing and its location (URL) on the Platform; (d) Your contact information (address, telephone number, email); (e) A statement that you have a &quot;good faith belief&quot; that the use is not authorized; and (f) A statement under penalty of perjury that the information in the notification is accurate. WARNING: Under 17 U.S.C. § 512(f), if you knowingly misrepresent that material is infringing, you may be liable for damages and attorneys&apos; fees.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 6: DISCLAIMER OF WARRANTIES; ASSUMPTION OF RISK</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.1. GENERAL &quot;AS-IS&quot; DISCLAIMER.</h3>
      <p className="text-gray-700 mb-4">
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE ARIZONA LAW, THE MARKETPLACE SERVICES, THE PLATFORM, THE DATA ROOM, AND ALL RELATED CONTENT AND ALGORITHMS ARE PROVIDED SOLELY ON AN &quot;AS IS,&quot; &quot;AS AVAILABLE,&quot; AND &quot;WITH ALL FAULTS&quot; BASIS. THE MARKETPLACE EXPRESSLY AND CATEGORICALLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT ANY DEFECTS OR BUGS WILL BE CORRECTED.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.2. THIRD-PARTY DATA AND API LATENCY.</h3>
      <p className="text-gray-700 mb-4">
        YOU ACKNOWLEDGE THAT THE MARKETPLACE RELIES ON REAL-TIME DATA FEEDS FROM THIRD-PARTY GOVERNMENT AGENCIES (INCLUDING THE FMCSA, DOT, AND STATE SECRETARIES OF STATE). WE DO NOT WARRANT THE ACCURACY, COMPLETENESS, TIMELINESS, OR RELIABILITY OF SUCH DATA. YOU AGREE THAT THE MARKETPLACE SHALL NOT BE LIABLE FOR ANY DISCREPANCIES CAUSED BY API LATENCY, GOVERNMENT SERVER OUTAGES, OR ERRORS IN THE PUBLIC RECORD (E.G., IF THE SAFER SYSTEM ERRONEOUSLY LISTS A REVOKED CARRIER AS &quot;ACTIVE&quot;).
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.3. REGULATORY AND LEGAL DISCLAIMER.</h3>
      <p className="text-gray-700 mb-4">
        THE MARKETPLACE IS NOT A LAW FIRM, COMPLIANCE OFFICER, OR GOVERNMENT AGENT. WE MAKE NO REPRESENTATION, WARRANTY, OR GUARANTEE REGARDING: (A) THE LIKELIHOOD THAT THE FMCSA WILL APPROVE ANY TRANSFER OF OPERATING AUTHORITY (FORM OP-1(FC)); (B) THE TIMEFRAME WITHIN WHICH SUCH APPROVAL MAY BE GRANTED (WHICH MAY EXCEED 30-60 DAYS); OR (C) THE ABSENCE OF ANY &quot;NEW ENTRANT AUDIT,&quot; COMPLIANCE REVIEW, OR INTERVENTION TRIGGERED BY THE TRANSACTION. YOU ASSUME ALL REGULATORY RISKS ASSOCIATED WITH BUYING OR SELLING A TRANSPORTATION ENTITY. YOU ACKNOWLEDGE THAT FEDERAL REGULATIONS (49 CFR) ARE SUBJECT TO CHANGE AND THAT SUCH CHANGES MAY MATERIALLY AFFECT THE VALUE OF AN ASSET AFTER PURCHASE.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.4. NO PROFESSIONAL ADVICE OR VALUATION GUARANTEE.</h3>
      <p className="text-gray-700 mb-4">
        ANY &quot;VALUATION ESTIMATES,&quot; &quot;PRICE PREDICTORS,&quot; OR &quot;MARKET COMPARABLES&quot; DISPLAYED ON THE PLATFORM ARE AUTOMATED ESTIMATES PROVIDED FOR INFORMATIONAL PURPOSES ONLY. THEY DO NOT CONSTITUTE A PROFESSIONAL APPRAISAL (USPAP COMPLIANT) OR A FAIRNESS OPINION. WE DO NOT WARRANT THAT ANY ASSET LISTED ON THE PLATFORM WILL SELL FOR A SPECIFIC PRICE OR WITHIN A SPECIFIC TIMEFRAME. YOU AGREE TO RELY SOLELY ON YOUR OWN INDEPENDENT DUE DILIGENCE AND PROFESSIONAL ADVISORS (ATTORNEYS, ACCOUNTANTS) BEFORE ENTERING INTO ANY TRANSACTION. WE DO NOT WARRANT THE ACCURACY, AUTHENTICITY, OR COMPLETENESS OF ANY FINANCIAL DOCUMENTS (PROFIT &amp; LOSS STATEMENTS, TAX RETURNS, BANK STATEMENTS) UPLOADED TO THE DATA ROOM BY USERS. YOU ACKNOWLEDGE THAT &quot;PRO FORMA&quot; OR &quot;PROJECTED&quot; FINANCIALS ARE SPECULATIVE IN NATURE. THE MARKETPLACE DOES NOT AUDIT OR VERIFY USER FINANCIALS. YOU AGREE TO RELY SOLELY ON YOUR OWN INDEPENDENT DUE DILIGENCE AND PROFESSIONAL ADVISORS (ATTORNEYS, ACCOUNTANTS) BEFORE ENTERING INTO ANY TRANSACTION.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 7: LIMITATION OF LIABILITY; RELEASE; WAIVER OF CLAIMS</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.1. EXCLUSION OF CONSEQUENTIAL AND PUNITIVE DAMAGES.</h3>
      <p className="text-gray-700 mb-4">
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE ARIZONA LAW, IN NO EVENT SHALL THE MARKETPLACE, ITS PARENT COMPANIES, AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS (THE &quot;MARKETPLACE PARTIES&quot;) BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES. THIS EXCLUSION APPLIES WITHOUT LIMITATION TO DAMAGES FOR LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF GOODWILL, LOSS OF DATA, BUSINESS INTERRUPTION, OR COST OF SUBSTITUTE GOODS, WHETHER ARISING IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR OTHERWISE, EVEN IF THE MARKETPLACE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.2. ABSOLUTE CAP ON DIRECT LIABILITY.</h3>
      <p className="text-gray-700 mb-4">
        NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, THE MARKETPLACE’S CUMULATIVE AGGREGATE LIABILITY TO YOU FOR ANY CAUSE OF ACTION ARISING OUT OF OR RELATING TO THESE TERMS, THE SERVICES, OR YOUR USE OF THE PLATFORM SHALL IN NO EVENT EXCEED THE GREATER OF: (A) THE TOTAL AMOUNT OF FEES ACTUALLY PAID BY YOU TO THE MARKETPLACE DURING THE SIX (6) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM; OR (B) ONE HUNDRED DOLLARS ($100.00). YOU ACKNOWLEDGE AND AGREE THAT THIS LIMITATION OF LIABILITY IS A FUNDAMENTAL BASIS OF THE BARGAIN BETWEEN THE PARTIES, AND THAT THE MARKETPLACE WOULD NOT BE ABLE TO PROVIDE THE SERVICES ON AN ECONOMICALLY FEASIBLE BASIS WITHOUT SUCH LIMITATIONS.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.3. SPECIFIC WAIVER: NEGLIGENT ENTRUSTMENT AND ALGORITHMIC LIABILITY.</h3>
      <p className="text-gray-700 mb-4">
        YOU EXPRESSLY ACKNOWLEDGE THAT THE MARKETPLACE FUNCTIONS SOLELY AS AN INFORMATION INTERMEDIARY AND DOES NOT TAKE POSSESSION, CUSTODY, OR CONTROL OF ANY VEHICLE, EQUIPMENT, OR OPERATING AUTHORITY LISTED ON THE PLATFORM. ACCORDINGLY, YOU HEREBY IRREVOCABLY WAIVE, RELEASE, AND DISCHARGE THE MARKETPLACE PARTIES FROM ANY CLAIM, DEMAND, OR CAUSE OF ACTION ALLEGING THAT THE MARKETPLACE: (A) &quot;NEGLIGENTLY ENTRUSTED&quot; A VEHICLE OR OPERATING AUTHORITY TO AN UNSAFE, UNQUALIFIED, OR INSOLVENT BUYER OR SELLER; (B) IS STRICTLY LIABLE AS A &quot;SELLER,&quot; &quot;DISTRIBUTOR,&quot; OR &quot;SUPPLIER&quot; UNDER ARIZONA PRODUCT LIABILITY LAW (A.R.S. § 12-681 ET SEQ.); OR (C) WAS NEGLIGENT IN THE DESIGN OR OPERATION OF ITS MATCHING ALGORITHMS, SEARCH FILTERS, OR &quot;SAFE-SCREENING&quot; PROTOCOLS. YOU AGREE THAT YOU RETAIN THE SOLE AND EXCLUSIVE DUTY TO VET THE SAFETY PROFILE (INCLUDING CSA SCORES AND INSURANCE STATUS) OF ANY COUNTERPARTY PRIOR TO TRANSACTING.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.4. EXCEPTION FOR GROSS NEGLIGENCE.</h3>
      <p className="text-gray-700 mb-4">
        NOTHING IN THIS AGREEMENT SHALL LIMIT OR EXCLUDE THE MARKETPLACE’S LIABILITY FOR ITS OWN GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR FRAUD, OR FOR ANY OTHER LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED BY APPLICABLE LAW.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 8: INDEMNIFICATION; DUTY TO DEFEND; TAX LIABILITY</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.1. Broad Form Indemnification and Hold Harmless.</h3>
      <p className="text-gray-700 mb-4">
        You agree to unconditionally indemnify, defend, and hold harmless the Marketplace, its parent entities, subsidiaries, affiliates, and their respective directors, officers, employees, agents, successors, and assigns (collectively, the &quot;Indemnified Parties&quot;) from and against any and all losses, damages, liabilities, deficiencies, claims, actions, judgments, settlements, interest, awards, penalties, fines, costs, or expenses of whatever kind, including reasonable attorneys’ fees, the costs of enforcing any right to indemnification under this Agreement, and the cost of pursuing any insurance providers. This indemnification obligation extends to any claim or cause of action arising out of or resulting from your use of the Services, your breach of any representation, warranty, or covenant contained in these Terms, your violation of any applicable federal, state, or local law, regulation, or ordinance (including FMCSA regulations and Tax Laws), or any claim that User Content submitted by you infringes or misappropriates the intellectual property or privacy rights of any third party. You expressly acknowledge that this duty to indemnify encompasses claims arising from the Indemnified Parties&apos; own passive negligence to the maximum extent permitted by Arizona law.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.2. Assumption of Defense and Selection of Counsel.</h3>
      <p className="text-gray-700 mb-4">
        You acknowledge that your duty to defend the Indemnified Parties is absolute, immediate, and separate from your duty to indemnify. Upon the assertion of any claim or the commencement of any action against an Indemnified Party, you shall immediately assume the defense thereof with legal counsel reasonably acceptable to the Marketplace. The Marketplace reserves the right to employ its own separate counsel and participate in the defense of any such claim; provided, however, that if the Marketplace reasonably determines that a conflict of interest exists or that you have failed to diligently defend the action, the Marketplace may assume exclusive control of the defense, and you shall be liable for all reasonable legal fees and expenses incurred by the Marketplace in connection therewith.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.3. Settlement Restrictions and Tax Indemnity.</h3>
      <p className="text-gray-700 mb-4">
        You shall not settle or compromise any claim or consent to the entry of any judgment without the prior written consent of the Marketplace, unless such settlement involves solely the payment of money by you and includes a complete, unconditional release of the Indemnified Parties from all liability. Furthermore, regarding any transaction facilitated through the Marketplace, you specifically agree to indemnify and reimburse the Marketplace for any sales tax, use tax, Arizona Transaction Privilege Tax (TPT), or transfer taxes, along with any associated penalties and interest, that may be assessed against the Marketplace by any taxing authority as a result of your failure to properly calculate, collect, or remit such taxes.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.4. Subpoena Compliance and Third-Party Discovery.</h3>
      <p className="text-gray-700 mb-4">
        If the Marketplace is required to provide information, produce documents, or provide witness testimony in connection with any dispute, litigation, or arbitration between you and another User (or a third party), and the Marketplace is not a named party to such proceeding, you agree to reimburse the Marketplace for all reasonable costs and expenses incurred in complying with such request. This includes, but is not limited to, the hourly rates of our legal counsel and the operational costs of our engineering team in retrieving data, which shall be billed to you at a reasonable hourly rate.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 9: DISPUTE RESOLUTION; MANDATORY BINDING ARBITRATION; CLASS ACTION WAIVER</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.1. Mandatory Informal Dispute Resolution Process.</h3>
      <p className="text-gray-700 mb-4">
        The parties acknowledge that formal legal proceedings are expensive and disruptive. Therefore, prior to initiating any arbitration or court proceeding, you and the Marketplace agree to first attempt to resolve any dispute, controversy, or claim arising out of or relating to these Terms (a &quot;Dispute&quot;) informally. You must send a written &quot;Notice of Dispute&quot; to the Marketplace’s Legal Department at [Email Address], including your name, account information, and a detailed description of the Dispute and the relief sought. The parties agree to negotiate in good faith for a period of sixty (60) days from the receipt of such Notice. The statute of limitations shall be tolled during this negotiation period. You agree that strict compliance with this Section 9.1 is a condition precedent to commencing arbitration, and any arbitration filed without fully exhausting this informal process shall be immediately dismissed.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.2. Binding Arbitration and Delegation Clause.</h3>
      <p className="text-gray-700 mb-4">
        If the Dispute is not resolved within the sixty (60) day period, specifically excepting &quot;Equitable Claims&quot; (defined below) and small claims actions, such Dispute shall be exclusively resolved by binding individual arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. The arbitration shall be conducted in Phoenix, Arizona, before a single neutral arbitrator. The parties expressly agree that this Agreement evidences a transaction involving interstate commerce and shall be governed by the Federal Arbitration Act (9 U.S.C. § 1 et seq.). DELEGATION PROVISION: The arbitrator, and not any federal, state, or local court or agency, shall have exclusive authority to resolve any dispute relating to the interpretation, applicability, enforceability, or formation of this Agreement, including but not limited to any claim that all or any part of this Agreement is void or voidable.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.3. Class Action and Jury Trial Waiver.</h3>
      <p className="text-gray-700 mb-4">
        YOU AND THE MARKETPLACE HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE IN COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR A JURY. FURTHERMORE, TO THE FULLEST EXTENT PERMITTED BY LAW, YOU AGREE THAT ANY ARBITRATION SHALL BE CONDUCTED IN YOUR INDIVIDUAL CAPACITY ONLY AND NOT AS A CLASS ACTION OR OTHER REPRESENTATIVE ACTION. YOU EXPRESSLY WAIVE ANY RIGHT TO FILE A CLASS ACTION OR SEEK RELIEF ON A CLASS BASIS. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON&apos;S CLAIMS.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.4. Mass Arbitration and &quot;Bellwether&quot; Protocol.</h3>
      <p className="text-gray-700 mb-4">
        To prevent the abuse of the arbitration process, if twenty-five (25) or more similar demands for arbitration are filed against the Marketplace by the same or coordinated counsel (&quot;Mass Filing&quot;), the parties agree to a &quot;Bellwether&quot; procedure: (i) The AAA shall administer only ten (10) initial test cases (five selected by each side); (ii) All other claims shall be stayed and the statute of limitations tolled; (iii) The parties shall mediate the remaining claims based on the outcomes of the test cases. You agree that this protocol is designed to ensure efficient resolution and is not an unconscionable burden.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.5. Exceptions: Equitable Relief and Small Claims.</h3>
      <p className="text-gray-700 mb-4">
        Notwithstanding the arbitration mandate, either party may: (a) bring an individual action in small claims court if the claim qualifies and remains in that court; or (b) seek immediate injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of a party&apos;s copyrights, trademarks, trade secrets, patents, or other intellectual property rights, or to enjoin data scraping or fee circumvention.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.6. Contractual Statute of Limitations.</h3>
      <p className="text-gray-700 mb-4">
        YOU AGREE THAT ANY CAUSE OF ACTION OR CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES MUST BE COMMENCED WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES. OTHERWISE, SUCH CAUSE OF ACTION OR CLAIM IS PERMANENTLY BARRED.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 10: GENERAL PROVISIONS; MISCELLANEOUS</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.1. Entire Agreement and Merger.</h3>
      <p className="text-gray-700 mb-4">
        These Terms, along with the Privacy Policy, the Community Guidelines, and any specific Listing Agreements entered into by you, constitute the sole and entire agreement between you and the Marketplace with respect to the subject matter contained herein. This Agreement supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding such subject matter. You acknowledge that you have not relied on any statement, promise, or representation made by any Marketplace employee, agent, or sales representative that is not expressly contained in these Terms.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.2. Force Majeure (Government &amp; API Failures).</h3>
      <p className="text-gray-700 mb-4">
        The Marketplace shall not be liable or responsible to you, nor be deemed to have defaulted under or breached this Agreement, for any failure or delay in fulfilling or performing any term of this Agreement when and to the extent such failure or delay is caused by or results from acts beyond the Marketplace’s reasonable control (a &quot;Force Majeure Event&quot;). This includes, without limitation: (a) acts of God; (b) flood, fire, earthquake, or explosion; (c) war, invasion, hostilities, or terrorist threats; (d) national or regional emergency; (e) shutdowns, outages, API latencies, or data failures of the FMCSA, DOT, or other government portals; (f) cyber-attacks or internet service provider failures; or (g) changes in law or regulation preventing the operation of the Marketplace.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.3. Assignment and Delegation.</h3>
      <p className="text-gray-700 mb-4">
        This Agreement is personal to you. You may not assign, transfer, delegate, or sublicense any of your rights or obligations under these Terms—including your User Account and verified status—without the prior written consent of the Marketplace. Any purported assignment in violation of this Section shall be null and void. The Marketplace may freely assign or transfer these Terms, in whole or in part, without restriction (e.g., in connection with a merger, acquisition, reorganization, or sale of assets).
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.4. Severability and &quot;Blue Pencil&quot; Rule.</h3>
      <p className="text-gray-700 mb-4">
        If any term or provision of this Agreement is invalid, illegal, or unenforceable in any jurisdiction, such invalidity shall not affect any other term or provision of this Agreement or invalidate or render unenforceable such term or provision in any other jurisdiction. The parties expressly authorize the court or arbitrator to &quot;blue pencil&quot; or modify the invalid provision to the minimum extent necessary to make it valid and enforceable while preserving the original commercial intent of the parties.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.5. Third-Party Links and Resources.</h3>
      <p className="text-gray-700 mb-4">
        The Services may contain links to third-party websites, services, or resources (e.g., Escrow.com, FMCSA SAFER, insurance providers). You acknowledge that the Marketplace is not responsible or liable for: (i) the availability or accuracy of such websites or resources; or (ii) the content, products, or services on or available from such websites or resources. Links to such websites or resources do not imply any endorsement by the Marketplace. You acknowledge sole responsibility for and assume all risk arising from your use of any such websites or resources.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.6. Electronic Communications and Signatures (E-SIGN Consent).</h3>
      <p className="text-gray-700 mb-4">
        By clicking &quot;I Agree&quot; or using the Services, you consent to receive communications from us electronically, including via email, text messages, and push notifications. You agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing. You explicitly agree that your clicking of the &quot;I Agree&quot; button constitutes a valid &quot;Electronic Signature&quot; under the Electronic Signatures in Global and National Commerce Act (E-SIGN Act) and the Arizona Electronic Transactions Act.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.7. Survival.</h3>
      <p className="text-gray-700 mb-4">
        The rights and obligations set forth in Article 4 (Confidentiality), Article 5 (Intellectual Property), Article 7 (Limitation of Liability), Article 8 (Indemnification), and Article 9 (Dispute Resolution) shall survive the termination, expiration, or cancellation of this Agreement or your account for any reason.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.8. No Waiver.</h3>
      <p className="text-gray-700 mb-4">
        No waiver by the Marketplace of any term or condition set out in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of the Marketplace to assert a right or provision under these Terms shall not constitute a waiver of such right or provision.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.9. No Duty of Data Retention.</h3>
      <p className="text-gray-700 mb-4">
        You acknowledge that the Marketplace is not a data storage service or a &quot;record keeper&quot; for your regulatory compliance. While we may retain certain data for our own compliance purposes, we generally have no obligation to store, maintain, or provide you with copies of any Content, Listings, or Data Room logs you provide or access. You are solely responsible for creating and maintaining your own backups of your data and transaction records as required by the FMCSA, IRS, or other applicable laws. and then
      </p>
    </div>
  )
}

export const BuyerTermsContent = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Buyer Terms of Service &amp; Confidentiality Agreement</h1>
      <p className="text-sm text-gray-500 mb-2">Last Updated: {currentDate}</p>
      <p className="text-sm text-gray-500 mb-6">Jurisdiction: State of Arizona</p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm font-semibold text-amber-800">
          IMPORTANT NOTICE: THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS ACTION RIGHTS AS DETAILED IN ARTICLE 10. BY CLICKING &quot;I AGREE&quot; OR ACCESSING THE PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS.
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 1: FINANCIAL SOLVENCY, REGULATORY FITNESS, AND COMPLIANCE COVENANTS</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.1. Absolute Warranty of Liquidity and Prohibition on Speculative Bidding.</h3>
      <p className="text-gray-700 mb-4">
        By requesting access to any Confidential Data Room, submitting a Letter of Intent (LOI), or placing a formal bid on the Platform, Buyer unconditionally represents, warrants, and covenants that it possesses, or has secured binding, irrevocable written commitments for, immediately available liquid funds sufficient to pay the full Purchase Price plus all transaction fees and closing costs. The Marketplace reserves the right, in its sole and absolute discretion, to condition access to any Data Room or the acceptance of any bid upon Buyer’s production of verifiable Proof of Funds, which Buyer agrees must be in the form of a current bank statement from a U.S.-domiciled financial institution in Buyer’s name, an irrevocable Letter of Credit, or a binding loan commitment letter from a recognized lender; Buyer acknowledges that &quot;soft&quot; commitment letters, &quot;letters of interest,&quot; or unverified cryptocurrency holdings shall not constitute valid Proof of Funds. Buyer explicitly acknowledges that submitting an offer contingent upon future financing that has not yet been secured (a &quot;Speculative Bid&quot;) without express written disclosure to the Marketplace constitutes a material breach of this Agreement and a fraudulent inducement. In the event Buyer defaults on a binding offer or fails to close the transaction due to a lack of funds or financing failure, Buyer agrees to pay the Marketplace a Break-Up Fee equal to five percent (5.0%) of the offer amount. The parties stipulate that this Break-Up Fee constitutes Liquidated Damages and a reasonable pre-estimate of the administrative costs, reputational damage, and loss of market momentum suffered by the Marketplace and Seller, and does not constitute a penalty.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.2. Warranties of Regulatory Standing, Anti-Chameleon Compliance, and Safety History.</h3>
      <p className="text-gray-700 mb-4">
        Buyer represents and warrants that it is a sophisticated purchaser with full knowledge of Federal Motor Carrier Safety Administration (FMCSA) regulations and assumes all risks associated with the transfer of operating authorities. Buyer strictly warrants that neither Buyer, nor any of its principals, affiliates, beneficial owners, or entities under common control, is currently subject to a Federal Out-of-Service (OOS) Order, nor has Buyer been the subject of an FMCSA &quot;Imminent Hazard&quot; order or a pattern of safety violations that would reasonably be expected to trigger regulatory intervention. Buyer certifies that it is not utilizing the Marketplace to acquire a Department of Transportation (DOT) or Motor Carrier (MC) number for the purpose of evading a negative safety audit, civil penalty, Compliance Review, or enforcement action, commonly known as a &quot;Chameleon Carrier&quot; scheme. Buyer expressly acknowledges the provisions of 49 CFR § 385.1007 regarding Successor Liability and warrants that if it intends to consolidate the acquired assets into an existing fleet, it has conducted its own independent legal analysis regarding the potential attribution of the Seller’s safety history to Buyer’s existing operations. Buyer hereby releases, indemnifies, and holds the Marketplace harmless from any liability, fines, or penalties arising from the FMCSA’s decision to merge the safety records of Buyer and Seller post-closing or to deny the transfer of authority based on Buyer’s regulatory history.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.3. Anti-Money Laundering, Sanctions, and Corporate Transparency Covenants.</h3>
      <p className="text-gray-700 mb-4">
        Buyer covenants that all funds utilized for the purchase of assets on the Marketplace are derived exclusively from legitimate, non-criminal sources and do not constitute the proceeds of illegal activity, money laundering, drug trafficking, or terrorism financing. Buyer represents and warrants that it is not organized in, resident in, or acting on behalf of any person located in a country or territory subject to comprehensive U.S. sanctions administered by the Office of Foreign Assets Control (OFAC), nor is Buyer or any of its Beneficial Owners (as defined by the Corporate Transparency Act) listed on the U.S. Treasury Department’s Specially Designated Nationals (SDN) list or the Department of Commerce’s Entity List. To facilitate compliance with the Corporate Transparency Act and federal Know Your Customer (KYC) regulations, Buyer agrees to provide the Marketplace and the designated Third-Party Escrow Agent with a full schedule of its Beneficial Owners and any requested &quot;Source of Funds&quot; documentation within two (2) business days of such request. Buyer acknowledges that the Marketplace prohibits the use of opaque offshore shell companies or &quot;bearer share&quot; entities to conceal the true identity of the purchaser. Buyer agrees that failure to timely provide such documentation constitutes a material breach of this Agreement, resulting in the immediate cancellation of the transaction and the forfeiture of any deposits held in Escrow to cover compliance costs.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.4. Platform as Passive Advertising Medium and Software Provider.</h3>
      <p className="text-gray-700 mb-4">
        The Marketplace owns and operates a proprietary digital interface designed exclusively to function as a provider of software and a neutral advertising medium through which independent Sellers and Buyers of transportation entities may identify potential counterparties. The Marketplace is not, and shall not be deemed to be, a licensed securities broker-dealer, an investment adviser, a real estate broker, a legal advisor, or a fiduciary of any kind to the Seller. The Marketplace operates in strict compliance with the &quot;M&amp;A Broker Exemption&quot; codified in Section 15(b)(13) of the Securities Exchange Act of 1934. Consistent with this federal exemption, the Marketplace limits its activities strictly to bringing together buyers and sellers of &quot;Eligible Privately Held Companies&quot; and providing the technological infrastructure for the secure exchange of documents. The Marketplace expressly disclaims any authority to, and covenants that it shall not: (a) bind any party to a transaction; (b) directly participate in the negotiation of the purchase price or deal structure; (c) advise any party on the fairness, tax consequences, or valuation of a transaction; or (d) handle, hold, or take custody of user funds or securities at any time. Seller acknowledges and agrees that the Marketplace acts solely as a passive marketing platform and does not act as Seller’s agent, advocate, or representative in any capacity. All terms of the transaction, including price and structure, are determined solely by the independent business judgment of the Seller and Buyer. Furthermore, the Marketplace provides no warranty that the listing of an entity will result in a successful sale, nor does it guarantee the solvency, regulatory standing, or financial qualifications of any Buyer introduced through the Platform.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 2: CONFIDENTIALITY; RESTRICTIVE COVENANTS; DATA SECURITY</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1. Confidentiality Obligations and Vicarious Liability for Representatives. Buyer acknowledges that access to the Data Room confers a position of trust involving highly sensitive, proprietary, and trade secret information belonging to the Seller, including but not limited to any information viewed, read, or heard in the Data Room, whether or not physically downloaded. This explicitly includes screenshots, handwritten notes, photographs of the screen, and mental impressions retained by the Buyer, customer identities, route profitability analysis, driver personnel files, and safety management protocols (collectively, &quot;Confidential Information&quot;). Buyer covenants to hold all Confidential Information in strict confidence and to use such information solely and exclusively for the bona fide purpose of evaluating the potential acquisition of the specific entity listed (the &quot;Permitted Purpose&quot;). Buyer shall not disclose, disseminate, or make available any Confidential Information to any third party, provided, however, that Buyer may disclose specific information to its directors, officers, employees, legal counsel, and financial advisors (collectively, &quot;Representatives&quot;) solely to the extent necessary for the Permitted Purpose. As a condition of such disclosure, Buyer agrees that it shall remain jointly and severally liable for any breach of this Agreement by its Representatives and shall ensure that such Representatives are bound by confidentiality obligations at least as restrictive as those contained herein. Buyer explicitly acknowledges that this Agreement grants no license, right, title, or interest in the Confidential Information, and that all such information remains the exclusive property of the Seller.</h3>
      <p className="text-gray-700 mb-4">
        Buyer is strictly prohibited from &quot;tipping off,&quot; alerting, or encouraging any third party (including industry contacts, friends, or unrelated equity partners) to pursue the Seller. If a third party acquires the Seller based on information leaked by Buyer, Buyer shall be fully liable for the Success Fee as if Buyer had purchased the asset itself.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2. Non-Solicitation of Key Personnel and Prohibition on &quot;Poaching.&quot; Buyer acknowledges that the Seller’s workforce—specifically its commercial drivers, dispatchers, and safety managers—constitutes a primary and irreplaceable asset of the business. Accordingly, Buyer covenants that for a period of twenty-four (24) months following Buyer’s last access to the Data Room (the &quot;Restricted Period&quot;), Buyer shall not, directly or indirectly, solicit, induce, recruit, encourage, or attempt to hire any of the Seller’s employees or independent contractors identified in the Confidential Information to terminate their relationship with the Seller.</h3>
      <p className="text-gray-700 mb-4">
        This prohibition includes, without limitation, solicitation via third-party recruiters, headhunters, or targeted social media campaigns. Buyer agrees that this restriction is narrowly tailored to protect the Seller’s legitimate business interest in its trained workforce and does not unreasonably restrain trade. To ensure enforceability, the parties stipulate that if Buyer hires a Restricted Employee during the Restricted Period, it shall be presumed that such hiring resulted from the misuse of Confidential Information.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3. Non-Interference with Customer and Vendor Relationships.</h3>
      <p className="text-gray-700 mb-4">
        Buyer covenants that during the Restricted Period, it shall not utilize any Confidential Information to solicit, divert, appropriate, or otherwise interfere with the business relationship between the Seller and any of its current or prospective customers, shippers, brokers, or vendors. Buyer is strictly prohibited from contacting any customer or vendor identified in the Data Room regarding the potential transaction or the Seller’s business performance without the Seller’s prior, express written consent. Buyer acknowledges that any attempt to circumvent the Seller and contract directly with the Seller’s customers using pricing or lane data obtained through the Marketplace constitutes a misappropriation of trade secrets and a tortious interference with contractual relations.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.4. Remedies; Injunctive Relief; Liquidated Damages.</h3>
      <p className="text-gray-700 mb-4">
        Buyer acknowledges that a breach of the restrictive covenants in this Article 2 will cause the Seller and the Marketplace irreparable harm, the exact amount of which would be difficult or impossible to ascertain. Accordingly, Buyer agrees that in the event of a breach or threatened breach, the Seller or the Marketplace shall be entitled to: (i) immediate equitable relief, including a temporary restraining order and permanent injunction, without the necessity of posting a bond or proving actual damages; and (ii) Liquidated Damages equal to fifty percent (50%) of the annual compensation of any solicited employee or the annual revenue of any diverted customer. Buyer expressly stipulates that these Liquidated Damages represent a reasonable and fair pre-estimate of the likely damages (including recruitment costs, lost productivity, and retraining expenses) and do not constitute a penalty. Buyer hereby waives any defense that such Liquidated Damages are punitive or unconscionable.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.5. Mandatory Return or Destruction of Data.</h3>
      <p className="text-gray-700 mb-4">
        Upon the termination of this Agreement, the rejection of an offer, or a written request by the Marketplace or Seller at any time, Buyer shall immediately cease all use of the Confidential Information and shall, within five (5) business days, return or strictly destroy all copies, summaries, analyses, or extracts of the Confidential Information in its possession or control, including permanently deleting such data from all servers, cloud storage, and backup systems. Upon request, an officer of the Buyer shall certify in writing that such destruction has been completed in full compliance with this Section.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.6. Whistleblower Immunity Notice.</h3>
      <p className="text-gray-700 mb-4">
        Notwithstanding the foregoing, and pursuant to the Defend Trade Secrets Act of 2016 (18 U.S.C. § 1833(b)), Buyer is hereby notified that it shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that is made: (i) in confidence to a federal, state, or local government official, either directly or indirectly, or to an attorney, solely for the purpose of reporting or investigating a suspected violation of law; or (ii) in a complaint or other document filed in a lawsuit or other proceeding, if such filing is made under seal.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 3: FEE INTEGRITY; NON-CIRCUMVENTION; ESCROW MANDATE</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1. Non-Circumvention, &quot;Any Transaction&quot; Logic, and Affiliate Liability.</h3>
      <p className="text-gray-700 mb-4">
        Buyer acknowledges that the Marketplace’s business model depends entirely on the collection of Success Fees from transactions facilitated by its proprietary network. Accordingly, Buyer covenants that it shall not, directly or indirectly, solicit, negotiate with, or enter into any business arrangement with a Seller introduced through the Marketplace without the Marketplace’s involvement and full compensation. This restriction applies broadly to any &quot;Transaction,&quot; defined as the purchase, lease, merger, joint venture, management agreement, or acquisition of any assets (including equipment, customer lists, or employees) involving the Seller. This non-circumvention obligation extends to Buyer’s affiliates, subsidiaries, parent companies, and any entity or individual acting in concert with Buyer. If Buyer (or its affiliate) consummates any Transaction involving a Seller introduced through the Marketplace within twenty-four (24) months of Buyer’s last access to the Data Room (the &quot;Tail Period&quot;), Buyer shall be immediately liable for the full Success Fee. To prevent avoidance disputes, Buyer agrees that if it enters into a transaction with a Seller during the Tail Period, it shall be conclusively presumed that the Marketplace was the procuring cause of such transaction. Buyer acknowledges that access to the Data Room constitutes a valuable introduction. Accordingly, Buyer agrees that if it consummates a transaction with the Seller within the Tail Period, the Marketplace shall be conclusively and irrefutably presumed to be the &quot;Procuring Cause&quot; of the transaction, regardless of whether Buyer claims to have had a prior relationship with the Seller, unless Buyer disclosed such &quot;Prior Relationship&quot; in writing to the Marketplace before accessing the Data Room.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2. Deemed Value and Liquidated Damages for Evasion.</h3>
      <p className="text-gray-700 mb-4">
        In the event Buyer breaches Section 3.1 by consummating a Transaction &quot;off-platform&quot; or by failing to report a Transaction to the Marketplace, Buyer acknowledges that calculating the exact lost revenue is difficult if the parties conceal the purchase price. Accordingly, Buyer agrees that for purposes of calculating the Success Fee in a circumvention scenario, the &quot;Transaction Value&quot; shall be deemed to be the greater of: (i) the Seller’s original Asking Price listed on the Platform; or (ii) the actual gross consideration paid. Furthermore, Buyer agrees to pay a penalty surtax equal to twenty-five percent (25%) of the Success Fee to cover the Marketplace’s enforcement costs and legal fees. Buyer stipulates that this provision is a necessary protection against fraud and does not constitute an unenforceable penalty. Buyer further agrees that it shall be jointly and severally liable with the Seller for any Success Fees due to the Marketplace resulting from a circumvention event.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.3. Mandatory Escrow, &quot;Side Payment&quot; Prohibition, and Total Consideration.</h3>
      <p className="text-gray-700 mb-4">
        To ensure the security of funds, regulatory compliance, and the accurate calculation of fees, Buyer agrees that one hundred percent (100%) of the &quot;Total Consideration&quot; for any Transaction must be processed exclusively through the Marketplace’s designated Third-Party Escrow Service. &quot;Total Consideration&quot; includes cash, stock, assumed debt, earn-outs, seller financing, consulting fees, and non-compete payments. Buyer is strictly prohibited from making &quot;side payments&quot; or &quot;under-the-table&quot; transfers to Seller via wire, cash, cryptocurrency, or equipment swaps to artificially lower the recorded purchase price. Buyer acknowledges that making direct payments to a Seller violates the Marketplace’s M&amp;A Broker Exemption (SEC Section 15(b)(13)) and exposes Buyer to significant risk of fraud. The Marketplace expressly disclaims all liability for the loss, theft, or misappropriation of any funds sent outside the authorized Escrow process, and Buyer releases the Marketplace from any claims related to such direct payments.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.4. Audit Rights and Post-Closing Verification.</h3>
      <p className="text-gray-700 mb-4">
        Buyer agrees that the Marketplace shall have the right, upon reasonable notice and during normal business hours, to audit Buyer’s books, records, and bank statements for a period of two (2) years following the termination of this Agreement solely to verify compliance with the Non-Circumvention and Fee Protection provisions herein. If such audit reveals that Buyer consummated a Transaction with a Seller introduced by the Marketplace without paying the required Success Fee, or under-reported the Total Consideration to lower the fee, Buyer shall immediately pay the deficiency plus interest at the rate of 1.5% per month, along with the full cost of the audit and reasonable attorneys&apos; fees incurred by the Marketplace in enforcing this right.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 4: DUE DILIGENCE; DISCLAIMERS; ASSUMPTION OF RISK</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1. Absolute Duty of Independent Investigation and Non-Reliance.</h3>
      <p className="text-gray-700 mb-4">
        Buyer expressly acknowledges and agrees that the Marketplace functions exclusively as a passive information intermediary and does not inspect, audit, verify, or validate the accuracy, completeness, or authenticity of any Data Room contents, listing descriptions, or Seller representations. Buyer covenants that it is relying solely and exclusively upon its own independent investigation, due diligence, and the advice of its own legal, financial, and tax advisors in connection with the transaction, and not upon any information, valuation estimate, &quot;Safe-Screening&quot; badge, or representation provided by the Marketplace. Buyer acknowledges that &quot;Pro Forma&quot; financials, &quot;EBITDA Add-Backs,&quot; and &quot;Projected Earnings&quot; provided by Sellers are speculative marketing materials, not audited financial statements, and should not be relied upon as guarantees of future performance. Buyer hereby irrevocably waives and releases the Marketplace from any and all liability, claims, or causes of action arising out of errors, omissions, or misrepresentations in the Seller’s data, acknowledging that the Marketplace serves merely as a venue for the exchange of such information.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.2. &quot;As-Is, Where-Is&quot; Disclaimer Regarding Equipment and Assets.</h3>
      <p className="text-gray-700 mb-4">
        To the maximum extent permitted by applicable law, Buyer acknowledges that any tangible assets (including tractors, trailers, and ELD hardware) included in a transaction are sold on an &quot;AS-IS, WHERE-IS,&quot; and &quot;WITH ALL FAULTS&quot; basis, without any warranties of any kind, express or implied, from the Marketplace. The Marketplace explicitly disclaims all implied warranties of merchantability, fitness for a particular purpose, and mechanical condition. Buyer assumes full responsibility for conducting physical inspections, engine oil analysis, and maintenance record audits prior to closing. Buyer agrees that the Marketplace shall have no liability for mechanical breakdowns, undisclosed accidents, odometer discrepancies, or the failure of any equipment to meet DOT inspection standards post-closing.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.3. Regulatory Assumption of Risk and Successor Liability.</h3>
      <p className="text-gray-700 mb-4">
        Buyer acknowledges that the transfer of federal operating authority is subject to the sole and absolute discretion of the FMCSA and DOT. Buyer assumes all risks associated with regulatory delays, denials, or &quot;New Entrant Audits&quot; triggered by the transaction. Buyer specifically acknowledges the risk of &quot;Successor Liability&quot; under 49 CFR § 385.1007, whereby the FMCSA may attribute the adverse safety history, crash data, and audit scores of the Seller to the Buyer’s existing fleet, potentially resulting in a rating downgrade or an Out-of-Service Order. Buyer agrees that the Marketplace has not provided, and will not provide, legal advice regarding Successor Liability, &quot;Chameleon Carrier&quot; regulations, or the structure of the transaction. Buyer represents that it has consulted with qualified transportation counsel regarding these federal risks and accepts the potential regulatory consequences of the acquisition.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.4. Tax, Insurance, and Lien Liability.</h3>
      <p className="text-gray-700 mb-4">
        Buyer acknowledges that the acquisition of a transportation entity may carry significant successor liabilities regarding unpaid taxes and insurance insurability. Buyer assumes the sole duty to conduct comprehensive lien searches (UCC-1), tax clearance searches (including IFTA fuel taxes, IRP registration fees, and IRS payroll taxes), and insurance loss run reviews prior to closing. Buyer acknowledges that the Marketplace does not verify the &quot;insurability&quot; of any Seller, and Buyer accepts the risk that the acquired entity may be uninsurable or subject to prohibitive premium increases due to the Seller’s prior loss history. Buyer hereby indemnifies and holds the Marketplace harmless from any claims regarding undisclosed liens, unpaid taxes, or insurance cancellations affecting the acquired assets.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 5: INDEMNIFICATION; LIMITATION OF LIABILITY; RELEASE</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1. Broad Form Indemnification by Buyer.</h3>
      <p className="text-gray-700 mb-4">
        Buyer agrees to unconditionally indemnify, defend, and hold harmless the Marketplace, its parent entities, subsidiaries, affiliates, and their respective directors, officers, employees, agents, successors, and assigns (collectively, the &quot;Indemnified Parties&quot;) from and against any and all losses, damages, liabilities, deficiencies, claims, actions, judgments, settlements, interest, awards, penalties, fines, costs, or expenses of whatever kind, including reasonable attorneys’ fees, the costs of enforcing any right to indemnification under this Agreement, and the cost of pursuing any insurance providers. This indemnification obligation extends to any claim or cause of action arising out of or resulting from: (i) Buyer’s breach of any representation, warranty, or covenant contained in this Agreement (specifically including the Non-Solicitation and Proof of Funds obligations); (ii) Buyer’s violation of any applicable federal, state, or local law, regulation, or ordinance, including FMCSA regulations, Anti-Money Laundering laws, and the Corporate Transparency Act; (iii) any claim asserting &quot;Successor Liability&quot; against the Marketplace resulting from Buyer’s acquisition of an asset; or (iv) any misuse of the Confidential Information by Buyer or its Representatives. Buyer expressly acknowledges that this duty to indemnify encompasses claims arising from the Indemnified Parties&apos; own passive negligence to the maximum extent permitted by Arizona law.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2. Assumption of Defense and Settlement Restrictions.</h3>
      <p className="text-gray-700 mb-4">
        Buyer acknowledges that its duty to defend the Indemnified Parties is absolute, immediate, and separate from its duty to indemnify. Upon the assertion of any claim or the commencement of any action against an Indemnified Party, Buyer shall immediately assume the defense thereof with legal counsel reasonably acceptable to the Marketplace. The Marketplace reserves the right to employ its own separate counsel and participate in the defense of any such claim at Buyer’s sole expense if the Marketplace reasonably determines that a conflict of interest exists or that Buyer has failed to diligently defend the action. Buyer shall not settle or compromise any claim or consent to the entry of any judgment without the prior written consent of the Marketplace, unless such settlement involves solely the payment of money by Buyer and includes a complete, unconditional release of the Indemnified Parties from all liability.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.3. DISCLAIMER OF WARRANTIES AND &quot;AS-IS&quot; CONDITION.</h3>
      <p className="text-gray-700 mb-4">
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE ARIZONA LAW, THE MARKETPLACE SERVICES, THE DATA ROOM, AND ALL LISTING CONTENT ARE PROVIDED SOLELY ON AN &quot;AS IS,&quot; &quot;AS AVAILABLE,&quot; AND &quot;WITH ALL FAULTS&quot; BASIS. THE MARKETPLACE EXPRESSLY AND CATEGORICALLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ACCURACY. THE MARKETPLACE DOES NOT WARRANT THAT THE DATA ROOM CONTENT IS COMPLETE, ERROR-FREE, OR COMPLIANT WITH FMCSA REGULATIONS.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.4. ABSOLUTE LIMITATION OF LIABILITY.</h3>
      <p className="text-gray-700 mb-4">
        IN NO EVENT SHALL THE MARKETPLACE BE LIABLE TO BUYER OR ANY THIRD PARTY FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF GOODWILL, LOSS OF DATA, OR BUSINESS INTERRUPTION, WHETHER ARISING IN CONTRACT, TORT INCLUDING NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE. NOTWITHSTANDING ANYTHING TO THE CONTRARY HEREIN, THE MARKETPLACE’S CUMULATIVE AGGREGATE LIABILITY TO BUYER FOR ANY CAUSE OF ACTION SHALL IN NO EVENT EXCEED THE GREATER OF: (A) THE TOTAL FEES ACTUALLY PAID BY BUYER TO THE MARKETPLACE DURING THE SIX (6) MONTH PERIOD PRECEDING THE CLAIM; OR (B) FIVE HUNDRED DOLLARS ($500.00). BUYER ACKNOWLEDGES THAT THIS LIMITATION OF LIABILITY IS A FUNDAMENTAL BASIS OF THE BARGAIN AND THAT THE MARKETPLACE WOULD NOT PROVIDE ACCESS TO THE DATA ROOM WITHOUT SUCH LIMITATIONS.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 6: DISPUTE RESOLUTION; GENERAL PROVISIONS</h2>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.1. Mandatory Binding Arbitration and Class Action Waiver.</h3>
      <p className="text-gray-700 mb-4">
        Any dispute, controversy, or claim arising out of or relating to this Agreement, including the breach, termination, enforcement, interpretation, or validity thereof, shall be determined by binding individual arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. The arbitration shall be conducted in Phoenix, Arizona, before a single neutral arbitrator. The parties expressly agree that this Agreement evidences a transaction involving interstate commerce and shall be governed by the Federal Arbitration Act (9 U.S.C. § 1 et seq.). Buyer hereby waives any constitutional and statutory rights to sue in court and have a trial in front of a judge or a jury. Furthermore, Buyer agrees that any arbitration shall be conducted in its individual capacity only and not as a class action or other representative action. The arbitrator shall have the exclusive authority to resolve any dispute relating to the interpretation, applicability, enforceability, or formation of this Agreement (Delegation Clause).
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.2. Equitable Relief and Provisional Remedies in Aid of Arbitration.</h3>
      <p className="text-gray-700 mb-4">
        Notwithstanding the mandatory arbitration provision in Section 6.1, the parties acknowledge that a breach or threatened breach of Article 2 (Confidentiality and Non-Solicitation) or Article 3 (Fee Integrity) would cause irreparable harm to the Marketplace and its user ecosystem for which monetary damages would be an inadequate remedy. Accordingly, the Marketplace is expressly authorized to seek immediate &quot;provisional remedies,&quot; including temporary restraining orders (TROs), preliminary injunctions, and specific performance, in any state or federal court of competent jurisdiction located in Maricopa County, Arizona. The parties agree that such judicial relief shall be sought solely in aid of arbitration to preserve the status quo or prevent the dissipation of assets/trade secrets pending the arbitrator’s final ruling. Buyer hereby waives any requirement that the Marketplace post a bond or other security as a condition for obtaining any such injunctive relief. The pursuit of equitable relief under this Section shall not constitute a waiver of the Marketplace’s right to arbitrate the underlying merits of the dispute or to seek monetary damages, which proceedings shall continue in parallel with any judicial action for injunctive relief. Buyer hereby submits to the personal jurisdiction of the courts of Arizona for the limited purpose of such equitable claims and waives any objection based on forum non conveniens.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.3. Governing Law and Forum Selection.</h3>
      <p className="text-gray-700 mb-4">
        This Agreement and all claims or causes of action (whether in contract, tort, or statute) that may be based upon, arise out of, or relate to this Agreement shall be governed by and construed in accordance with the internal laws of the State of Arizona, without giving effect to any choice or conflict of law provision or rule.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.4. Entire Agreement and Merger.</h3>
      <p className="text-gray-700 mb-4">
        This Agreement, together with the Privacy Policy and any specific Non-Disclosure Agreements (NDAs) executed regarding a specific asset, constitutes the sole and entire agreement of the parties with respect to the subject matter contained herein, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral. Buyer acknowledges that it has not relied on any statement, promise, or representation made by any Marketplace employee or agent that is not expressly contained in this Agreement.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.5. Non-Assignment and Change of Control. This Agreement and the access rights granted hereunder are strictly personal to the Buyer.</h3>
      <p className="text-gray-700 mb-4">
        Buyer shall not assign, transfer, delegate, sell, or sublicense any of its rights or obligations under this Agreement—including its User Account, &quot;Verified Buyer&quot; status, or access to any Data Room—whether voluntarily, involuntarily, by operation of law, or otherwise, without the prior express written consent of the Marketplace, which consent may be withheld in the Marketplace’s sole discretion. For purposes of this Agreement, a &quot;Change of Control&quot; of the Buyer (defined as the sale of more than fifty percent (50%) of Buyer’s equity or voting interests, or a merger/consolidation) shall be deemed an assignment requiring the Marketplace’s consent. Any purported assignment, transfer, or Change of Control in violation of this Section shall be null and void ab initio and shall constitute a material breach resulting in immediate termination. Buyer agrees that it shall remain jointly and severally liable for any acts or omissions of any unapproved assignee or transferee using its credentials.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.6. Electronic Notices and Service of Process.</h3>
      <p className="text-gray-700 mb-4">
        Buyer consents to receive all communications, notices, agreements, and disclosures from the Marketplace electronically. Buyer specifically agrees that the Marketplace may effectuate service of process for any arbitration or legal proceeding by emailing the requisite legal documents to the email address on record in Buyer’s User Account. Buyer agrees that such email service shall constitute valid and effective service of process under applicable law.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.7. Severability and &quot;Blue Pencil&quot; Reformation.</h3>
      <p className="text-gray-700 mb-4">
        If any term, provision, covenant, or condition of this Agreement is held by a court or arbitrator of competent jurisdiction to be invalid, void, or unenforceable, the remainder of the provisions shall remain in full force and effect and shall in no way be affected, impaired, or invalidated. In the event that a restrictive covenant is found to be unenforceable due to its duration, geographical scope, or breadth of activity, the parties explicitly authorize and instruct the adjudicator to &quot;blue pencil&quot; or judicially reform such provision to the maximum extent enforceable under applicable law, rather than striking the provision entirely. The parties agree that this power of reformation is essential to preserving the original commercial intent and economic bargain of this Agreement.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.8. Survival.</h3>
      <p className="text-gray-700 mb-4">
        The rights and obligations set forth in Article 2 (Confidentiality and Non-Solicitation), Article 3 (Fee Integrity), Article 5 (Indemnification and Liability), and Article 6 (Dispute Resolution) shall survive the termination, expiration, or cancellation of this Agreement, the deactivation of Buyer’s account, or the conclusion of any transaction for the periods specified herein, or if no period is specified, indefinitely.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.9. Representations of Authority and Personal Liability for Fraud.</h3>
      <p className="text-gray-700 mb-4">
        If Buyer is an entity (e.g., corporation, LLC, or partnership), the individual executing this Agreement by clicking &quot;I Agree&quot; (the &quot;Signatory&quot;) represents and warrants that they are a duly authorized officer, agent, or representative of such entity with full legal authority to bind the entity to these Terms. Notwithstanding the foregoing, the Signatory expressly agrees that they shall be personally liable, jointly and severally with the purported Buyer, for all obligations, damages, indemnities, and fees arising under this Agreement in the event that: (i) the Buyer entity does not exist, is dissolved, or is not in good standing with its jurisdiction of formation at the time of execution; (ii) the Signatory lacks the actual authority to bind the entity; (iii) the Signatory utilizes a false identity, alias, or stolen credentials to access the Platform; or (iv) the corporate form is utilized to perpetuate a fraud or circumvent the Marketplace’s fee structure. The Signatory hereby knowingly and voluntarily waives any common law or statutory &quot;corporate shield&quot; or &quot;piercing the corporate veil&quot; defenses and agrees to indemnify the Marketplace for all legal costs incurred in establishing the Signatory’s personal liability under this Section.
      </p>
    </div>
  )
}

export const TermsContent = ({ role }: { role?: string }) => {
  if (role === 'buyer') {
    return <BuyerTermsContent />
  }
  return <SellerTermsContent />
}

export const PrivacyContent = () => {
  return (
    <div className="prose prose-gray max-w-none">
      <p className="text-sm text-gray-500 mb-6">Jurisdiction: United States (Federal); State of Arizona</p>

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
  )
}
