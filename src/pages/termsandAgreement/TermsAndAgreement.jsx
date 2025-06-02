import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/public/Navbar";
import "./index.scss";

const TermsAndAgreement = () => {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();
  const handleCreateNewClick = () => {
    navigate(-1);
  };

  const sections = [
    {
      title: "1. THE APPLICATION",
      content: `PMU Forms (hereinafter: Application) is a piece of software created to Allow people to fill out consent and aftercare forms for the permanent makeup industry. - and customized for Apple mobile devices. It is used to View and sign PMU forms.

The Application is not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use this Application. You may not use the Application in a way that would violate the Gramm-Leach-Bliley Act (GLBA).`,
    },
    {
      title: "2. SCOPE OF LICENSE",
      content: `2.1 You are given a non-transferable, non-exclusive, non-sublicensable license to install and use the Licensed Application on any Apple-branded Products that You (End-User) own or control and as permitted by the Usage Rules set forth in this section and the App Store Terms of Service, with the exception that such licensed Application may be accessed and used by other accounts associated with You (End-User, The Purchaser) via Family Sharing or volume purchasing.

2.2 This license will also govern any updates of the Application provided by Licensor that replace, repair, and/or supplement the first Application, unless a separate license is provided for such update in which case the terms of that new license will govern.

2.3 You may not share or make the Application available to third parties (unless to the degree allowed by the Apple Terms and Conditions, and with Arojem Solutions LLC prior written consent), sell, rent, lend, lease or otherwise redistribute the Application.

2.4 You may not reverse engineer, translate, disassemble, integrate, decompile, integrate, remove, modify, combine, create derivative works or updates of, adapt, or attempt to derive the source code of the Application, or any part thereof (except with Arojem Solutions LLC prior written consent).

2.5 You may not copy (excluding when expressly authorized by this license and the Usage Rules) or alter the Application or portions thereof. You may create and store copies only on devices that You own or control for backup keeping under the terms of this license, the App Store Terms of Service, and any other terms and conditions that apply to the device or software used. You may not remove any intellectual property notices. You acknowledge that no unauthorized third parties may gain access to these copies at any time.

2.6 Violations of the obligations mentioned above, as well as the attempt of such infringement, may be subject to prosecution and damages.

2.7 Licensor reserves the right to modify the terms and conditions of licensing.

2.8 Nothing in this license should be interpreted to restrict third-party terms. When using the Application, You must ensure that You comply with applicable third-party terms and conditions.`,
    },
    {
      title: "3. TECHNICAL REQUIREMENTS",
      content: `3.1 Licensor attempts to keep the Application updated so that it complies with modified/new versions of the firmware and new hardware. You are not granted rights to claim such an update.

3.2 You acknowledge that it is Your responsibility to confirm and determine that the app end-user device on which You intend to use the Application satisfies the technical specifications mentioned above.

3.3 Licensor reserves the right to modify the technical specifications as it sees appropriate at any time.`,
    },
    {
      title: "4. MAINTENANCE AND SUPPORT",
      content: `4.1 The Licensor is solely responsible for providing any maintenance and support services for this licensed Application. You can reach the Licensor at the email address listed in the App Store Overview for this licensed Application.

4.2 Arojem Solutions LLC and the End-User acknowledge that Apple has no obligation whatsoever to furnish any maintenance and support services with respect to the licensed Application.`,
    },
    {
      title: "5. USE OF DATA",
      content: `You acknowledge that Licensor will be able to access and adjust Your downloaded licensed Application content and Your personal information, and that Licensor's use of such material and information is subject to Your legal agreements with Licensor and Licensor's privacy policy <a href='https://main.d399dszmqumyhd.amplifyapp.com/privacy-policy'>here</a>.`,
    },
    {
      title: "6. USER GENERATED CONTRIBUTIONS",
      content: `The Application does not offer users to submit or post content. We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or in the Application, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Application and through third-party websites or applications. As such, any Contributions you transmit may be treated in accordance with the Application Privacy Policy. When you create or make available any Contributions, you thereby represent and warrant that:

1. The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.
2. You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Application, and other users of the Application to use your Contributions in any manner contemplated by the Application and these Terms of Use.
3. You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness or each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Application and these Terms of Use.
4. Your Contributions are not false, inaccurate, or misleading.
5. Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.
6. Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).
7. Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.
8. Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.
9. Your Contributions do not violate any applicable law, regulation, or rule.
10. Your Contributions do not violate the privacy or publicity rights of any third party.
11. Your Contributions do not contain any material that solicits personal information from anyone under the age of 18 or exploits people under the age of 18 in a sexual or violent manner.
12. Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors.
13. Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.
14. Your Contributions do not otherwise violate, or link to material that violates, any provision of these Terms of Use, or any applicable law or regulation.

Any use of the Application in violation of the foregoing violates these Terms of Use and may result in, among other things, termination or suspension of your rights to use the Application.`,
    },
    {
      title: "7. CONTRIBUTION LICENSE",
      content: `You agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices (including settings).

By submitting suggestions of other feedback regarding the Application, you agree that we can use and share such feedback for any purpose without compensation to you.

We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area in the Application. You are solely responsible for your Contributions to the Application and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.`,
    },
    {
      title: "8. LIABILITY",
      content: `8.1 Licensor's responsibility in the case of violation of obligations and tort shall be limited to intent and gross negligence. Only in case of a breach of essential contractual duties (cardinal obligations), Licensor shall also be liable in case of slight negligence. In any case, liability shall be limited to the foreseeable, contractually typical damages. The limitation mentioned above does not apply to injuries to life, limb, or health.

8.2 Licensor takes no accountability or responsibility for any damages caused due to a breach of duties according to Section 2 of this Agreement. To avoid data loss, You are required to make use of backup functions of the Application to the extent allowed by applicable third-party terms and conditions of use. You are aware that in case of alterations or manipulations of the Application, You will not have access to licensed Application.`,
    },
    {
      title: "9. WARRANTY",
      content: `9.1 Licensor warrants that the Application is free of spyware, trojan horses, viruses, or any other malware at the time of Your download. Licensor warrants that the Application works as described in the user documentation.

9.2 No warranty is provided for the Application that is not executable on the device, that has been unauthorizedly modified, handled inappropriately or culpably, combined or installed with inappropriate hardware or software, used with inappropriate accessories, regardless if by Yourself or by third parties, or if there are any other reasons outside of Arojem Solutions LLC's sphere of influence that affect the executability of the Application.

9.3 You are required to inspect the Application immediately after installing it and notify Arojem Solutions LLC about issues discovered without delay by e-mail provided in Product Claims. The defect report will be taken into consideration and further investigated if it has been mailed within a period of thirty (30) days after discovery.

9.4 If we confirm that the Application is defective, Arojem Solutions LLC reserves a choice to remedy the situation either by means of solving the defect or substitute delivery.

9.5 In the event of any failure of the Application to conform to any applicable warranty, You may notify the App-Store-Operator, and Your Application purchase price will be refunded to You. To the maximum extent permitted by applicable law, the App-Store-Operator will have no other warranty obligation whatsoever with respect to the App, and any other losses, claims, damages, liabilities, expenses and costs attributable to any negligence to adhere to any warranty.

9.6 If the user is an entrepreneur, any claim based on faults expires after a statutory period of limitation amounting to twelve (12) months after the Application was made available to the user. The statutory periods of limitation given by law apply for users who are consumers.`,
    },
    {
      title: "10. PRODUCT CLAIMS",
      content: `Arojem Solutions LLC and the End-User acknowledge that Arojem Solutions LLC, and not Apple, is responsible for addressing any claims of the End-User or any third party relating to the licensed Application or the End-User's possession and/or use of that licensed Application, including, but not limited to:

(i) product liability claims;

(ii) any claim that the licensed Application fails to conform to any applicable legal or regulatory requirement; and

(iii) claims arising under consumer protection, privacy, or similar legislation, including in connection with Your Licensed Application's use of the HealthKit and HomeKit.`,
    },
    {
      title: "11. LEGAL COMPLIANCE",
      content: `You represent and warrant that You are not located in a country that is subject to a U.S. Government embargo, or that has been designated by the U.S. Government as a "terrorist supporting" country; and that You are not listed on any U.S. Government list of prohibited or restricted parties.`,
    },
    {
      title: "12. CONTACT INFORMATION",
      content: `For general inquiries, complaints, questions or claims concerning the licensed Application, please contact:
     
Arojem Solutions LLC
909 Reinli Street, Austin, TX, USA
Austin, TX 78751
United States
contact@pmuforms.com`,
    },
    {
      title: "13. TERMINATION",
      content: `The license is valid until terminated by Arojem Solutions LLC or by You. Your rights under this license will terminate automatically and without notice from Arojem Solutions LLC if You fail to adhere to any term(s) of this license. Upon License termination, You shall stop all use of the Application, and destroy all copies, full or partial, of the Application.`,
    },
    {
      title: "14. THIRD-PARTY TERMS OF AGREEMENTS AND BENEFICIARY",
      content: `Arojem Solutions LLC represents and warrants that Arojem Solutions LLC will comply with applicable third-party terms of agreement when using licensed Application.

In Accordance with Section 9 of the "Instructions for Minimum Terms of Developer's End-User License Agreement," Apple and Apple's subsidiaries shall be third-party beneficiaries of this End User License Agreement and - upon Your acceptance of the terms and conditions of this license agreement, Apple will have the right (and will be deemed to have accepted the right) to enforce this End User License Agreement against You as a third-party beneficiary thereof.`,
    },
    {
      title: "15. INTELLECTUAL PROPERTY RIGHTS",
      content: `Arojem Solutions LLC and the End-User acknowledge that, in the event of any third-party claim that the licensed Application or the End-User's possession and use of that licensed Application infringes on the third party's intellectual property rights, Arojem Solutions LLC, and not Apple, will be solely responsible for the investigation, defense, settlement and discharge or any such intellectual property infringement claims.`,
    },
    {
      title: "16. APPLICABLE LAW",
      content: `This license agreement is governed by the laws of the State of Texas excluding its conflicts of law rules.`,
    },
    {
      title: "17. MESSAGING TERMS & CONDITIONS",
      content: `When you opt-in to the service, we will send you a message to confirm your signup.`,
    },

    {
      title: "17. MISCELLANEOUS",
      content: `17.1 If any of the terms of this agreement should be or become invalid, the validity of the remaining provisions shall not be affected. Invalid terms will be replaced by valid ones formulated in a way that will achieve the primary purpose.
             
17.2 Collateral agreements, changes and amendments are only valid if laid down in writing. The preceding clause can only be waived in writing.`,
    },
  ];

  const toggleSection = (index) => {
    if (activeSection === index) {
      setActiveSection(null);
    } else {
      setActiveSection(index);
    }
  };

  return (
    <>
      <Navbar CreatenewClick={handleCreateNewClick} />
      <div className="terms-agreement-container">
        <div className="terms-header">
          <h1>END USER LICENSE AGREEMENT</h1>
          <p className="last-updated">Last updated April 19, 2025</p>
        </div>

        <div className="terms-intro">
          <p>
            PMU Forms is licensed to You (End-User) by Arojem Solutions LLC,
            located at 909 Reinli Street Unit 116, Austin, TX, USA, 78751,
            (hereinafter: Licensor), for use only under the terms of this
            License Agreement.
          </p>
          <p>
            By downloading the Application from the Apple AppStore, and any
            update thereto (as permitted by this License Agreement), You
            indicate that You agree to be bound by all of the terms and
            conditions of this License Agreement, and that You accept this
            License Agreement.
          </p>
          <p>
            The parties of this License Agreement acknowledge that Apple is not
            a Party to this License Agreement and is not bound by any provisions
            or obligations with regard to the Application, such as warranty,
            liability, maintenance and support thereof. Arojem Solutions LLC,
            not Apple, is solely responsible for the licensed Application and
            the content thereof.
          </p>
          <p>
            This License Agreement may not provide for usage rules for the
            Application that are in conflict with the latest App Store Terms of
            Service. Arojem Solutions LLC acknowledges that it had the
            opportunity to review said terms and this License Agreement is not
            conflicting with them.
          </p>
          <p>All rights not expressly granted to You are reserved.</p>
        </div>

        <div className="terms-header">
          <h1>Messaging Terms & Conditions</h1>
        </div>

        <div className="terms-intro">
          <h2>General</h2>
          <p>
            By downloading the Application from the Apple AppStore, and any
            update thereto (as permitted by this License Agreement), you agree
            to receive recurring automated marketing and informational text
            messages from PMU Forms. Automated messages may be sent using an
            automatic telephone dialing system to the mobile telephone number
            you provided when signing up or any other number that you designate.
          </p>
          <p>
            Message frequency varies, and additional mobile messages may be sent
            periodically based on your interaction with PMU Forms. PMU Forms
            reserves the right to alter the frequency of messages sent at any
            time to increase or decrease the total number of sent messages. PMU
            Forms also reserves the right to change the short code or phone
            number or alphanumeric sender where messages are sent
          </p>
          <p>
            Your usual message and data rates may apply. If you have any
            questions about your text plan or data plan, it is best to contact
            your mobile provider. Your mobile provider is not liable for delayed
            or undelivered messages.
          </p>
          <p>
            Your consent to receive marketing messages is not a condition of
            purchase.
          </p>
          <h2>Carriers</h2>
          <p>Carriers are not liable for delayed or undelivered messages.</p>
          <h2>Cancellation</h2>
          <p>
            Messages will provide instructions to unsubscribe either by texting
            STOP or through an included link. After you unsubscribe, we will
            send you a message to confirm that you have been unsubscribed and no
            more messages will be sent. If you would like to receive messages
            from PMU Forms again, just sign up as you did the first time and PMU
            Forms will start sending messages to you again.
          </p>
          <h2>Info</h2>
          <p>
            For support regarding our services, email us at contact@pmuforms.com
            or, if supported, text "HELP" to 5125211052 at any time and we will
            respond with instructions on how to unsubscribe. If we include a
            link in messages we send you from PMU Forms, you may also access
            instructions on how to unsubscribe and our company information by
            following that link.
          </p>
          <h2>Transfer of Number</h2>
          <p>
            You agree that before changing your mobile number or transferring
            your mobile number to another individual, you will either reply
            "STOP" from the original number or notify us of your old number at
            contact@pmuforms.com. The duty to inform us based on the above
            events is a condition of using this service to receive messages.
          </p>
          <h2>Privacy</h2>
          <p>
            If you have any questions about your data or our privacy practices,
            please visit our
            https://main.d399dszmqumyhd.amplifyapp.com/privacy-policy.
          </p>

          <h2>Messaging Terms Changes</h2>
          <p>
            We reserve the right to change or terminate our messaging program at
            any time. We also reserve the right to update these Messaging Terms
            at any time. Such changes will be effective immediately upon
            posting. If you do not agree to a change to these Messaging Terms,
            you should cancel your enrollment with our messaging program. Your
            continued enrollment following such changes shall constitute your
            acceptance of such changes.
          </p>
        </div>

        <div className="terms-accordion">
          {sections.map((section, index) => (
            <div className="accordion-item" key={index}>
              <div
                className={`accordion-header ${
                  activeSection === index ? "active" : ""
                }`}
                onClick={() => toggleSection(index)}
              >
                <h3>{section.title}</h3>
                <span className="accordion-icon">
                  {activeSection === index ? "−" : "+"}
                </span>
              </div>
              {activeSection === index && (
                <div className="accordion-content">
                  <div className="content-inner">
                    {section.content.split("\n\n").map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TermsAndAgreement;
