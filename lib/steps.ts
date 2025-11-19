export type Step = {
  id: number;
  title: string;
  subtitle: string;
  who: string;
  timeline: string;
  content: string;
};

export const immigrationSteps: Step[] = [
  {
    id: 1,
    title: "File Form I-130",
    subtitle: "Petition for Alien Relative",
    who: "U.S. Citizen Petitioner",
    timeline: "14-16 months",
    content: `
      <h3>📋 Overview</h3>
      <p>The U.S. citizen spouse must file Form I-130 to establish the validity of your marriage and begin the immigration process.</p>
      
      <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #1976D2;">👤 Who Files:</strong> U.S. Citizen Petitioner (Spouse)<br>
        <strong style="color: #1976D2;">⏱️ Timeline:</strong> 14-16 months average processing time<br>
        <strong style="color: #1976D2;">📍 Where to File:</strong> Online via <a href="https://myaccount.uscis.gov" target="_blank" style="color: #0d47a1; font-weight: bold; text-decoration: underline;">USCIS Website</a> or by mail
      </div>

      <h3>📄 Required Documents</h3>
      <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin: 10px 0;">
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong style="color: #d32f2f;">Marriage Certificate:</strong> NADRA-issued computerized marriage certificate (Urdu + English) from Union Council, TMA, or Cantonment Board</li>
          <li><strong style="color: #d32f2f;">Proof of U.S. Citizenship:</strong> U.S. passport, birth certificate, or naturalization certificate</li>
          <li><strong style="color: #d32f2f;">Passport Copies:</strong> Bio-data pages of both spouses</li>
          <li><strong style="color: #d32f2f;">CNIC Copies:</strong> Pakistani spouse's Computerized National Identity Card</li>
          <li><strong style="color: #d32f2f;">Proof of Relationship:</strong> Wedding photos, communication logs, joint bank accounts, travel records</li>
          <li><strong style="color: #d32f2f;">Termination of Previous Marriages:</strong> Divorce decrees or death certificates if applicable</li>
          <li><strong style="color: #d32f2f;">Passport-Style Photos:</strong> 2 photos of each spouse</li>
        </ul>
      </div>

      <h3>💰 Fees</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background-color: #2196F3; color: white;">
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Item</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">USD</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">PKR (Approx)</th>
        </tr>
        <tr style="background-color: #fff3e0;">
          <td style="border: 1px solid #ddd; padding: 10px;"><strong>Form I-130 Filing Fee</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;"><strong style="color: #e65100; font-size: 16px;">$675</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;"><strong style="color: #e65100; font-size: 16px;">₨187,000</strong></td>
        </tr>
      </table>

      <h3>🔍 How to File</h3>
      <div style="background-color: #f3e5f5; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <ol style="margin: 0; padding-left: 25px; line-height: 1.8;">
          <li>Create an account on <a href="https://myaccount.uscis.gov" target="_blank" style="color: #6a1b9a; font-weight: bold; text-decoration: underline;">myaccount.uscis.gov</a></li>
          <li>Complete Form I-130 online or download PDF</li>
          <li>Upload/mail all supporting documents</li>
          <li>Pay filing fee online or by check</li>
          <li>Receive receipt notice (Form I-797) within 1-3 weeks</li>
          <li>Wait for approval notice</li>
        </ol>
      </div>

      <div style="background-color: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #c62828;">⚠️ Common Mistakes to Avoid:</strong>
        <ul style="margin: 10px 0; padding-left: 20px; color: #b71c1c;">
          <li>❌ Missing signatures or dates</li>
          <li>❌ Incomplete translations (ALL foreign documents must be translated)</li>
          <li>❌ Insufficient evidence of genuine marriage</li>
          <li>❌ Spelling inconsistencies across documents</li>
        </ul>
      </div>

      <h3>🔗 Important Resources</h3>
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin: 10px 0;">
        <a href="https://www.uscis.gov/i-130" target="_blank" style="display: block; margin: 8px 0; color: #1b5e20; font-weight: bold; text-decoration: underline;">🔗 USCIS Form I-130 Official Page</a>
        <a href="https://egov.uscis.gov/processing-times/" target="_blank" style="display: block; margin: 8px 0; color: #1b5e20; font-weight: bold; text-decoration: underline;">⏱️ Check Current Processing Times</a>
      </div>

      <div style="background-color: #fff9c4; border-left: 4px solid #f57f17; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <div style="font-size: 16px; font-weight: bold; color: #f57f17; margin-bottom: 10px;">🎯 Side Quest: Get NADRA Marriage Certificate</div>
        <p><strong>Documents Needed:</strong></p>
        <ul style="margin: 8px 0; padding-left: 20px;">
          <li>📋 Original Nikah Nama (Urdu marriage contract)</li>
          <li>🪪 CNICs of bride, groom, and both fathers</li>
          <li>👰 CNIC of Nikah Khawan (officiant)</li>
          <li>🛂 Passport copies if one is foreign national</li>
        </ul>
        <p style="margin-top: 10px;"><strong>Where to Apply:</strong> Union Council, TMA office, or Cantonment Board</p>
        <p><strong>Fee:</strong> ₨300-500 | <strong>Timeline:</strong> 3-5 working days</p>
      </div>
    `,
  },
  {
    id: 2,
    title: "NVC Processing",
    subtitle: "National Visa Center Case Creation",
    who: "Both Petitioner & Beneficiary",
    timeline: "3-5 weeks",
    content: `
      <h3>📋 Overview</h3>
      <p>After USCIS approves the I-130, your case is sent to the National Visa Center (NVC) for pre-processing before your interview.</p>
      
      <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #1976D2;">👥 Who Acts:</strong> Both U.S. Petitioner and Pakistani Beneficiary<br>
        <strong style="color: #1976D2;">⏱️ Timeline:</strong> 3-5 weeks for NVC to create case and send instructions<br>
        <strong style="color: #1976D2;">📝 What Happens:</strong> NVC assigns case number and invoice IDs
      </div>

      <h3>📄 Steps at NVC</h3>
      <div style="background-color: #f3e5f5; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <ol style="margin: 0; padding-left: 25px; line-height: 1.9;">
          <li><strong>Receive Welcome Letter:</strong> NVC sends case number (starts with ISL) and invoice IDs via email/mail</li>
          <li><strong>Create CEAC Account:</strong> Go to <a href="https://ceac.state.gov/IV" target="_blank" style="color: #6a1b9a; font-weight: bold; text-decoration: underline;">ceac.state.gov/IV</a> and register using case number</li>
          <li><strong>Pay Fees Online:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>Form DS-260 Processing Fee: <span style="color: #d32f2f; font-weight: bold;">$325</span></li>
              <li>Affidavit of Support Review Fee: <span style="color: #d32f2f; font-weight: bold;">$120</span></li>
            </ul>
          </li>
          <li><strong>Submit Form DS-260:</strong> Online Immigrant Visa Application</li>
          <li><strong>Submit Civil Documents:</strong> Marriage certificate, birth certificates, police certificates, etc.</li>
          <li><strong>Submit Affidavit of Support:</strong> Form I-864 with financial documents</li>
        </ol>
      </div>

      <h3>💰 Total NVC Fees</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background-color: #2196F3; color: white;">
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Item</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">USD</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">PKR (Approx)</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 10px;">DS-260 Processing Fee</td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">$325</td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">₨90,000</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="border: 1px solid #ddd; padding: 10px;">Affidavit of Support Fee</td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">$120</td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">₨33,000</td>
        </tr>
        <tr style="background-color: #fff3e0;">
          <td style="border: 1px solid #ddd; padding: 10px;"><strong>Total</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;"><strong style="color: #e65100; font-size: 16px;">$445</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;"><strong style="color: #e65100; font-size: 16px;">₨123,000</strong></td>
        </tr>
      </table>

      <h3>📧 Important Contact</h3>
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin: 10px 0;">
        <p style="margin: 0;"><a href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/ask-nvc.html" target="_blank" style="color: #1b5e20; font-weight: bold; text-decoration: underline;">📞 NVC Public Inquiry Form - Ask NVC</a></p>
      </div>

      <div style="background-color: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #c62828;">💡 Pro Tips:</strong>
        <ul style="margin: 10px 0; padding-left: 20px; color: #b71c1c;">
          <li>✅ Save your case number and invoice IDs immediately</li>
          <li>✅ Pay fees as soon as you receive invoice IDs</li>
          <li>✅ Don't start DS-260 until fees are paid and processed</li>
          <li>✅ Keep all NVC correspondence emails</li>
        </ul>
      </div>
    `,
  },
  {
    id: 3,
    title: "Complete DS-260 & Documents",
    subtitle: "Immigrant Visa Application",
    who: "Pakistani Beneficiary",
    timeline: "1-2 weeks to complete",
    content: `
      <h3>📋 Overview</h3>
      <p>Form DS-260 is the official immigrant visa application. You'll answer detailed questions about your background, family, education, work history, and travel.</p>
      
      <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #1976D2;">👤 Who Completes:</strong> Pakistani Beneficiary (Immigrating Spouse)<br>
        <strong style="color: #1976D2;">🌐 Where:</strong> Online at <a href="https://ceac.state.gov/IV" target="_blank" style="color: #0d47a1; font-weight: bold; text-decoration: underline;">ceac.state.gov/IV</a><br>
        <strong style="color: #1976D2;">⏱️ Time to Complete:</strong> 2-4 hours (can save and return)<br>
        <strong style="color: #1976D2;">🗣️ Languages:</strong> Available in English and Urdu
      </div>

      <h3>📝 DS-260 Form Sections</h3>
      <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin: 10px 0;">
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong style="color: #1976D2;">Personal Information:</strong> Name, date of birth, place of birth, nationality</li>
          <li><strong style="color: #1976D2;">Address & Phone:</strong> Current and previous addresses (5 years)</li>
          <li><strong style="color: #1976D2;">Family Information:</strong> Parents, siblings, children</li>
          <li><strong style="color: #1976D2;">Present Work/Education:</strong> Employment history (10 years)</li>
          <li><strong style="color: #1976D2;">Previous Work/Education:</strong> Schools attended</li>
          <li><strong style="color: #1976D2;">Security Questions:</strong> Criminal history, health, immigration violations</li>
          <li><strong style="color: #1976D2;">Travel History:</strong> Previous U.S. visits, other countries visited</li>
        </ul>
      </div>

      <h3>📄 Civil Documents to Upload to NVC</h3>
      <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin: 10px 0;">
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong style="color: #d32f2f;">Birth Certificate:</strong> From Union Council (Urdu + English translation)</li>
          <li><strong style="color: #d32f2f;">Marriage Certificate:</strong> NADRA computerized certificate</li>
          <li><strong style="color: #d32f2f;">Police Clearance Certificate:</strong> From Police Khidmat Markaz or SSP office</li>
          <li><strong style="color: #d32f2f;">Passport Bio-pages:</strong> Pakistani passport valid for 6+ months</li>
          <li><strong style="color: #d32f2f;">Divorce/Death Certificates:</strong> If previously married</li>
          <li><strong style="color: #d32f2f;">Military Records:</strong> If applicable</li>
          <li><strong style="color: #d32f2f;">Court/Prison Records:</strong> If applicable</li>
        </ul>
      </div>

      <div style="background-color: #fff9c4; border-left: 4px solid #f57f17; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #f57f17;">💡 DS-260 Tips:</strong>
        <ul style="margin: 10px 0; padding-left: 20px; color: #f57f17;">
          <li>✅ Answer every question honestly and completely</li>
          <li>✅ Use same name spelling as passport throughout</li>
          <li>✅ Have all documents ready before starting</li>
          <li>✅ Save frequently - session times out after 20 minutes</li>
          <li>✅ You can unlock to edit after submission if needed (but causes delays)</li>
        </ul>
      </div>
    `,
  },
  {
    id: 4,
    title: "Submit Form I-864",
    subtitle: "Affidavit of Support",
    who: "U.S. Citizen Petitioner",
    timeline: "1-2 weeks to prepare",
    content: `
      <h3>📋 Overview</h3>
      <p>The U.S. petitioner must prove they can financially support the immigrant spouse at <strong style="color: #d32f2f;">125% of the Federal Poverty Guidelines</strong>.</p>
      
      <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #1976D2;">👤 Who Files:</strong> U.S. Citizen Petitioner (Sponsor)<br>
        <strong style="color: #1976D2;">🎯 Purpose:</strong> Prove financial ability to support immigrant<br>
        <strong style="color: #1976D2;">📋 Status:</strong> Legally enforceable contract<br>
        <strong style="color: #1976D2;">📤 Where to Submit:</strong> Upload to NVC via CEAC portal
      </div>

      <h3>💰 2025 Income Requirements</h3>
      <p><strong style="color: #d32f2f;">Minimum income must be 125% of Federal Poverty Guidelines:</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background-color: #2196F3; color: white;">
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Household Size</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Minimum Annual Income</th>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="border: 1px solid #ddd; padding: 10px;"><strong>2 persons</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #d32f2f;"><strong>$24,650</strong></td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 10px;"><strong>3 persons</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #d32f2f;"><strong>$31,050</strong></td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="border: 1px solid #ddd; padding: 10px;"><strong>4 persons</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #d32f2f;"><strong>$37,450</strong></td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 10px;"><strong>5 persons</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #d32f2f;"><strong>$43,850</strong></td>
        </tr>
      </table>

      <h3>📄 Required Documents for I-864</h3>
      <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin: 10px 0;">
        <ul style="margin: 0; padding-left: 20px;">
          <li>Last 3 years of tax returns</li>
          <li>Recent paystubs (last 3 months)</li>
          <li>Letter from employer (if self-employed)</li>
          <li>Bank statements showing liquid assets</li>
          <li>Property deeds/mortgage statements</li>
        </ul>
      </div>
    `,
  },
  {
    id: 5,
    title: "Medical Examination",
    subtitle: "Panel Physician Exam & Vaccinations",
    who: "Pakistani Beneficiary",
    timeline: "1-2 days for exam + results",
    content: `
      <h3>📋 Overview</h3>
      <p>All immigrant visa applicants must undergo a medical examination by a U.S. Embassy-approved panel physician in Pakistan.</p>
      
      <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #1976D2;">👤 Who:</strong> Pakistani Beneficiary (Immigrating Spouse)<br>
        <strong style="color: #1976D2;">⏰ When:</strong> After NVC schedules your interview (typically 30-60 days before)<br>
        <strong style="color: #1976D2;">📍 Where:</strong> Panel physicians in Islamabad, Karachi, or Lahore<br>
        <strong style="color: #1976D2;">✅ Validity:</strong> Medical exam valid for 6 months
      </div>

      <h3>💉 Required Vaccinations</h3>
      <p><strong>U.S. immigration requires proof of the following vaccinations:</strong></p>
      <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin: 10px 0;">
        <ul style="margin: 0; padding-left: 20px;">
          <li>🩹 Hepatitis A & B</li>
          <li>🩹 Influenza</li>
          <li>🩹 Measles, Mumps, Rubella (MMR)</li>
          <li>🩹 Polio</li>
          <li>🩹 Tetanus and Diphtheria</li>
        </ul>
      </div>

      <h3>🏥 Panel Physicians in Pakistan</h3>
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin: 10px 0;">
        <p><strong>Contact the U.S. Embassy for a list of approved panel physicians:</strong></p>
        <a href="https://pk.usembassy.gov" target="_blank" style="color: #1b5e20; font-weight: bold; text-decoration: underline;">🔗 U.S. Embassy Pakistan Website</a>
      </div>
    `,
  },
  {
    id: 6,
    title: "Interview Preparation",
    subtitle: "U.S. Embassy Interview",
    who: "Pakistani Beneficiary (+ Petitioner optional)",
    timeline: "Interview scheduled 3-6 months after NVC completion",
    content: `
      <h3>📋 Overview</h3>
      <p>The final major step is the visa interview at the U.S. Embassy in Islamabad. This is where a consular officer will determine if you qualify for the CR-1/IR-1 visa.</p>
      
      <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #1976D2;">👥 Who Attends:</strong> Pakistani Beneficiary (required), U.S. Petitioner (optional but recommended)<br>
        <strong style="color: #1976D2;">📍 Where:</strong> U.S. Embassy, Diplomatic Enclave, Ramna 5, Islamabad<br>
        <strong style="color: #1976D2;">⏱️ Duration:</strong> Wait time varies, actual interview 10-30 minutes<br>
        <strong style="color: #1976D2;">🗣️ Language:</strong> Conducted in English (interpreter available if needed)
      </div>

      <h3>❓ Common Interview Questions</h3>
      <p><strong style="color: #1976D2;">About Your Relationship:</strong></p>
      <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin: 10px 0;">
        <ul style="margin: 0; padding-left: 20px;">
          <li>💬 How did you meet your spouse?</li>
          <li>💬 When and where did you get married?</li>
          <li>💬 Who attended your wedding?</li>
          <li>💬 How do you communicate with your spouse?</li>
          <li>💬 When do you plan to move to the U.S.?</li>
          <li>💬 How long have you been married?</li>
        </ul>
      </div>

      <h3>✅ What to Bring to Interview</h3>
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin: 10px 0;">
        <ul style="margin: 0; padding-left: 20px;">
          <li>✅ Valid passport</li>
          <li>✅ Appointment letter from NVC</li>
          <li>✅ Medical examination results (sealed)</li>
          <li>✅ All required documents (originals + copies)</li>
          <li>✅ Police clearance certificate</li>
          <li>✅ Birth certificate</li>
          <li>✅ Marriage certificate</li>
        </ul>
      </div>

      <div style="background-color: #fff9c4; border-left: 4px solid #f57f17; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #f57f17;">💡 Interview Tips:</strong>
        <ul style="margin: 10px 0; padding-left: 20px; color: #f57f17;">
          <li>✅ Arrive 15 minutes early</li>
          <li>✅ Dress professionally</li>
          <li>✅ Be honest and straightforward with answers</li>
          <li>✅ Keep answers concise and relevant</li>
          <li>✅ Bring both originals and copies of all documents</li>
        </ul>
      </div>
    `,
  },
  {
    id: 7,
    title: "Receive Visa & Travel",
    subtitle: "Final Steps in Pakistan",
    who: "Pakistani Beneficiary",
    timeline: "5-10 days for visa, then travel",
    content: `
      <h3>📋 Overview</h3>
      <p>After approval, you'll receive your immigrant visa and can begin preparing for your journey to the United States.</p>
      
      <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #1976D2;">⏱️ Timeline:</strong> Visa ready 5-10 working days after approval<br>
        <strong style="color: #1976D2;">🛂 Visa Validity:</strong> 6 months from medical exam date<br>
        <strong style="color: #1976D2;">✈️ Entry Deadline:</strong> Must enter U.S. before visa expires<br>
        <strong style="color: #1976D2;">📦 What You Get:</strong> Passport with visa stamp + sealed immigrant packet
      </div>

      <h3>🔍 After Approval Steps</h3>
      <div style="background-color: #f3e5f5; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <ol style="margin: 0; padding-left: 25px; line-height: 1.8;">
          <li>Visa will be placed in your passport</li>
          <li>You'll receive a sealed brown envelope with medical results and documents</li>
          <li>Do NOT open this sealed envelope - give it to USCIS at U.S. entry</li>
          <li>Book your flight within the visa validity period</li>
          <li>Notify your petitioner of your travel dates</li>
        </ol>
      </div>

      <h3>✈️ Airlines from Pakistan to USA</h3>
      <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin: 10px 0;">
        <ul style="margin: 0; padding-left: 20px;">
          <li>🛫 <strong>Emirates</strong> (via Dubai)</li>
          <li>🛫 <strong>Qatar Airways</strong> (via Doha)</li>
          <li>🛫 <strong>Turkish Airlines</strong> (via Istanbul)</li>
          <li>🛫 <strong>PIA</strong> (Pakistan International Airlines - limited direct routes)</li>
        </ul>
      </div>

      <h3>📋 What to Do at U.S. Airport</h3>
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin: 10px 0;">
        <ol style="margin: 0; padding-left: 25px; line-height: 1.8;">
          <li>Go to Immigration/CBP desk with your passport and visa</li>
          <li>Present the sealed brown envelope with medical results</li>
          <li>Answer immigration officer's questions</li>
          <li>Get your passport stamped - you are now a Lawful Permanent Resident (LPR)</li>
          <li>Collect your baggage and proceed</li>
        </ol>
      </div>

      <h3>🏠 After Entry to USA</h3>
      <div style="background-color: #fff9c4; border-left: 4px solid #f57f17; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #f57f17;">Important Actions Within First Month:</strong>
        <ul style="margin: 10px 0; padding-left: 20px; color: #f57f17;">
          <li>✅ Apply for Social Security Number (SSN)</li>
          <li>✅ Get a driver's license or state ID</li>
          <li>✅ Open a bank account</li>
          <li>✅ Apply for U.S. address and update information</li>
          <li>✅ Register for health insurance if needed</li>
        </ul>
      </div>

      <h3>🟢 Green Card Processing</h3>
      <p>Your Green Card (Permanent Resident Card) will be mailed to your U.S. address within 1-2 weeks after entry.</p>
    `,
  },
  {
    id: 8,
    title: "Remove Conditions (I-751)",
    subtitle: "2-Year Green Card → 10-Year Green Card",
    who: "Both Spouses",
    timeline: "File 90 days before 2-year anniversary",
    content: `
      <h3>📋 Overview</h3>
      <p>If you were married for less than 2 years when you became a permanent resident, you'll receive a <strong style="color: #d32f2f;">conditional Green Card valid for 2 years</strong>. You must file Form I-751 to remove conditions.</p>
      
      <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #1976D2;">✅ Applies To:</strong> CR-1 visa holders (married less than 2 years)<br>
        <strong style="color: #1976D2;">❌ Does NOT Apply To:</strong> IR-1 visa holders (married 2+ years)<br>
        <strong style="color: #1976D2;">📅 When to File:</strong> 90-day window before 2-year anniversary of becoming LPR<br>
        <strong style="color: #1976D2;">👥 Who Files:</strong> Both spouses jointly
      </div>

      <h3>📄 Form I-751 Requirements</h3>
      <p><strong style="color: #1976D2;">Proof Marriage is Genuine and Ongoing:</strong></p>
      <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin: 10px 0;">
        <ul style="margin: 0; padding-left: 20px;">
          <li>💳 Joint bank account statements</li>
          <li>📄 Joint tax returns</li>
          <li>📸 Photos together throughout 2 years</li>
          <li>👶 Birth certificates of children born during marriage</li>
          <li>🏠 Joint lease or mortgage documents</li>
          <li>💬 Affidavits from friends/family</li>
          <li>📱 Phone bills or utility bills showing both names</li>
        </ul>
      </div>

      <h3>💰 Form I-751 Fees</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background-color: #2196F3; color: white;">
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Item</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">USD</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">PKR (Approx)</th>
        </tr>
        <tr style="background-color: #fff3e0;">
          <td style="border: 1px solid #ddd; padding: 10px;"><strong>Form I-751 Filing Fee</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;"><strong style="color: #e65100;">$680</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;"><strong style="color: #e65100;">₨188,000</strong></td>
        </tr>
      </table>

      <h3>⏱️ I-751 Processing Timeline</h3>
      <div style="background-color: #f3e5f5; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>📅 <strong>90 days before</strong> 2-year anniversary: Start filing I-751</li>
          <li>📧 <strong>1-3 weeks:</strong> Receive receipt notice (I-797)</li>
          <li>🕐 <strong>12-18 months:</strong> Average processing time</li>
          <li>✅ <strong>Upon approval:</strong> Receive 10-year permanent resident card</li>
        </ul>
      </div>

      <h3>🔗 Important Resources</h3>
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin: 10px 0;">
        <a href="https://www.uscis.gov/i-751" target="_blank" style="display: block; margin: 8px 0; color: #1b5e20; font-weight: bold; text-decoration: underline;">🔗 USCIS Form I-751 Official Page</a>
        <a href="https://egov.uscis.gov/processing-times/" target="_blank" style="display: block; margin: 8px 0; color: #1b5e20; font-weight: bold; text-decoration: underline;">⏱️ Check I-751 Processing Times</a>
      </div>

      <div style="background-color: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <strong style="color: #c62828;">⚠️ Important Reminders:</strong>
        <ul style="margin: 10px 0; padding-left: 20px; color: #b71c1c;">
          <li>❌ Do NOT file after the 90-day window closes</li>
          <li>❌ Missing the deadline can result in deportation</li>
          <li>✅ File jointly with your spouse - dual filing is required</li>
          <li>✅ Include strong evidence of genuine marriage</li>
        </ul>
      </div>
    `,
  },
];